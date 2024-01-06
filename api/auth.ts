import { Router } from "express";
import { AT_KEY } from "../utils";

export default function auth() {
    const router = Router()

    router
        .get('/login', (req, res) => {
            // authenticate credentials
            // create auth token
            const at = 'test'
            res.cookie(AT_KEY, at, {
                httpOnly: true,
                signed: true
            })

            res.status(200).send(at)
        })

        .get('/logout', (req, res) => {
            res.clearCookie(AT_KEY)
            res.status(200).send()
        })

    return router
}