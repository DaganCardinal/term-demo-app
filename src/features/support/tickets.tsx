import { useState } from "react"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Ticket as TicketIcon,
} from "lucide-react"
import {
  customers,
  filterTickets,
  formatDate,
  priorities,
  ticketCounts,
  type Ticket,
} from "@/data/support"
import {
  Avatar,
  EmptyState,
  PageHeading,
  PriorityBadge,
  StatusBadge,
} from "./common"

export function TicketTable({
  tickets,
  compact = false,
}: {
  tickets: Ticket[]
  compact?: boolean
}) {
  return (
    <div className="table-scroll">
      <table className={`ticket-table ${compact ? "compact" : ""}`}>
        <caption className="sr-only">Support tickets</caption>
        <thead>
          <tr>
            <th scope="col">Ticket</th>
            <th scope="col">Customer</th>
            <th scope="col">Status</th>
            <th scope="col">Priority</th>
            {!compact && <th scope="col">Assignee</th>}
            <th scope="col">Updated</th>
            <th scope="col">
              <span className="sr-only">Details</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            const customer = customers.find(
              (item) => item.id === ticket.customerId
            )!
            return (
              <tr key={ticket.id}>
                <td className="subject-cell">
                  <a className="ticket-link" href={`#/tickets/${ticket.id}`}>
                    <span className="ticket-id">#{ticket.id.slice(3)}</span>
                    <span>{ticket.subject}</span>
                  </a>
                </td>
                <td>
                  <div className="person">
                    <Avatar name={customer.name} color={customer.color} small />
                    <div>
                      <span>{customer.name}</span>
                      {!compact && <small>{customer.company}</small>}
                    </div>
                  </div>
                </td>
                <td>
                  <StatusBadge status={ticket.status} />
                </td>
                <td>
                  <PriorityBadge priority={ticket.priority} />
                </td>
                {!compact && (
                  <td>
                    <div className="person">
                      <Avatar name={ticket.assignee} small />
                      <span>{ticket.assignee.split(" ")[0]}</span>
                    </div>
                  </td>
                )}
                <td className="date-cell">{formatDate(ticket.updatedAt)}</td>
                <td>
                  <a
                    className="row-link"
                    href={`#/tickets/${ticket.id}`}
                    aria-label={`View ticket ${ticket.id}`}
                  >
                    <ArrowRight size={15} />
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function TicketsPage({
  tickets,
  customerId,
  onNewTicket,
}: {
  tickets: Ticket[]
  customerId?: string
  onNewTicket: () => void
}) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [priority, setPriority] = useState("All")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const customer = customers.find((item) => item.id === customerId)
  const counts = ticketCounts(
    filterTickets(tickets, "", "All", "All", customerId)
  )
  const filtered = filterTickets(
    tickets,
    query,
    status,
    priority,
    customerId
  ).sort((a, b) =>
    sort === "newest"
      ? b.updatedAt.localeCompare(a.updatedAt)
      : a.updatedAt.localeCompare(b.updatedAt)
  )
  const pages = Math.max(1, Math.ceil(filtered.length / 10))
  const currentPage = Math.min(page, pages)
  const visible = filtered.slice((currentPage - 1) * 10, currentPage * 10)
  function clearFilters() {
    setQuery("")
    setStatus("All")
    setPriority("All")
    setPage(1)
  }
  return (
    <>
      <PageHeading
        title="Tickets"
        description="A little organization. A lot of happy customers."
        onNewTicket={onNewTicket}
      />
      {customer && (
        <div className="filter-notice">
          <span>
            Showing tickets for <strong>{customer.name}</strong>
          </span>
          <a href="#/tickets">
            View all customers <ArrowRight size={14} />
          </a>
        </div>
      )}
      <section className="panel">
        <div
          className="tabs"
          role="group"
          aria-label="Filter tickets by status"
        >
          {(
            [
              ["All", counts.total],
              ["Open", counts.open],
              ["Pending", counts.pending],
              ["Resolved", counts.resolved],
            ] as const
          ).map(([label, count]) => (
            <button
              key={label}
              className={status === label ? "active" : ""}
              aria-pressed={status === label}
              onClick={() => {
                setStatus(label)
                setPage(1)
              }}
            >
              {label === "All" ? "All tickets" : label}
              <span>{count}</span>
            </button>
          ))}
        </div>
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={17} />
            <input
              aria-label="Search tickets"
              placeholder="Search tickets, customers, or IDs…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
            />
          </label>
          <div className="toolbar-controls">
            <label className="select-control">
              <SlidersHorizontal size={15} />
              <select
                aria-label="Filter by priority"
                value={priority}
                onChange={(event) => {
                  setPriority(event.target.value)
                  setPage(1)
                }}
              >
                <option value="All">All priorities</option>
                {priorities.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label className="select-control">
              <ArrowDown size={15} />
              <select
                aria-label="Sort tickets"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value)
                  setPage(1)
                }}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>
        </div>
        {visible.length ? (
          <TicketTable tickets={visible} />
        ) : (
          <EmptyState
            title="No tickets found"
            description="Try a different search or adjust your filters."
            onClear={clearFilters}
          />
        )}
        <div className="table-footer">
          <span>
            {filtered.length
              ? `Showing ${(currentPage - 1) * 10 + 1}–${Math.min(currentPage * 10, filtered.length)} of ${filtered.length} ${filtered.length === 1 ? "ticket" : "tickets"}`
              : "0 tickets"}
          </span>
          <div className="pagination">
            <button
              className="btn"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ArrowLeft size={14} />
              <span>Previous</span>
            </button>
            <span className="page-number">
              {currentPage} / {pages}
            </span>
            <button
              className="btn"
              disabled={currentPage === pages}
              onClick={() => setPage(currentPage + 1)}
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
      <p className="page-footnote">
        <TicketIcon size={14} /> Every ticket is an opportunity to make
        someone’s day.
      </p>
    </>
  )
}
