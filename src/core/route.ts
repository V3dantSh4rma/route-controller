import {Response, Request} from "express";

type route = "GET" | "POST" | "PUT" | "DELETE";

export abstract class IRoute {
    route: string;
    method: route;
    abstract handle(req: Request, res: Response): Promise<void>;
}