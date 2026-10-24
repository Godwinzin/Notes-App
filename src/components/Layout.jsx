import { Outlet, NavLink } from "react-router"
import Header from "./Header"
import "./Layout.css"

function navClass({ isActive }) {
  return isActive ? "nav-link nav-link--active" : "nav-link"
}

function Layout() {
  return (
    <div className="app">
      <Header title="My Notes" />

      <nav className="nav">
        <NavLink to="/" end className={navClass}>
          Notes
        </NavLink>
        <NavLink to="/settings" className={navClass}>
          Settings
        </NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout