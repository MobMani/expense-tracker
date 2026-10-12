# Fund Ledger

An Angular app for tracking money collected from contributors and money
spent, with two login roles.

## What it does

- **Login** — two hardcoded accounts (change them any time in
  `src/app/services/auth.service.ts`):
  - `admin` / `admin123` — full access
  - `user` / `user123` — view only
- **Normal user** — sees one page: the list of contributors, how much
  each person gave, and the total collected.
- **Admin** — gets two extra pages:
  - **Manage** — add or edit contributors and expenses (tabbed form +
    table, with Edit/Delete on each row).
  - **Reports** — read-only view of contributors, total spent broken
    down by purpose, and all expenses, plus a Collected / Spent /
    Balance summary.

All data is stored in the browser's `localStorage` — no backend or
database is required. Data persists across page reloads but is local
to whichever browser it's entered in (it won't sync between devices).

## Running it

You'll need [Node.js](https://nodejs.org) (v18 or newer) installed.

```bash
npm install
npm start
```

Then open http://localhost:4200 in your browser.

## Project structure

```
src/app/
  services/
    auth.service.ts       # login/logout, hardcoded accounts
    data.service.ts        # contributors + expenses, saved to localStorage
  guards/
    auth.guard.ts          # blocks pages unless logged in
    admin.guard.ts          # blocks admin pages unless role is admin
  pages/
    login/                  # sign-in screen
    contributors-list/      # read-only list, all logged-in users
    admin-manage/           # add/edit contributors & expenses (admin)
    admin-reports/          # reports & summary (admin)
```

## Moving to a real backend later

Everything reads and writes through `AuthService` and `DataService`.
To switch from `localStorage` to a real API, you only need to change
the internals of those two files (e.g. call `HttpClient` instead of
`localStorage`) — the pages and guards don't need to change.

## Customizing

- **Add more admin accounts / change passwords**: edit the
  `CREDENTIALS` array in `auth.service.ts`.
- **Currency symbol**: amounts are shown as plain numbers via Angular's
  `number` pipe; swap to `currency` pipe in the templates if you want
  a currency symbol.
