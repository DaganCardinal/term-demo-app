import type { ReactNode } from "react"
import { Inbox, Plus } from "lucide-react"
import { initials, type Priority, type Status } from "@/data/support"

export function Avatar({
  name,
  color = "mint",
  small = false,
}: {
  name: string
  color?: string
  small?: boolean
}) {
  return (
    <span
      className={`avatar ${color} ${small ? "small" : ""}`}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`status-badge ${status.toLowerCase()}`}>
      <span />
      {status}
    </span>
  )
}
export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`priority ${priority.toLowerCase()}`}>
      <span className="priority-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {priority}
    </span>
  )
}
export function PageHeading({
  title,
  description,
  onNewTicket,
  children,
}: {
  title: string
  description: string
  onNewTicket?: () => void
  children?: ReactNode
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {onNewTicket ? (
        <button className="btn primary" onClick={onNewTicket}>
          <Plus size={16} />
          New ticket
        </button>
      ) : (
        children
      )}
    </div>
  )
}
export function EmptyState({
  title,
  description,
  onClear,
}: {
  title: string
  description: string
  onClear?: () => void
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Inbox size={24} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {onClear && (
        <button className="btn" onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  )
}
