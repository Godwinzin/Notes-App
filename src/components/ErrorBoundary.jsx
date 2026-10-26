import { Component } from "react"
import "./ErrorBoundary.css"

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error("Caught by ErrorBoundary:", error, info.componentStack)
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-box" role="alert">
          <h2>Something went wrong</h2>
          <p>This page hit an unexpected error. Your notes are safe.</p>
          <button type="button" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary