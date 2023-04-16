import { Request, Response } from "express";
import { IRoute } from "../../core/route";

export default class Hello extends IRoute{
    route: string = "/hello";
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET";
    
    async handle(req: Request, res: Response): Promise<any> {
        return res.json({
            "hello": "from routes/hello.ts"
        });
    };
};