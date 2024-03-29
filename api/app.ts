import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { COOKIE_SECRET } from "../utils";
import { resolve } from "path";
import api from "./routes";

function configure (app: Express) {
    app
        .get('/', (req, res) => {
            res.sendFile(resolve(__dirname, '../index.html'))
        })

        .use(express.urlencoded({ extended: false }))
        .use(express.json())

        .use(express.static('public'))

        .use(cookieParser(COOKIE_SECRET))

        .use('/api/v1', api())

        .use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err.message) {
                res.sendFile(resolve(__dirname, '../error.html'))
            }
        }) 
}

export default configure