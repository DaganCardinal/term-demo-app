export const statuses = ["Open", "Pending", "Resolved"] as const
export const priorities = ["Low", "Medium", "High", "Urgent"] as const
export type Status = (typeof statuses)[number]
export type Priority = (typeof priorities)[number]

export interface Customer {
  id: string
  name: string
  email: string
  company: string
  color: string
  plan: "Starter" | "Pro" | "Enterprise"
  joined: string
}
export interface Message {
  id: string
  author: string
  role: "customer" | "agent"
  body: string
  timestamp: string
}
export interface Ticket {
  id: string
  subject: string
  customerId: string
  status: Status
  priority: Priority
  assignee: string
  category: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}

export const agents = [
  "Alex Morgan",
  "Jamie Chen",
  "Sam Rivera",
  "Taylor Brooks",
]
export const customers: Customer[] = [
  {
    id: "c1",
    name: "Olivia Rhye",
    email: "olivia@acme.example",
    company: "Acme Studio",
    color: "lavender",
    plan: "Pro",
    joined: "2026-02-14",
  },
  {
    id: "c2",
    name: "Phoenix Baker",
    email: "phoenix@layers.example",
    company: "Layers",
    color: "peach",
    plan: "Enterprise",
    joined: "2026-01-08",
  },
  {
    id: "c3",
    name: "Lana Steiner",
    email: "lana@sisyphus.example",
    company: "Sisyphus",
    color: "mint",
    plan: "Pro",
    joined: "2026-04-22",
  },
  {
    id: "c4",
    name: "Demi Wilkinson",
    email: "demi@catalog.example",
    company: "Catalog",
    color: "blue",
    plan: "Starter",
    joined: "2026-08-11",
  },
  {
    id: "c5",
    name: "Drew Cano",
    email: "drew@circooles.example",
    company: "Circooles",
    color: "rose",
    plan: "Enterprise",
    joined: "2026-03-19",
  },
  {
    id: "c6",
    name: "Natali Craig",
    email: "natali@hourglass.example",
    company: "Hourglass",
    color: "peach",
    plan: "Pro",
    joined: "2026-06-02",
  },
  {
    id: "c7",
    name: "Orlando Diggs",
    email: "orlando@command.example",
    company: "Command",
    color: "blue",
    plan: "Starter",
    joined: "2026-09-01",
  },
  {
    id: "c8",
    name: "Andi Lane",
    email: "andi@quotient.example",
    company: "Quotient",
    color: "mint",
    plan: "Pro",
    joined: "2026-05-17",
  },
]

