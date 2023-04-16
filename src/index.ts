import {Server, app} from "./core";

const instance: Server = new Server(app, 4000);
instance.startServer();