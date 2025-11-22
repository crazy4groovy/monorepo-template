import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'system-ui',
      }}
    >
      <nav
        style={{
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Link
          to="/"
          style={{
            marginRight: '1rem',
            textDecoration: 'none',
            color: '#007bff',
          }}
        >
          Home
        </Link>
        <Link
          to="/about"
          style={{
            textDecoration: 'none',
            color: '#007bff',
          }}
        >
          About
        </Link>
      </nav>
      <Outlet />
    </div>
  ),
})
