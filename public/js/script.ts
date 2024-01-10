(function () {
    let ws: WebSocketExt
    const wsOpen = <HTMLButtonElement>document.getElementById('ws-open')
    const wsTkOpen = <HTMLButtonElement>document.getElementById('ws-tk-open')
    const wsClose = <HTMLButtonElement>document.getElementById('ws-close')
    const wsSend = <HTMLButtonElement>document.getElementById('ws-send')
    const wsInput = <HTMLInputElement>document.getElementById('ws-input')
    const messages = <HTMLElement>document.getElementById('messages')
    const login = <HTMLButtonElement>document.getElementById('login')
    const logout = <HTMLButtonElement>document.getElementById('logout')    
    const wsThreadInput = <HTMLInputElement>document.getElementById('ws-thread-input')
    const wsThreadOpen = <HTMLButtonElement>document.getElementById('ws-thread-open')

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

    function openConnection(at?: string, threadid?: string) {
        return () => {
            closeConnection()

            ws = new WebSocket(`ws://localhost:3000${!threadid ? '' : `/thread/${threadid}`}${!at ? '' : `/?at=${at}`}`) as WebSocketExt

            ws.addEventListener('error', () => showMessage('WebSocket error'))

            ws.addEventListener('open', () => {
                showMessage(`WebSocket connection established ${!threadid ? '' : `for thread id ${threadid}`}`)
            })

            ws.addEventListener('close', () => {
                showMessage(`WebSocket connection closed ${!threadid ? '' : `for thread id ${threadid}`}`)

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
    }

    wsOpen.onclick = openConnection() 
    wsTkOpen.onclick = openConnection('test')

    wsThreadOpen.onclick = () => {
        const threadid = wsThreadInput.value

        if (!threadid) {
            showMessage('Please provide a thread ID')
            return
        }

        openConnection('test', threadid)()

        wsThreadInput.value = ''
    }

    wsClose.onclick = closeConnection

    wsSend.onclick = () => {
        const val = wsInput?.value

        if (!val) {
            return
        } else if (!ws || ws.readyState !== WebSocket.OPEN) {
            showMessage('No websocket connection')
            return
        }

        ws.send(val)
        showMessage(`Sent "${val}"`)
        wsInput.value = ''
    }

    login.onclick = async () => {
        const response = await fetch('/api/v1/login')

        if (response.ok) {
            showMessage('Logged in')
        } else {
            showMessage('Log in error')
        }
    }

    logout.onclick = async () => {
        closeConnection()
        
        const response = await fetch('/api/v1/logout')

        if (response.ok) {
            showMessage('Logged out')
        } else {
            showMessage('Log out error')
        }
    }


})()

