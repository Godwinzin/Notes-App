import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import NoteCard from "./NoteCard"

vi.mock("../context/ConfirmContext", () => ({
  useConfirm: () => vi.fn().mockResolvedValue(true),
}))

function setup(props = {}) {
  const handlers = {
    onTogglePin: vi.fn(),
    onDelete: vi.fn(),
    onSave: vi.fn(),
  }
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <NoteCard
        id="n1"
        title="Buy seeds"
        content="Tomato seeds"
        date="23 Oct 2026"
        {...handlers}
        {...props}
      />
    </MemoryRouter>
  )

  return { user, ...handlers }
}

describe("NoteCard", () => {
  it("shows the title as a link to the note page", () => {
    setup()

    const link = screen.getByRole("link", { name: "Buy seeds" })
    expect(link).toHaveAttribute("href", "/notes/n1")
  })

  it("calls onTogglePin with the id when Pin is clicked", async () => {
    const { user, onTogglePin } = setup()

    await user.click(screen.getByRole("button", { name: "Pin" }))

    expect(onTogglePin).toHaveBeenCalledWith("n1")
  })

  it("shows Unpin when the note is pinned", () => {
    setup({ pinned: true })

    expect(screen.getByRole("button", { name: "Unpin" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Pin" })).not.toBeInTheDocument()
  })

  it("calls onDelete with the id and title", async () => {
    const { user, onDelete } = setup()

    await user.click(screen.getByRole("button", { name: "Delete" }))

    expect(onDelete).toHaveBeenCalledWith("n1", "Buy seeds")
  })

  it("saves edited text", async () => {
    const { user, onSave } = setup()

    await user.click(screen.getByRole("button", { name: "Edit" }))
    const titleInput = screen.getByLabelText("Note title")
    await user.clear(titleInput)
    await user.type(titleInput, "Buy tomato seeds")
    await user.click(screen.getByRole("button", { name: "Save" }))

    expect(onSave).toHaveBeenCalledWith("n1", {
        title: "Buy tomato seeds",
        content: "Tomato seeds",
        tags: [],
        })
  })

  it("disables Save when the title is empty", async () => {
    const { user } = setup()

    await user.click(screen.getByRole("button", { name: "Edit" }))
    await user.clear(screen.getByLabelText("Note title"))

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled()
  })
})