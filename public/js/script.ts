(function () {
    let ws: WebSocketExt
    const wsOpen = <HTMLButtonElement>document.getElementById('ws-open')
    const wsClose = <HTMLButtonElement>document.getElementById('ws-close')
    const wsSend = <HTMLButtonElement>document.getElementById('ws-send')
    const wsInput = <HTMLInputElement>document.getElementById('ws-input')
    const messages = <HTMLElement>document.getElementById('messages')

    const HEARTBEAT_TIMEOUT = ((1000 * 5) + (1000 * 1))
    const HEARTBEAT_VALUE = 1

    function closeConnection() {
        if (!!ws) {
            ws.close()
        }
    }

    function showMessage(message: string) {
        messages.textContent += `\n${message}`
        messages.scrollTop = messages?.scrollHeight
    }

    function isBinary(obj: any) {
        return typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Blob]'
    }

    function heartbeat() {
        if (!ws) {
            return
        } else if (!!ws.pingTimeout) {
            clearTimeout(ws.pingTimeout)
        } 

        ws.pingTimeout = setTimeout(() => {
            ws.close()

            // business logic for deciding whether or not to reconnect
        }, HEARTBEAT_TIMEOUT)

        const data = new Uint8Array(1)
        data[0] = HEARTBEAT_VALUE
        ws.send(data)
    }

    wsOpen.onclick = () => {
        closeConnection()

        ws = new WebSocket('ws://localhost:3000') as WebSocketExt

        ws.addEventListener('error', () => showMessage('WebSocket error'))

        ws.addEventListener('open', () => showMessage('WebSocket connection established'))

        ws.addEventListener('close', () => {
            showMessage('WebSocket connection closed')

            if (!!ws.pingTimeout) {
                clearTimeout(ws.pingTimeout)
            }
        })

        ws.addEventListener('message', (msg: MessageEvent<string>) => {
            if (isBinary(msg.data)) {
                heartbeat()
            } else {
                showMessage(`Received message: ${msg.data}`)
            }
            
        })
    }

    wsClose.onclick = closeConnection

    wsSend.onclick = () => {
        const val = wsInput?.value

        if (!val) {
            return
        } else if (!ws) {
            showMessage('No websocket connection')
            return
        }

        ws.send(val)
        showMessage(`Sent "${val}"`)
        wsInput.value = ''
    }
})()
