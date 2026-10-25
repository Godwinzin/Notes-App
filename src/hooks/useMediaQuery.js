import { useCallback, useSyncExternalStore } from "react"

function useMediaQuery(query) {
  const subscribe = useCallback(
    (callback) => {
      const media = window.matchMedia(query)
      media.addEventListener("change", callback)
      return () => media.removeEventListener("change", callback)
    },
    [query]
  )

  const getSnapshot = () => window.matchMedia(query).matches

  return useSyncExternalStore(subscribe, getSnapshot)
}

export default useMediaQuery