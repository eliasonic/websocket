import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

const HEARTBEAT_INTERVAL = 1000 * 5
const HEARTBEAT_VALUE = 1

function ping (ws: WebSocket) {
    ws.send(HEARTBEAT_VALUE, {binary: true})
}

function configureSocket (s: Server) {
    const wss = new WebSocketServer({ noServer: true })

    s.on('upgrade', (req, socket, head) => {
        socket.on('error', (e) => console.log(e))

        if (!!req.headers['BadAuth']) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
            socket.destroy()
            return
        }

        wss.handleUpgrade(req, socket, head, (ws) => {
            socket.removeListener('error', (e) => console.log(e))
            wss.emit('connection', ws, req)
        })
    })

    wss.on('connection', (ws, req) => {
        ws.isAlive = true

        ws.on('error', (e) => console.log(e))

        ws.on('message', (msg, isBinary) => {
            if (isBinary && (msg as any)[0] === HEARTBEAT_VALUE) {
                console.log('pong')
                ws.isAlive = true
            } else {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(msg, {binary: isBinary})
                    }
                })
            }
        })

        ws.on('close', () => console.log('Connection closed'))
    })

    const interval = setInterval(() => {
        console.log('firing interval');
        wss.clients.forEach((client) => {
            if (!client.isAlive) {
                client.terminate()
                return
            }
                
            client.isAlive = false
            ping(client)
        })
    }, HEARTBEAT_INTERVAL)

    wss.on('close', () => clearInterval(interval))
}

export default configureSocket