import 'server-only'
import { createConnection } from 'net'

export async function waitForServiceToBeReady(hostName: string, port: number, retries = 10) {
  for (let i = 0; i < retries; i++) {
    const isOpen = await new Promise((resolve) => {
      const socket = createConnection(port, hostName)
      socket.on('error', () => resolve(false))
      socket.on('connect', () => {
        socket.end()
        resolve(true)
      })
    })

    if (isOpen) return
    await new Promise(res => setTimeout(res, 500))
  }

  throw new Error(`the service ${hostName}:${port} is not ready or its down`)
}
