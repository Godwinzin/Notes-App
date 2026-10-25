import { useEffect, useRef } from "react"
import "./ConfirmDialog.css"

function ConfirmDialog({ options, onConfirm, onCancel }) {
  const dialogRef = useRef(null)
  const isOpen = options !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const { title, message, confirmText = "Confirm", danger = false } =
    options ?? {}

  return (
    <dialog
      ref={dialogRef}
      className="confirm"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      {isOpen && (
        <div className="confirm__box">
          <h2 id="confirm-title" className="confirm__title">
            {title}
          </h2>
          <p id="confirm-message" className="confirm__message">
            {message}
          </p>
          <div className="confirm__actions">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="button"
              className={danger ? "confirm__ok confirm__ok--danger" : "confirm__ok"}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}

export default ConfirmDialog