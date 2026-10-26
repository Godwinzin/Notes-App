import { useState, useRef } from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import { parseTags } from "../utils/tags"
import "./NoteForm.css"

const MAX_TITLE = 40
const emptyForm = { title: "", content: "", pinned: false, tags: "" }

function NoteForm({ onAddNote }) {
  const [form, setForm] = useLocalStorage("notes-app:draft", emptyForm)
  const [error, setError] = useState("")
  const titleRef = useRef(null)

  const tagsText = form.tags ?? ""
  const previewTags = parseTags(tagsText)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setError("")
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.title.trim()) {
      setError("Please give your note a title.")
      return
    }

    onAddNote({
      title: form.title.trim(),
      content: form.content.trim(),
      pinned: form.pinned,
      tags: parseTags(tagsText),
    })

    setForm(emptyForm)
    setError("")
    titleRef.current?.focus()
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h2 className="note-form__heading">New note</h2>

      <div className="note-form__label-row">
        <label htmlFor="title">Title</label>
        <span
          className={
            form.title.length >= MAX_TITLE - 5
              ? "note-form__counter note-form__counter--warn"
              : "note-form__counter"
          }
        >
          {form.title.length}/{MAX_TITLE}
        </span>
      </div>
      <input
        ref={titleRef}
        id="title"
        name="title"
        type="text"
        maxLength={MAX_TITLE}
        value={form.title}
        onChange={handleChange}
        placeholder="e.g. Buy seeds"
      />

      <label htmlFor="content">Content</label>
      <textarea
        id="content"
        name="content"
        rows="4"
        value={form.content}
        onChange={handleChange}
        placeholder="Write something..."
      />

      <label htmlFor="tags">
        Tags <span className="note-form__optional">(optional, separated by commas)</span>
      </label>
      <input
        id="tags"
        name="tags"
        type="text"
        value={tagsText}
        onChange={handleChange}
        placeholder="e.g. farm, ideas"
      />
      {previewTags.length > 0 && (
        <ul className="note-card__tags" aria-label="Tags preview">
          {previewTags.map((tag) => (
            <li key={tag}>
              <span className="tag tag--static">#{tag}</span>
            </li>
          ))}
        </ul>
      )}

      <label className="note-form__check">
        <input
          type="checkbox"
          name="pinned"
          checked={form.pinned}
          onChange={handleChange}
        />
        Pin this note
      </label>

      {error && (
        <p className="note-form__error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="note-form__submit"
        disabled={!form.title.trim()}
      >
        Add note
      </button>
    </form>
  )
}

export default NoteForm