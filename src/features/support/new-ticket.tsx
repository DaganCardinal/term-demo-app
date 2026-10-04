import { useEffect, useRef, useState, type FormEvent } from "react"
import { Plus, X } from "lucide-react"
import { customers, priorities, type Priority } from "@/data/support"

export interface NewTicketValues {
  subject: string
  customerId: string
  priority: Priority
  body: string
}
export function NewTicketDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (values: NewTicketValues) => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [error, setError] = useState("")
  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    element?.querySelector("input")?.focus()
    return () => element?.close()
  }, [])
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const subject = String(values.get("subject") ?? "").trim()
    const body = String(values.get("body") ?? "").trim()
    if (!subject || !body) {
      setError("Please enter a subject and a message.")
      return
    }
    onCreate({
      subject,
      body,
      customerId: String(values.get("customerId")),
      priority: String(values.get("priority")) as Priority,
    })
  }
  return (
    <dialog
      ref={dialog}
      className="ticket-dialog"
      aria-labelledby="new-ticket-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) {
          const bounds = dialog.current.getBoundingClientRect()
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            onClose()
        }
      }}
    >
      <div className="dialog-heading">
        <div>
          <span className="dialog-icon">
            <Plus size={20} />
          </span>
          <h2 id="new-ticket-title">Create a ticket</h2>
          <p>Let’s get this customer the help they need.</p>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="Close new ticket"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <form onSubmit={submit}>
        <label>
          Subject
          <input
            name="subject"
            placeholder="What can we help with?"
            required
            maxLength={120}
            autoFocus
          />
        </label>
        <div className="form-columns">
          <label>
            Customer
            <select name="customerId" required>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select name="priority" defaultValue="Medium">
              {priorities.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Message
          <textarea
            name="body"
            placeholder="A few details will help your team get started…"
            rows={5}
            required
            maxLength={5000}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-footer">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn primary">
            <Plus size={15} />
            Create ticket
          </button>
        </div>
      </form>
    </dialog>
  )
}
