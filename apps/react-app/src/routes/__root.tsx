import { Link, Outlet, createRootRoute } from '@tanstack/react-router'

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
          style={{
            marginRight: '1rem',
            textDecoration: 'none',
            color: '#007bff',
          }}
          to="/"
        >
          Home
        </Link>
        <Link
          style={{
            textDecoration: 'none',
            color: '#007bff',
          }}
          to="/about"
        >
          About
        </Link>
      </nav>
      <Outlet />
    </div>
  ),
})
