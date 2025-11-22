import { createFileRoute } from '@tanstack/react-router'
import { add, capitalize, formatCurrency } from 'package1'

export const Route = createFileRoute('/')({
  component: () => {
    const appName = import.meta.env.VITE_APP_NAME || 'React App'
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const env = import.meta.env.VITE_ENV || 'development'

    return (
      <>
        <h1>{appName}</h1>
        <p>Welcome to the React app in the monorepo!</p>
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <p
            style={{
              marginTop: 0,
              fontWeight: 'bold',
            }}
          >
            Environment Variables:
          </p>
          <ul style={{ marginBottom: '1rem' }}>
            <li>Environment: {env}</li>
            <li>API URL: {apiUrl}</li>
          </ul>
          <p style={{ fontWeight: 'bold' }}>Using package1 utilities:</p>
          <ul>
            <li>Capitalize: {capitalize('hello world')}</li>
            <li>Add: 5 + 3 = {add(5, 3)}</li>
            <li>Currency: {formatCurrency(1234.56)}</li>
          </ul>
        </div>
      </>
    )
  },
})
