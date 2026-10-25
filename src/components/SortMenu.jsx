import { useState, useRef, useEffect, useCallback } from "react"
import useClickOutside from "../hooks/useClickOutside"
import "./SortMenu.css"

const OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
]

function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const itemRefs = useRef([]) //  one ref per option button

  const close = useCallback(() => setOpen(false), [])

  useClickOutside(menuRef, close, open)

  //  when the list opens, focus the currently selected option
  useEffect(() => {
    if (open) {
      const index = OPTIONS.findIndex((option) => option.value === value)
      itemRefs.current[index]?.focus()
    }
  }, [open, value])

  // move focus between options
  function moveFocus(direction) {
    const items = itemRefs.current.filter(Boolean)
    const index = items.indexOf(document.activeElement)

    let next
    if (index === -1) {
      next = direction === 1 ? 0 : items.length - 1
    } else {
      next = (index + direction + items.length) % items.length
    }
    items[next].focus()
  }

  function handleKeyDown(e) {
    if (e.key === "Escape" && open) {
      close()
      buttonRef.current?.focus()
      return
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      moveFocus(e.key === "ArrowDown" ? 1 : -1)
    }

    if (open && (e.key === "Home" || e.key === "End")) {
      e.preventDefault()
      const items = itemRefs.current.filter(Boolean)
      items[e.key === "Home" ? 0 : items.length - 1].focus()
    }
  }

  function choose(optionValue) {
    onChange(optionValue)
    close()
    buttonRef.current?.focus()
  }

  const current = OPTIONS.find((option) => option.value === value)

  return (
    <div className="sort-menu" ref={menuRef} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        className="sort-menu__button"
        aria-expanded={open}
        aria-controls="sort-options"
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        Sort: {current.label} <span aria-hidden="true">▾</span>
      </button>

      {open && (
        <ul id="sort-options" className="sort-menu__list">
          {OPTIONS.map((option, index) => (
            <li key={option.value}>
              <button
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                type="button"
                className={
                  option.value === value
                    ? "sort-menu__item sort-menu__item--active"
                    : "sort-menu__item"
                }
                aria-pressed={option.value === value}
                onClick={() => choose(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SortMenu