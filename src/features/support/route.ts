export type Page = "dashboard" | "tickets" | "customers" | "settings"
export type Route = { page: Page; ticketId?: string; customerId?: string }
export function parseRoute(hash: string): Route {
  const [path, query] = hash.replace(/^#\/?/, "").split("?")
  const [page, ticketId] = path.split("/")
  if (page === "tickets")
    return {
      page,
      ticketId: ticketId || undefined,
      customerId: new URLSearchParams(query).get("customer") ?? undefined,
    }
  if (page === "customers" || page === "settings") return { page }
  return { page: "dashboard" }
}
