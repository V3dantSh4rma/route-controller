import http from "http";
import express, {Handler} from "express";
import {join} from "path";
import {IRoute} from "./route";
import fastGlob from 'fast-glob';

type Constructor<T> = new (...args: any[]) => T; // Basically get the Constructor type.

export class Server {
    public app: express.Application;
    public port: number;
    public server: http.Server;
    public routes: Map<string, Constructor<IRoute>>;

    constructor(app: express.Application, port: number) {
        this.port   = port;
        this.app    = express();
        this.server = http.createServer(this.app);
    }

    public async startServer(): Promise<void> {
        await this.addRoutes();

        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });

        await this.manageRoutes();
    }

    private async manageRoutes(): Promise<void> {
        for (let [path, constructor] of this.routes.entries()) {
            this.app.use(path, (req, res) => {
                return (new constructor()).handle(req, res);
            });
            console.log(`Registering the route: ${path}`);
        }


        this.app.get("/", (req, res) => {
            console.log(req.headers["x-forwarded-for"] || req.socket.remoteAddress);
            return res.status(200).json({
                "hello" : "world!"
            });
        });
    };

    private async addRoutes(): Promise<void> {
        const path  = join(__dirname, "..", "api", "routes", "**", "*.js").split("\\").join("/");
        const files = fastGlob.sync(path);
        const instancePromises = files.map(async (filePath) => {
            const mod = await import(filePath);
            return [(new mod.default).route, mod.default] satisfies [string, Constructor<IRoute>];
        });

        this.routes = new Map(await Promise.all(instancePromises));
    }
}