type TicketSeed = [string, string, Status, Priority, string, string]
const seeds: TicketSeed[] = [
  [
    "Unable to access my workspace",
    "c1",
    "Open",
    "Urgent",
    "Alex Morgan",
    "Account",
  ],
  [
    "Invoice shows an incorrect amount",
    "c2",
    "Open",
    "High",
    "Jamie Chen",
    "Billing",
  ],
  [
    "Team invitation email not arriving",
    "c3",
    "Pending",
    "Medium",
    "Sam Rivera",
    "Account",
  ],
  [
    "How do I export project reports?",
    "c4",
    "Open",
    "Low",
    "Taylor Brooks",
    "Product",
  ],
  [
    "Integration keeps disconnecting",
    "c5",
    "Open",
    "High",
    "Alex Morgan",
    "Integrations",
  ],
  [
    "Update the billing contact",
    "c6",
    "Pending",
    "Low",
    "Jamie Chen",
    "Billing",
  ],
  ["Dashboard loading slowly", "c7", "Open", "Medium", "Sam Rivera", "Product"],
  [
    "Request for custom report filters",
    "c8",
    "Pending",
    "Low",
    "Taylor Brooks",
    "Feature request",
  ],
  [
    "Password reset link has expired",
    "c1",
    "Resolved",
    "Medium",
    "Alex Morgan",
    "Account",
  ],
  [
    "Duplicate charge on September invoice",
    "c2",
    "Resolved",
    "High",
    "Jamie Chen",
    "Billing",
  ],
  [
    "Missing notifications on mobile",
    "c3",
    "Open",
    "Medium",
    "Sam Rivera",
    "Product",
  ],
  [
    "Can I upgrade to the Pro plan?",
    "c4",
    "Resolved",
    "Low",
    "Taylor Brooks",
    "Billing",
  ],
  [
    "Unable to upload large attachments",
    "c5",
    "Open",
    "High",
    "Alex Morgan",
    "Product",
  ],
  [
    "Change our workspace name",
    "c6",
    "Resolved",
    "Low",
    "Jamie Chen",
    "Account",
  ],
  [
    "Webhook deliveries are delayed",
    "c7",
    "Pending",
    "High",
    "Sam Rivera",
    "Integrations",
  ],
  [
    "Add a second workspace administrator",
    "c8",
    "Resolved",
    "Medium",
    "Taylor Brooks",
    "Account",
  ],
  [
    "Report date range is incorrect",
    "c1",
    "Open",
    "Medium",
    "Alex Morgan",
    "Product",
  ],
  [
    "Questions about annual billing",
    "c2",
    "Pending",
    "Low",
    "Jamie Chen",
    "Billing",
  ],
  [
    "Calendar integration setup",
    "c3",
    "Resolved",
    "Low",
    "Sam Rivera",
    "Integrations",
  ],
  [
    "Account email change confirmation",
    "c4",
    "Resolved",
    "Medium",
    "Taylor Brooks",
    "Account",
  ],
]
const descriptions = [
  "Hi team, I’ve been trying to open our workspace this morning, but I keep getting an error after signing in. I’ve tried another browser and cleared my cache. Could you help me get back in? Our team has a deadline today. Thanks!",
  "Hi, our latest invoice doesn’t match the amount on our plan. Could you take a look and let me know how we can get this corrected? I’m happy to provide more details.",
  "Hello! I invited a new teammate yesterday, but they still haven’t received the invitation. We’ve checked their spam folder and tried resending it. What should we try next?",
]
export const initialTickets: Ticket[] = seeds.map(
  ([subject, customerId, status, priority, assignee, category], index) => {
    const customer = customers.find((item) => item.id === customerId)!
    const timestamp = new Date(
      Date.UTC(2026, 9, 4, 15, 42) - index * 3_600_000
    ).toISOString()
    return {
      id: `TK-${1042 - index}`,
      subject,
      customerId,
      status,
      priority,
      assignee,
      category,
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: [
        {
          id: `${index}-customer`,
          author: customer.name,
          role: "customer",
          body:
            descriptions[index] ??
            `Hi support team, I need some help with this: ${subject.toLowerCase()}. Could you take a look and let me know the next steps? Thank you!`,
          timestamp,
        },
        ...(status === "Open"
          ? []
          : [
              {
                id: `${index}-agent`,
                author: assignee,
                role: "agent" as const,
                body:
                  status === "Resolved"
                    ? "Thanks for reaching out! We’ve sorted this out for you. Please let us know if you need anything else."
                    : "Thanks for the details. I’m looking into this and will follow up as soon as I have an update.",
                timestamp,
              },
            ]),
      ],
    }
  }
)

// Historical sample data, independent of the current ticket queue.
export const weeklyActivity = [
  { day: "Mon", received: 18, resolved: 12 },
  { day: "Tue", received: 26, resolved: 20 },
  { day: "Wed", received: 22, resolved: 17 },
  { day: "Thu", received: 34, resolved: 28 },
  { day: "Fri", received: 28, resolved: 23 },
  { day: "Sat", received: 16, resolved: 14 },
  { day: "Sun", received: 20, resolved: 18 },
]

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
}
export function formatDate(date: string, includeTime = false) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: "UTC",
  }).format(new Date(date))
}
export function ticketCounts(tickets: Ticket[]) {
  return {
    total: tickets.length,
    open: tickets.filter((ticket) => ticket.status === "Open").length,
    pending: tickets.filter((ticket) => ticket.status === "Pending").length,
    resolved: tickets.filter((ticket) => ticket.status === "Resolved").length,
  }
}
export function filterTickets(
  tickets: Ticket[],
  query: string,
  status = "All",
  priority = "All",
  customerId = ""
) {
  const search = query.trim().toLowerCase()
  return tickets.filter((ticket) => {
    const customer = customers.find((item) => item.id === ticket.customerId)
    return (
      (status === "All" || ticket.status === status) &&
      (priority === "All" || ticket.priority === priority) &&
      (!customerId || ticket.customerId === customerId) &&
      [
        ticket.id,
        ticket.subject,
        customer?.name,
        customer?.company,
        customer?.email,
        ticket.assignee,
      ].some((value) => value?.toLowerCase().includes(search))
    )
  })
}
