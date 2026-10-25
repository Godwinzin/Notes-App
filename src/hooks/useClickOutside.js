import { useEffect } from "react"

function useClickOutside(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    function handlePointerDown(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        handler()
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [ref, handler, enabled])
}

export default useClickOutside