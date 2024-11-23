import express from 'express';
import { AgentProcess } from './src/process/agent-process.js';
import settings from './settings.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

function parseArguments() {
    return yargs(hideBin(process.argv))
        .option('profiles', {
            type: 'array',
            describe: 'List of agent profile paths',
        })
        .option('port', {
            type: 'number',
            describe: 'Port to run the application on',
            default: 3000,  // Default port if not specified
        })
        .help()
        .alias('help', 'h')
        .parse();
}

function getProfiles(args) {
    return args.profiles || settings.profiles;
}

function main() {
    const args = parseArguments();
    const profiles = getProfiles(args);
    const port = args.port;  // Get the port argument
    console.log(`Running on port: ${port}`);

    const { load_memory, init_message } = settings;

    // Create the Express app
    const app = express();

    // Example route (you can add more as needed)
    app.get('/', (req, res) => {
        res.send('Hello, this is your Express server!');
    });

    // Start the Express server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    // Start agent processes
    for (let i = 0; i < profiles.length; i++) {
        const agent = new AgentProcess();
        agent.start(profiles[i], load_memory, init_message, i);
    }
}

try {
    main();
} catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
}
