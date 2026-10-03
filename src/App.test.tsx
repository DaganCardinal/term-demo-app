import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { App } from "./App"

describe("demo app baseline", () => {
  it("renders the project heading, initial button, and theme shortcut", () => {
    const html = renderToStaticMarkup(<App />)
    expect(html).toContain("Project ready!")
    expect(html).toContain("<button")
    expect(html).toContain("toggle dark mode")
  })
})
