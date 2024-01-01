import { Router } from "express";
import userRoutes from "./user";

export default function api() {
    const router = Router()

    router
        .use((req, res, next) => {
            console.log(req.body)
            if (!req.body) {
                return next(new Error('Bad Request'))
            }
            next()
        })

        .use('/users', userRoutes())

    return router
}