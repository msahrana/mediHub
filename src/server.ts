import app from './app.js';
import config from './config/index.js';
import { prisma } from './lib/prisma.js';

const PORT = config.PORT;

async function main() {
    try {
        await prisma.$connect();
        console.log('NeonDB Database Connected Successfully!!!');
        app.listen(PORT, () => {
            console.log(`Prisma Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.error('Error is starting the server', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();
