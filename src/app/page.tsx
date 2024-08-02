'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Home = () => {
  const router = useRouter()
  const searchParams = new URLSearchParams(window.location.search)
  const key = searchParams.get('key')

  useEffect(() => {
    if (!key) {
      fetch('/api/secret?key=mypassword')
        .then((response) => response.json())
        .then((data) => {
          router.push(data.url)
        })
        .catch((error) => console.error('Error:', error))
    } else {
      const ws = new WebSocket(`ws://localhost:3000?key=${key}`)
      ws.onmessage = (event) => {
        console.log('Received:', event.data)
      }
    }
  }, [key])

  if (!key) {
    return <h1>404 - Page Not Found</h1>
  }

  return <h1>Welcome to the Secret Page!</h1>
}

export default Home
