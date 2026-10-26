// @vitest-environment node
import { describe, it, expect } from "vitest"
import { parseTags, MAX_TAGS } from "./tags"

describe("parseTags", () => {
  it("splits, trims and lowercases", () => {
    expect(parseTags(" Farm , IDEAS ")).toEqual(["farm", "ideas"])
  })

  it("removes empty and duplicate tags", () => {
    expect(parseTags("a,, a ,b,")).toEqual(["a", "b"])
  })

  it("keeps at most MAX_TAGS tags", () => {
    expect(parseTags("a,b,c,d,e,f,g")).toHaveLength(MAX_TAGS)
  })

  it("returns an empty list for empty text", () => {
    expect(parseTags("")).toEqual([])
  })
})