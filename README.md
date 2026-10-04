# Supportdesk demo

A small, entirely client-side customer support app used as the Terminus demo project. Built with React, TypeScript, Vite, and locally bundled fonts and icons.

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local URL. `npm run build` builds the static site into `dist`, and `npm run preview` serves that build locally. Run `npm test`, `npm run typecheck`, and `npm run lint` for validation.

## What’s included

- Dashboard with ticket queue metrics, sample weekly activity, priority tickets, and recent tickets.
- Twenty mock tickets, with search, status and priority filters, sorting, and pagination.
- Ticket details with a conversation, local replies, status changes, priority changes, and assignment.
- A new-ticket dialog and eight searchable customer records with links to their tickets.
- Workspace settings, a sample support team, and light, dark, and system themes.
- Responsive navigation and hash-based routes (for example, `#/tickets/TK-1042`).

Mock records live in `src/data/support.ts`. Weekly chart data is a separate, explicitly labeled historical sample. Ticket counts always reflect the current in-memory queue.

There is no backend, authentication, database, or external service. Tickets, replies, and workspace edits only last for the current page session; refresh or **Settings → Reset demo data** restores the sample records. Appearance preferences are stored in browser `localStorage`. No customer messages are sent anywhere.
