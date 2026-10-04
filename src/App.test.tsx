import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { App } from "./App"
import { filterTickets, initialTickets, ticketCounts } from "./data/support"
import { parseRoute } from "./features/support/route"

describe("support desk demo", () => {
  it("renders the dashboard and all four navigation destinations", () => {
    const html = renderToStaticMarkup(<App />)
    for (const label of [
      "Dashboard",
      "Tickets",
      "Customers",
      "Settings",
      "Total tickets",
      "Open tickets",
      "Pending tickets",
      "Resolved tickets",
      "Recent tickets",
    ])
      expect(html).toContain(label)
    expect(html).toContain("Sample history")
    expect(html).not.toContain("Project ready!")
  })

  it("renders a paginated queue and a directly linked ticket conversation", () => {
    const queue = renderToStaticMarkup(<App initialHash="#/tickets" />)
    expect(queue).toContain("Showing 1–10 of 20 tickets")
    expect(queue).toContain("Search tickets")
    const detail = renderToStaticMarkup(<App initialHash="#/tickets/TK-1042" />)
    expect(detail).toContain("Unable to access my workspace")
    expect(detail).toContain("I’ve tried another browser")
    expect(detail).toContain("Mark as resolved")
    expect(detail).toContain("Reply to Olivia")
  })

  it("handles missing tickets without crashing", () => {
    expect(
      renderToStaticMarkup(<App initialHash="#/tickets/TK-9999" />)
    ).toContain("Ticket not found")
  })

  it("combines search, status, priority, and customer filters", () => {
    const matches = filterTickets(
      initialTickets,
      "  ACME  ",
      "Open",
      "Urgent",
      "c1"
    )
    expect(matches.map((ticket) => ticket.id)).toEqual(["TK-1042"])
    expect(filterTickets(initialTickets, "TK-1041")[0].subject).toBe(
      "Invoice shows an incorrect amount"
    )
    expect(filterTickets(initialTickets, "no such customer")).toEqual([])
    expect(filterTickets(initialTickets, "", "All", "All", "c1")).toHaveLength(
      3
    )
  })

  it("keeps dashboard counts consistent after a local status change", () => {
    expect(ticketCounts(initialTickets)).toEqual({
      total: 20,
      open: 8,
      pending: 5,
      resolved: 7,
    })
    const changed = initialTickets.map((ticket, index) =>
      index === 0 ? { ...ticket, status: "Resolved" as const } : ticket
    )
    expect(ticketCounts(changed)).toEqual({
      total: 20,
      open: 7,
      pending: 5,
      resolved: 8,
    })
  })

  it("parses detail and customer links and falls back to the dashboard", () => {
    expect(parseRoute("#/tickets/TK-1042")).toEqual({
      page: "tickets",
      ticketId: "TK-1042",
      customerId: undefined,
    })
    expect(parseRoute("#/tickets?customer=c2")).toEqual({
      page: "tickets",
      ticketId: undefined,
      customerId: "c2",
    })
    expect(parseRoute("#/settings")).toEqual({ page: "settings" })
    expect(parseRoute("#/unknown")).toEqual({ page: "dashboard" })
  })
})
