import { useEffect, useState } from "react"
import {
  ChevronRight,
  Headphones,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  Settings,
  Ticket as TicketIcon,
  Users,
  X,
} from "lucide-react"
import {
  customers,
  initialTickets,
  ticketCounts,
  type Ticket,
} from "@/data/support"
import { Avatar } from "@/features/support/common"
import { CustomersPage } from "@/features/support/customers"
import { Dashboard } from "@/features/support/dashboard"
import {
  NewTicketDialog,
  type NewTicketValues,
} from "@/features/support/new-ticket"
import { parseRoute } from "@/features/support/route"
import { SettingsPage } from "@/features/support/settings"
import { TicketDetail } from "@/features/support/ticket-detail"
import { TicketsPage } from "@/features/support/tickets"

const navigation = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "tickets", label: "Tickets", icon: TicketIcon },
  { page: "customers", label: "Customers", icon: Users },
  { page: "settings", label: "Settings", icon: Settings },
] as const

export function App({ initialHash }: { initialHash?: string }) {
  const [route, setRoute] = useState(() =>
    parseRoute(
      initialHash ?? (typeof window === "undefined" ? "" : window.location.hash)
    )
  )
  const [tickets, setTickets] = useState(initialTickets)
  const [workspaceName, setWorkspaceName] = useState("Acme Support")
  const [menuOpen, setMenuOpen] = useState(false)
  const [newTicketOpen, setNewTicketOpen] = useState(false)
  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseRoute(window.location.hash))
      setMenuOpen(false)
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])
  useEffect(() => {
    window.scrollTo({ top: 0 })
    document.getElementById("main-content")?.focus({ preventScroll: true })
  }, [route])
  const counts = ticketCounts(tickets)
  const currentTitle = navigation.find(
    (item) => item.page === route.page
  )!.label
  function updateTicket(updated: Ticket) {
    setTickets((current) =>
      current.map((ticket) => (ticket.id === updated.id ? updated : ticket))
    )
  }
  function createTicket(values: NewTicketValues) {
    const timestamp = new Date().toISOString()
    const id = `TK-${Math.max(...tickets.map((ticket) => Number(ticket.id.slice(3)))) + 1}`
    const customerName = customers.find(
      (customer) => customer.id === values.customerId
    )!.name
    setTickets((current) => [
      {
        id,
        subject: values.subject,
        customerId: values.customerId,
        status: "Open",
        priority: values.priority,
        assignee: "Alex Morgan",
        category: "General",
        createdAt: timestamp,
        updatedAt: timestamp,
        messages: [
          {
            id: `${id}-initial`,
            author: customerName,
            role: "customer",
            body: values.body,
            timestamp,
          },
        ],
      },
      ...current,
    ])
    setNewTicketOpen(false)
    window.location.hash = `/tickets/${id}`
  }
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById("main-content")?.focus()
        }}
      >
        Skip to content
      </a>
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        id="app-navigation"
        className={`sidebar ${menuOpen ? "is-open" : ""}`}
      >
        <a className="brand" href="#/dashboard">
          <span className="brand-symbol">
            <Headphones size={22} strokeWidth={2.2} />
          </span>
          supportdesk<span className="brand-period">.</span>
        </a>
        <button
          className="mobile-close icon-button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        >
          <X size={20} />
        </button>
        <div className="workspace-card">
          <span className="workspace-icon">A</span>
          <div>
            <strong>{workspaceName}</strong>
            <span>Team workspace</span>
          </div>
        </div>
        <span className="nav-label">WORKSPACE</span>
        <nav aria-label="Main navigation">
          {navigation.map(({ page, label, icon: Icon }) => (
            <a
              key={page}
              href={`#/${page}`}
              className={route.page === page ? "active" : ""}
              aria-current={route.page === page ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {page === "tickets" && (
                <span className="nav-count">{counts.open}</span>
              )}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="demo-note">
            <span className="demo-note-icon">
              <LifeBuoy size={18} />
            </span>
            <strong>A space to lend a hand.</strong>
            <p>Great support starts with a little care.</p>
            <span className="demo-tag">DEMO WORKSPACE</span>
          </div>
          <div className="sidebar-profile">
            <Avatar name="Alex Morgan" />
            <div>
              <strong>Alex Morgan</strong>
              <small>Support specialist</small>
            </div>
            <span className="online-dot" title="Demo team member" />
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              className="mobile-toggle icon-button"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              aria-controls="app-navigation"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={14} />
            <a href={`#/${route.page}`}>{currentTitle}</a>
            {route.ticketId && (
              <>
                <ChevronRight size={14} />
                <span>{route.ticketId}</span>
              </>
            )}
          </div>
          <div className="topbar-right">
            <span className="demo-top-label">Demo workspace</span>
            <span className="topbar-divider" />
            <Avatar name="Alex Morgan" small />
          </div>
        </header>
        <main id="main-content" className="page-content" tabIndex={-1}>
          {route.page === "dashboard" && (
            <Dashboard
              tickets={tickets}
              onNewTicket={() => setNewTicketOpen(true)}
            />
          )}
          {route.page === "tickets" &&
            (route.ticketId ? (
              <TicketDetail
                key={route.ticketId}
                ticket={tickets.find((ticket) => ticket.id === route.ticketId)}
                onUpdate={updateTicket}
              />
            ) : (
              <TicketsPage
                key={route.customerId ?? "all"}
                tickets={tickets}
                customerId={route.customerId}
                onNewTicket={() => setNewTicketOpen(true)}
              />
            ))}
          {route.page === "customers" && <CustomersPage tickets={tickets} />}
          {route.page === "settings" && (
            <SettingsPage
              workspaceName={workspaceName}
              onSave={setWorkspaceName}
              onReset={() => {
                setTickets(initialTickets)
                setWorkspaceName("Acme Support")
              }}
            />
          )}
        </main>
      </div>
      {newTicketOpen && (
        <NewTicketDialog
          onClose={() => setNewTicketOpen(false)}
          onCreate={createTicket}
        />
      )}
    </div>
  )
}

export default App
