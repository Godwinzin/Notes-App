import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import ErrorBoundary from "./ErrorBoundary"

function Bomb() {
  throw new Error("Boom")
}

describe("ErrorBoundary", () => {
  it("shows a fallback when a child crashes", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    )

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong")
  })

  it("renders children normally when nothing fails", () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>
    )

    expect(screen.getByText("All good")).toBeInTheDocument()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})