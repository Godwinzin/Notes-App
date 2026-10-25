import { createContext, useContext, useState, useRef, useCallback } from "react"
import ConfirmDialog from "../components/ConfirmDialog"

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [options, setOptions] = useState(null)
  const resolveRef = useRef(null)

  const confirm = useCallback((opts) => {
    return new Promise((resolve) => {
      resolveRef.current?.(false)
      resolveRef.current = resolve
      setOptions(opts)
    })
  }, [])

  function close(result) {
    resolveRef.current?.(result)
    resolveRef.current = null
    setOptions(null)
  }

  return (
    <ConfirmContext value={confirm}>
      {children}
      <ConfirmDialog
        options={options}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
      />
    </ConfirmContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfirm() {
  const confirm = useContext(ConfirmContext)
  if (confirm === null) {
    throw new Error("useConfirm must be used inside <ConfirmProvider>")
  }
  return confirm
}