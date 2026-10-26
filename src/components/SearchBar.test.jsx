import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SearchBar from "./SearchBar"

describe("SearchBar", () => {
  it("calls onChange with the typed text", async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<SearchBar value="" onChange={onChange} />)

    await user.type(screen.getByLabelText("Search notes"), "a")

    expect(onChange).toHaveBeenCalledWith("a")
  })

  it("hides the clear button when the search is empty", () => {
    render(<SearchBar value="" onChange={vi.fn()} />)

    expect(
      screen.queryByRole("button", { name: "Clear search" })
    ).not.toBeInTheDocument()
  })

  it("clears the search when the clear button is clicked", async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<SearchBar value="tomato" onChange={onChange} />)

    await user.click(screen.getByRole("button", { name: "Clear search" }))

    expect(onChange).toHaveBeenCalledWith("")
  })

  it("clears the search when Escape is pressed", async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<SearchBar value="tomato" onChange={onChange} />)

    await user.click(screen.getByLabelText("Search notes"))
    await user.keyboard("{Escape}")

    expect(onChange).toHaveBeenCalledWith("")
  })
})