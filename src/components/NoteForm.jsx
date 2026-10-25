import { useState, useRef } from "react"
import useLocalStorage from "../hooks/useLocalStorage";
import "./NoteForm.css";

const emptyForm = { title: "", content: "", pinned: false };
const MAX_TITLE = 40;

function NoteForm({ onAddNote }) {
  const titleRef = useRef(null)
  const [form, setForm] = useLocalStorage("notes-app:draft", emptyForm)
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Please give your note a title.");
      return;
    }

    onAddNote({
      title: form.title.trim(),
      content: form.content.trim(),
      pinned: form.pinned,
    });

    setForm(emptyForm);
    setError("");
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

      <label className="note-form__check">
        <input
          type="checkbox"
          name="pinned"
          checked={form.pinned}
          onChange={handleChange}
        />
        Pin this note
      </label>

      {error && <p className="note-form__error">{error}</p>}

      <button
        type="submit"
        className="note-form__submit"
        disabled={!form.title.trim()}
      >
        Add note
      </button>
    </form>
  );
}

export default NoteForm;
