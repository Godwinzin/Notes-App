import { useState } from "react";
import { Link } from "react-router";
import "./NoteCard.css";

function NoteCard({
  id,
  title,
  content,
  date,
  pinned = false,
  onTogglePin,
  onDelete,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftContent, setDraftContent] = useState(content);

  function startEditing() {
    setDraftTitle(title);
    setDraftContent(content);
    setIsEditing(true);
  }

  function handleSave() {
    if (!draftTitle.trim()) return;
    onSave(id, { title: draftTitle.trim(), content: draftContent.trim() });
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      handleCancel();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSave();
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
    );
  }

  return (
    <article className={pinned ? "note-card note-card--pinned" : "note-card"}>
      <h2 className="note-card__title">
        <Link to={`/notes/${id}`}>{title}</Link>
      </h2>
      <p className="note-card__content">{content}</p>
      <small className="note-card__date">{date}</small>

      <div className="note-card__actions">
        <button onClick={() => onTogglePin(id)}>
          {pinned ? "Unpin" : "Pin"}
        </button>
        <button onClick={startEditing}>Edit</button>
        <button className="btn-danger" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default NoteCard;