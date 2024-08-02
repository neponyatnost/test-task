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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  if (!key) {
    return new NextResponse('Key parameter is required', { status: 400 })
  }

  return NextResponse.json({ url: `http://localhost:3000/?key=${key}` })
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

export function onSocket(req: any, res: any) {
  if (req.url.startsWith('/api/secret')) {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnection)
  }
}

function onConnection(ws: any, req: any) {
  wss.emit('connection', ws, req)
}
