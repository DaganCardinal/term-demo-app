import { useState, type FormEvent } from "react"
import {
  ArrowLeft,
  CheckCheck,
  Mail,
  MessageSquare,
  Send,
  Ticket as TicketIcon,
} from "lucide-react"
import {
  agents,
  customers,
  formatDate,
  priorities,
  statuses,
  type Priority,
  type Status,
  type Ticket,
} from "@/data/support"
import { Avatar, EmptyState, PriorityBadge, StatusBadge } from "./common"

export function TicketDetail({
  ticket,
  onUpdate,
}: {
  ticket?: Ticket
  onUpdate: (ticket: Ticket) => void
}) {
  const [reply, setReply] = useState("")
  const [feedback, setFeedback] = useState("")
  if (!ticket)
    return (
      <>
        <a className="back-link" href="#/tickets">
          <ArrowLeft size={16} />
          Back to tickets
        </a>
        <section className="panel">
          <EmptyState
            title="Ticket not found"
            description="This ticket isn’t in the demo workspace. Return to the ticket list to choose another."
          />
        </section>
      </>
    )
  const customer = customers.find((item) => item.id === ticket.customerId)!
  function update(patch: Partial<Ticket>) {
    onUpdate({ ...ticket!, ...patch, updatedAt: new Date().toISOString() })
  }
  function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!reply.trim()) return
    const timestamp = new Date().toISOString()
    update({
      messages: [
        ...ticket!.messages,
        {
          id: `reply-${timestamp}`,
          author: "Alex Morgan",
          role: "agent",
          body: reply.trim(),
          timestamp,
        },
      ],
    })
    setReply("")
    setFeedback("Reply added to this demo conversation.")
  }
  return (
    <>
      <a className="back-link" href="#/tickets">
        <ArrowLeft size={16} />
        Back to tickets
      </a>
      <div className="detail-heading">
        <div>
          <div className="detail-kicker">
            <span>
              <TicketIcon size={14} />
              {ticket.id}
            </span>
            <StatusBadge status={ticket.status} />
          </div>
          <h1>{ticket.subject}</h1>
          <p>
            Created {formatDate(ticket.createdAt, true)} UTC <span>·</span>{" "}
            {ticket.category}
          </p>
        </div>
        <button
          className="btn primary"
          disabled={ticket.status === "Resolved"}
          onClick={() => {
            update({ status: "Resolved" })
            setFeedback("Ticket marked as resolved.")
          }}
        >
          <CheckCheck size={16} />
          {ticket.status === "Resolved" ? "Resolved" : "Mark as resolved"}
        </button>
      </div>
      <div className="detail-grid">
        <section className="panel conversation-panel">
          <div className="panel-heading">
            <div className="section-title">
              <MessageSquare size={17} />
              <h2>Conversation</h2>
              <span className="count-bubble">{ticket.messages.length}</span>
            </div>
            <span className="inline-note">
              <Mail size={14} />
              Email
            </span>
          </div>
          <div className="conversation">
            {ticket.messages.map((message) => (
              <article className={`message ${message.role}`} key={message.id}>
                <Avatar
                  name={message.author}
                  color={message.role === "customer" ? customer.color : "mint"}
                />
                <div className="message-content">
                  <div className="message-meta">
                    <div>
                      <strong>{message.author}</strong>
                      {message.role === "agent" && (
                        <span className="agent-label">Support team</span>
                      )}
                    </div>
                    <time dateTime={message.timestamp}>
                      {formatDate(message.timestamp, true)} UTC
                    </time>
                  </div>
                  <p>{message.body}</p>
                </div>
              </article>
            ))}
          </div>
          <form className="reply-form" onSubmit={sendReply}>
            <label htmlFor="reply">
              Reply to {customer.name.split(" ")[0]}
            </label>
            <textarea
              id="reply"
              placeholder="Write a thoughtful reply…"
              rows={5}
              maxLength={5000}
              value={reply}
              onChange={(event) => setReply(event.target.value)}
            />
            <div className="reply-footer">
              <span>Replies stay in this demo session.</span>
              <button
                type="submit"
                className="btn primary"
                disabled={!reply.trim()}
              >
                <Send size={15} />
                Add reply
              </button>
            </div>
            <p className="form-feedback" role="status">
              {feedback}
            </p>
          </form>
        </section>
        <aside className="detail-aside">
          <section className="panel properties-panel">
            <div className="panel-heading">
              <h2>Ticket details</h2>
            </div>
            <div className="property-fields">
              <label>
                Status
                <select
                  value={ticket.status}
                  onChange={(event) =>
                    update({ status: event.target.value as Status })
                  }
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label>
                Priority
                <select
                  value={ticket.priority}
                  onChange={(event) =>
                    update({ priority: event.target.value as Priority })
                  }
                >
                  {priorities.map((priority) => (
                    <option key={priority}>{priority}</option>
                  ))}
                </select>
              </label>
              <label>
                Assigned to
                <select
                  value={ticket.assignee}
                  onChange={(event) => update({ assignee: event.target.value })}
                >
                  {agents.map((agent) => (
                    <option key={agent}>{agent}</option>
                  ))}
                </select>
              </label>
              <div className="property-value">
                <span>Category</span>
                <strong>{ticket.category}</strong>
              </div>
              <div className="property-value">
                <span>Priority level</span>
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>
          </section>
          <section className="panel customer-panel">
            <div className="panel-heading">
              <h2>Customer</h2>
            </div>
            <div className="customer-profile">
              <Avatar name={customer.name} color={customer.color} />
              <h3>{customer.name}</h3>
              <p>{customer.company}</p>
              <span>{customer.email}</span>
              <span className={`plan-badge ${customer.plan.toLowerCase()}`}>
                {customer.plan} plan
              </span>
            </div>
            <a
              className="customer-all-tickets"
              href={`#/tickets?customer=${customer.id}`}
            >
              View customer’s tickets{" "}
              <ArrowLeft className="flipped" size={14} />
            </a>
          </section>
        </aside>
      </div>
    </>
  )
}
