import { useParams, useNavigate, Link } from "react-router";
import { useNotes } from "../context/NotesContext";
import PinIcon from "../components/PinIcon"
import "./NotePage.css";

function NotePage() {
  const { notes, togglePin, deleteNote } = useNotes();
  const { id } = useParams();
  const navigate = useNavigate();

  const note = notes.find((n) => String(n.id) === id);

  if (!note) {
    return (
      <div className="empty">
        <p>That note doesn’t exist (it may have been deleted).</p>
        <Link to="/">← Back to all notes</Link>
      </div>
    );
  }

  async function handleDelete() {
    const deleted = await deleteNote(note.id, note.title)
    if (deleted) navigate("/")
  }

  return (
    <article className="note-page">
      <Link to="/" className="note-page__back">
        ← All notes
      </Link>

      <h2 className="note-page__title">
        {note.pinned && (
          <span className="note-page__pin">
            <PinIcon filled />
            <span className="visually-hidden">Pinned: </span>
          </span>
        )}
        {note.title}
      </h2>
      
      <p className="note-page__date">{note.date}</p>
      {note.tags?.length > 0 && (
        <ul className="note-card__tags">
          {note.tags.map((tag) => (
            <li key={tag}>
              <span className="tag tag--static">#{tag}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="note-page__content">{note.content}</p>

      <div className="note-card__actions">
        <button onClick={() => togglePin(note.id)}>
          {note.pinned ? "Unpin" : "Pin"}
        </button>
        <button className="btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default NotePage;
