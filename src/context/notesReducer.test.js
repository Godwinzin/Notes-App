// @vitest-environment node
import { describe, it, expect } from "vitest"
import { notesReducer } from "./notesReducer"

const sample = [
  { id: 1, title: "First", content: "a", pinned: false },
  { id: 2, title: "Second", content: "b", pinned: true },
]

describe("notesReducer", () => {
  it("adds a new note at the start", () => {
    const note = { id: 3, title: "New", content: "c", pinned: false }
    const result = notesReducer(sample, { type: "added", note })

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual(note)
  })

  it("toggles the pinned state of one note only", () => {
    const pinned = notesReducer(sample, { type: "pin_toggled", id: 1 })
    expect(pinned[0].pinned).toBe(true) // false → true
    expect(pinned[1].pinned).toBe(true) // untouched

    const unpinned = notesReducer(sample, { type: "pin_toggled", id: 2 })
    expect(unpinned[0].pinned).toBe(false) // untouched
    expect(unpinned[1].pinned).toBe(false) // true → false
    })

  it("updates only the given fields", () => {
    const result = notesReducer(sample, {
      type: "updated",
      id: 1,
      changes: { title: "Changed" },
    })

    expect(result[0]).toEqual({
      id: 1,
      title: "Changed",
      content: "a",
      pinned: false,
    })
  })

  it("deletes a note by id", () => {
    const result = notesReducer(sample, { type: "deleted", id: 1 })

    expect(result).toEqual([sample[1]])
  })

  it("clears all notes", () => {
    expect(notesReducer(sample, { type: "cleared" })).toEqual([])
  })

  it("does not mutate the original array", () => {
    const copy = structuredClone(sample)
    notesReducer(sample, { type: "pin_toggled", id: 1 })
    notesReducer(sample, { type: "deleted", id: 2 })

    expect(sample).toEqual(copy)
  })

  it("throws on an unknown action", () => {
    expect(() => notesReducer(sample, { type: "nope" })).toThrow()
  })

  it("unpins every note without touching anything else", () => {
    const notes = [
        { id: 1, title: "A", content: "", pinned: true },
        { id: 2, title: "B", content: "", pinned: false },
        { id: 3, title: "C", content: "", pinned: true },
    ]

    const result = notesReducer(notes, { type: "all_unpinned" })

    expect(result.every((note) => note.pinned === false)).toBe(true)
    expect(result.map((note) => note.title)).toEqual(["A", "B", "C"])
    expect(notes[0].pinned).toBe(true)
    })
})