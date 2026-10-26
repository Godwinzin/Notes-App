import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import useDebounce from "./useDebounce"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("updates the value only after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    )

    expect(result.current).toBe("a")

    rerender({ value: "ab" })
    expect(result.current).toBe("a")

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe("a")

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe("ab")
  })

  it("restarts the wait when the value changes again", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    )

    rerender({ value: "ab" })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: "abc" })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe("a")

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe("abc")
  })
})