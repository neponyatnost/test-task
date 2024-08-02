import { NextRequest, NextResponse } from 'next/server'
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ noServer: true })

wss.on('connection', (ws, req) => {
  const key = new URL(req.url!, `http://${req.headers.host}`).searchParams.get(
    'key'
  )
  setInterval(() => {
    ws.send(key!)
  }, 5000)
})

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/secret')) {
    return new NextResponse(null, {
      status: 101,
      headers: {
        Upgrade: 'websocket',
        Connection: 'Upgrade',
      },
    })
  }
  return NextResponse.next()
}

// Ensure that WebSocketServer handles upgrades
export const config = {
  matcher: ['/api/secret'],
}

export function onSocket(req: any, res: any) {
  if (req.url.startsWith('/api/secret')) {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      wss.emit('connection', ws, req)
    })
  }
}
