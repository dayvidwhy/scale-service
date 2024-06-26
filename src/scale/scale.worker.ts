// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parentPort } = require("worker_threads");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

parentPort.on("message", async ({ jobGuid }: { jobGuid: string }) => {
    await sleep(5000);
    parentPort.postMessage({ message: "Done", jobGuid });
});
