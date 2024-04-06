import { Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Job } from "bull";
import { EntityManager } from "@mikro-orm/postgresql";
import { ScaleJob } from "@/scale/scale.entity";
import { Worker } from "worker_threads";

@Injectable()
@Processor("scale-queue")
export class ScaleConsumer {
    private worker: Worker;

    constructor(
        private readonly em: EntityManager
    ) {
        this.worker = new Worker("./src/scale/scale.worker.ts");
        this.worker.on("error", (error) => {
            console.error("Worker error", error);
        });
        this.worker.on("exit", (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
        });
    }

    @Process("scale-job")
    async process(job:Job<any>){
        // grab the scale job from the database
        let scaleEntityForJob: ScaleJob;
        let emForkForJob: EntityManager;
        try {
            emForkForJob = this.em.fork();
            scaleEntityForJob = await emForkForJob.findOneOrFail(ScaleJob, {
                guid: job.data.guid
            });
            console.log("New scale job: ", scaleEntityForJob.guid);
        } catch (error) {
            console.error("Fetch error", error);
        }
        console.log("Processing scale job: ", scaleEntityForJob.guid);

        try {
            // push the scale buffer to our worker thread
            this.worker.postMessage({
                jobGuid: scaleEntityForJob.guid
            });

            // Wrap the worker in a promise to wait for the job to complete.
            // This ensures that our job does not end until the job is complete.
            // Logic is processed in worker thread to avoid blocking the main thread.
            // This allows nest to continue receiving HTTP requests while processing jobs.
            await new Promise<void>((resolve): void => {
                const onMessage = async () => {
                    console.log("Job complete: ", scaleEntityForJob.guid);
                    try {
                        scaleEntityForJob.pending = false;
                        await emForkForJob.flush();
                    } catch (error) {
                        console.error("Save error", error);
                    }

                    // Remove this listener to prevent memory leaks
                    this.worker.off("message", onMessage);
                    resolve();
                };
                this.worker.on("message", onMessage);
            });
        } catch (error) {
            console.error("Worker error", error);
        }
    }
}
