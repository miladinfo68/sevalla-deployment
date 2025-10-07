import { useState, useEffect } from 'react'
import './App.css'

interface User {
  id: number
  name: string
  email: string
}

interface ApiResponse {
  users: User[]
}

interface HealthResponse {
  status: string
  message: string
  timestamp: string
  environment: string
}

// Determine API base URL based on environment
const API_BASE = import.meta.env.MODE === 'development' 
  ? '/api'  // Use proxy in development
  : `${window.location.origin}/api`; // Use same origin in production

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [health, setHealth] = useState<string>('')
  const [environment, setEnvironment] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const fetchHealth = async () => {
    try {
      setError('')
      const response = await fetch(`${API_BASE}/health`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data: HealthResponse = await response.json()
      setHealth(`${data.status} - ${data.message}`)
      setEnvironment(data.environment)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setError(`Backend connection failed: ${message}`)
      setHealth('Backend connection failed')
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/users`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data: ApiResponse = await response.json()
      setUsers(data.users)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setError(`Failed to fetch users: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  const sendEcho = async () => {
    setError('')
    try {
      const response = await fetch(`${API_BASE}/echo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello from frontend!',
          timestamp: new Date().toISOString(),
          frontend: 'Vite + React 19'
        })
      })
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data = await response.json()
      console.log('Echo response:', data)
      alert('Check console for echo response!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setError(`Echo failed: ${message}`)
    }
  }

  useEffect(() => {
    fetchHealth()
    fetchUsers()
  }, [])

  return (
    <div className="app">
      <h1>🚀 Sevalla Deployment</h1>
      <p>Frontend + Backend Integration Test</p>
      <div className="environment">Environment: {environment || 'unknown'}</div>
      
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="card">
        <h2>Backend Health</h2>
        <p>{health || 'Checking...'}</p>
        <button onClick={fetchHealth}>Refresh Health</button>
      </div>

      <div className="card">
        <h2>Test APIs</h2>
        <p>API Base: <code>{API_BASE}</code></p>
        <button onClick={sendEcho}>Send Echo to Backend</button>
        <button onClick={fetchUsers} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Users'}
        </button>
      </div>

      <div className="card">
        <h2>Users from Backend</h2>
        {users.length > 0 ? (
          <ul>
            {users.map(user => (
              <li key={user.id}>
                <strong>{user.name}</strong> - {user.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  )
}

export default App