import {
  ArrowRight,
  CheckCheck,
  Clock3,
  Inbox,
  Ticket as TicketIcon,
  TrendingUp,
} from "lucide-react"
import {
  customers,
  ticketCounts,
  weeklyActivity,
  type Ticket,
} from "@/data/support"
import { Avatar, PageHeading } from "./common"
import { TicketTable } from "./tickets"

export function Dashboard({
  tickets,
  onNewTicket,
}: {
  tickets: Ticket[]
  onNewTicket: () => void
}) {
  const counts = ticketCounts(tickets)
  const metrics = [
    {
      label: "Total tickets",
      value: counts.total,
      icon: TicketIcon,
      note: "Across your support desk",
      color: "mint",
    },
    {
      label: "Open tickets",
      value: counts.open,
      icon: Inbox,
      note: "Ready for your next reply",
      color: "blue",
    },
    {
      label: "Pending tickets",
      value: counts.pending,
      icon: Clock3,
      note: "Waiting for an update",
      color: "peach",
    },
    {
      label: "Resolved tickets",
      value: counts.resolved,
      icon: CheckCheck,
      note: "One less thing to worry about",
      color: "lavender",
    },
  ]
  const recent = [...tickets]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5)
  const urgent = tickets.filter(
    (ticket) =>
      ticket.status !== "Resolved" &&
      (ticket.priority === "Urgent" || ticket.priority === "High")
  )
  return (
    <>
      <PageHeading
        title="Good morning, Alex 👋"
        description="Here’s what’s happening at your support desk."
        onNewTicket={onNewTicket}
      />
      <div className="dashboard-label">
        <span className="eyebrow">YOUR WORKSPACE AT A GLANCE</span>
        <span className="live-label">
          <span />
          Current ticket queue
        </span>
      </div>
      <div className="metrics-grid">
        {metrics.map(({ label, value, icon: Icon, note, color }) => (
          <section className="metric-card panel" key={label}>
            <div className="metric-top">
              <span>{label}</span>
              <span className={`metric-icon ${color}`}>
                <Icon size={18} />
              </span>
            </div>
            <strong>{value}</strong>
            <small>{note}</small>
          </section>
        ))}
      </div>
      <div className="dashboard-middle">
        <section className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <h2>Ticket activity</h2>
              <p>A steady week of helping customers.</p>
            </div>
            <span className="period-chip">Sep 28 – Oct 4</span>
          </div>
          <div className="chart-legend">
            <span>
              <i className="received" />
              Received
            </span>
            <span>
              <i className="resolved" />
              Resolved
            </span>
            <span className="muted">Sample history</span>
          </div>
          <div
            className="bar-chart"
            role="img"
            aria-label={`Sample weekly ticket activity: ${weeklyActivity.map((day) => `${day.day}: ${day.received} received, ${day.resolved} resolved`).join("; ")}`}
          >
            <div className="chart-axis">
              {[40, 30, 20, 10, 0].map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
            <div className="chart-plot">
              <div className="grid-lines">
                {[0, 1, 2, 3, 4].map((line) => (
                  <div key={line} />
                ))}
              </div>
              <div className="chart-columns">
                {weeklyActivity.map((day) => (
                  <div className="chart-day" key={day.day}>
                    <div className="bar-group">
                      <div
                        className="bar received"
                        style={{ height: `${(day.received / 40) * 100}%` }}
                        title={`${day.received} received`}
                      />
                      <div
                        className="bar resolved"
                        style={{ height: `${(day.resolved / 40) * 100}%` }}
                        title={`${day.resolved} resolved`}
                      />
                    </div>
                    <span>{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="chart-summary">
            <span>
              <TrendingUp size={16} />
              <strong>164 tickets received</strong> in the sample week
            </span>
            <span>132 resolved</span>
          </div>
        </section>
        <section className="panel attention-panel">
          <div className="panel-heading">
            <div>
              <h2>Needs attention</h2>
              <p>A few customers could use a hand.</p>
            </div>
            <span className="count-bubble">{urgent.length}</span>
          </div>
          <div className="attention-list">
            {urgent.slice(0, 3).map((ticket) => {
              const customer = customers.find(
                (item) => item.id === ticket.customerId
              )!
              return (
                <a
                  className="attention-item"
                  href={`#/tickets/${ticket.id}`}
                  key={ticket.id}
                >
                  <Avatar name={customer.name} color={customer.color} />
                  <div>
                    <span>{ticket.subject}</span>
                    <small>
                      {customer.name} <span>·</span> #{ticket.id.slice(3)}
                    </small>
                  </div>
                  <span
                    className={`attention-dot ${ticket.priority.toLowerCase()}`}
                    title={`${ticket.priority} priority`}
                  >
                    {ticket.priority}
                  </span>
                </a>
              )
            })}
            {!urgent.length && (
              <p className="attention-empty">
                You’re all caught up. Nice work!
              </p>
            )}
          </div>
          <div className="attention-footer">
            <span className="avatar-stack">
              <Avatar name="Alex Morgan" small />
              <Avatar name="Jamie Chen" color="lavender" small />
              <Avatar name="Sam Rivera" color="peach" small />
            </span>
            <span>Your team has it covered.</span>
          </div>
        </section>
      </div>
      <section className="panel recent-panel">
        <div className="panel-heading">
          <div className="section-title">
            <h2>Recent tickets</h2>
            <span className="count-bubble">{counts.total}</span>
          </div>
          <a className="text-link" href="#/tickets">
            View all tickets <ArrowRight size={15} />
          </a>
        </div>
        <TicketTable tickets={recent} compact />
      </section>
      <p className="page-footnote">A good day starts with a clear inbox.</p>
    </>
  )
}
