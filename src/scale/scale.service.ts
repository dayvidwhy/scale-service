import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager } from "@mikro-orm/postgresql";

import type { EntityRepository } from "@mikro-orm/postgresql";
import { ScaleJob } from "@/scale/scale.entity";
import { generateGUID } from "@/utils/guid";

import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";

@Injectable()
export class ScaleService {
    constructor(
        private readonly em: EntityManager,
        @InjectRepository(ScaleJob)
        private readonly scaleRepository: EntityRepository<ScaleJob>,
        @InjectQueue("scale-queue")
        private queue: Queue
    ) {}
    
    async getJob(id: string) {
        try {
            const scale = await this.scaleRepository.findOneOrFail({
                guid: id,
            });
            return {
                id: scale.guid,
                status: scale.pending ? "pending" : "complete"
            };
        } catch (error) {
            throw new HttpException("Error getting job", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async queueJob(): Promise<{ queued: boolean, id: string}> {
        // create our scale job now to pass an id back to the user
        let scale: ScaleJob;
        try {
            scale = new ScaleJob();
            scale.type = "job";
            scale.guid = generateGUID();
            scale.pending = true;
            const newEm = this.em.fork();
            newEm.persist(scale);
            await newEm.flush();
        } catch (error) {
            console.error("Save error", error);
        }
        
        // Add job to queue
        console.log("Queueing scale job: ", scale.guid);
        await this.queue.add("scale-job", {
            guid: scale.guid
        });
        console.log("Queued scale job: ", scale.guid);

        // Return the job id to the user
        return {
            queued: true,
            id: scale.guid
        };
    }
}
