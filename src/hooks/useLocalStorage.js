import { useState, useEffect } from "react"

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage may be full or blocked (e.g. private mode). Ignore it.
    }
  }, [key, value])

  useEffect(() => {
    function handleStorage(event) {
        if (event.key !== key || event.newValue === null) return

        try {
        setValue(JSON.parse(event.newValue))
        } catch {
        // Ignore data that isn't valid JSON
        }
    }

    window.addEventListener("storage", handleStorage)

    return () => window.removeEventListener("storage", handleStorage)
    }, [key])

  return [value, setValue]
}

export default useLocalStorage