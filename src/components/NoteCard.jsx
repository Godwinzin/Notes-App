import { useState, memo } from "react"
import { Link } from "react-router"
import { useConfirm } from "../context/ConfirmContext"
import { parseTags } from "../utils/tags"
import "./NoteCard.css"

function NoteCard({
  id,
  title,
  content,
  date,
  pinned = false,
  tags = [],
  onTogglePin,
  onDelete,
  onSave,
  onTagClick,
}) {
  const confirm = useConfirm()
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title)
  const [draftContent, setDraftContent] = useState(content)
  const [draftTags, setDraftTags] = useState(tags.join(", "))

  function startEditing() {
    setDraftTitle(title)
    setDraftContent(content)
    setDraftTags(tags.join(", "))
    setIsEditing(true)
  }

  function handleSave() {
    if (!draftTitle.trim()) return
    onSave(id, {
      title: draftTitle.trim(),
      content: draftContent.trim(),
      tags: parseTags(draftTags),
    })
    setIsEditing(false)
  }

  async function handleCancel() {
    const hasChanges =
      draftTitle.trim() !== title ||
      draftContent.trim() !== content ||
      parseTags(draftTags).join(",") !== tags.join(",")

    if (hasChanges) {
      const discard = await confirm({
        title: "Discard changes?",
        message: "Your edits to this note will be lost.",
        confirmText: "Discard",
        danger: true,
      })
      if (!discard) return
    }

    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      handleCancel()
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSave()
    }
  }

  if (isEditing) {
    return (
      <article
        className="note-card note-card--editing"
        onKeyDown={handleKeyDown}
      >
        <input
          className="note-card__edit-title"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          maxLength={40}
          aria-label="Note title"
          autoFocus
        />
        <textarea
          className="note-card__edit-content"
          rows="4"
          value={draftContent}
          onChange={(e) => setDraftContent(e.target.value)}
          aria-label="Note content"
        />
        <input
          className="note-card__edit-title"
          value={draftTags}
          onChange={(e) => setDraftTags(e.target.value)}
          placeholder="Tags, separated by commas"
          aria-label="Note tags"
        />
        <p className="note-card__hint">Esc to cancel · Ctrl+Enter to save</p>
        <div className="note-card__actions">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!draftTitle.trim()}
          >
            Save
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </article>
    )
  }

  return (
    <article className={pinned ? "note-card note-card--pinned" : "note-card"}>
      <h2 className="note-card__title">
        <Link to={`/notes/${id}`}>{title}</Link>
      </h2>
      <p className="note-card__content">{content}</p>

      {tags.length > 0 && (
        <ul className="note-card__tags">
          {tags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                className="tag"
                onClick={() => onTagClick(tag)}
              >
                #{tag}
              </button>
            </li>
          ))}
        </ul>
      )}

      <small className="note-card__date">{date}</small>

      <div className="note-card__actions">
        <button onClick={() => onTogglePin(id)}>
          {pinned ? "Unpin" : "Pin"}
        </button>
        <button onClick={startEditing}>Edit</button>
        <button className="btn-danger" onClick={() => onDelete(id, title)}>
          Delete
        </button>
      </div>
    </article>
  )
}

export default memo(NoteCard)