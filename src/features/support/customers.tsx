import { useState } from "react"
import { ArrowRight, Search, Users } from "lucide-react"
import { customers, formatDate, type Ticket } from "@/data/support"
import { Avatar, EmptyState, PageHeading } from "./common"

export function CustomersPage({ tickets }: { tickets: Ticket[] }) {
  const [query, setQuery] = useState("")
  const filtered = customers.filter((customer) =>
    [customer.name, customer.email, customer.company].some((value) =>
      value.toLowerCase().includes(query.trim().toLowerCase())
    )
  )
  return (
    <>
      <PageHeading
        title="Customers"
        description="The people at the heart of your support desk."
      />
      <section className="panel">
        <div className="panel-heading">
          <div className="section-title">
            <h2>All customers</h2>
            <span className="count-bubble">{customers.length}</span>
          </div>
          <span className="muted">A little context goes a long way.</span>
        </div>
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={17} />
            <input
              aria-label="Search customers"
              value={query}
              placeholder="Search by name, company, or email…"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        {filtered.length ? (
          <div className="table-scroll">
            <table>
              <caption className="sr-only">Customer directory</caption>
              <thead>
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">Company</th>
                  <th scope="col">Plan</th>
                  <th scope="col" className="numeric">
                    Tickets
                  </th>
                  <th scope="col" className="numeric">
                    Open
                  </th>
                  <th scope="col">Customer since</th>
                  <th scope="col">
                    <span className="sr-only">Customer tickets</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => {
                  const related = tickets.filter(
                    (ticket) => ticket.customerId === customer.id
                  )
                  return (
                    <tr key={customer.id}>
                      <td>
                        <div className="person">
                          <Avatar name={customer.name} color={customer.color} />
                          <div>
                            <a
                              className="customer-link"
                              href={`#/tickets?customer=${customer.id}`}
                            >
                              {customer.name}
                            </a>
                            <small>{customer.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{customer.company}</td>
                      <td>
                        <span
                          className={`plan-badge ${customer.plan.toLowerCase()}`}
                        >
                          {customer.plan}
                        </span>
                      </td>
                      <td className="numeric">{related.length}</td>
                      <td className="numeric">
                        {
                          related.filter((ticket) => ticket.status === "Open")
                            .length
                        }
                      </td>
                      <td className="date-cell">
                        {formatDate(customer.joined)}
                      </td>
                      <td>
                        <a
                          className="row-link"
                          href={`#/tickets?customer=${customer.id}`}
                          aria-label={`View tickets for ${customer.name}`}
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
        ) : (
          <EmptyState
            title="No customers found"
            description="Try searching for a different name or company."
            onClear={() => setQuery("")}
          />
        )}
        <div className="table-footer">
          <span>{filtered.length} customers</span>
          <span className="inline-note">
            <Users size={14} />
            All customer details are sample data
          </span>
        </div>
      </section>
    </>
  )
}
