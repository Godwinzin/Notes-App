import { Link } from "react-router"

function NotFoundPage() {
  return (
    <div className="empty">
      <h2>404: Page not found</h2>
      <p>The page you’re looking for doesn’t exist.</p>
      <Link to="/">Go to your notes</Link>
    </div>
  )
}

export default NotFoundPage