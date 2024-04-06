import { exec } from "child_process";
import dotenv from "dotenv";

if (!process.argv[2]) {
    console.error("Usage: node deploy.mjs STACK_NAME");
    process.exit(1);
}

// Load .env file
dotenv.config();

// Define the Docker command
const stackName = process.argv[2];
const dockerCommand = `docker stack deploy -c docker-compose-scale.yml ${stackName}`;

// Execute the Docker command
exec(dockerCommand, { env: process.env }, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error.message}`);
        return;
    }
    if (stdout) console.log(`stdout: ${stdout}`);
    if (stderr) console.error(`stderr: ${stderr}`);
});
