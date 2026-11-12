# BorrowDesk

BorrowDesk is the borrower-operations frontend for the Security Lending platform. It follows the supplied enterprise reference screens: dark grouped sidebar, compact top navigation, KPI strips, dense filterable grids, status badges, master/detail inspection and contextual workflow panels.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173.

## Backend services

| Service | Default URL | Responsibility |
|---|---|---|
| Borrower service | http://localhost:8081 | Borrower dashboard, account, locates, reservations, loans, collateral, margin calls, funding, returns, fees, rebates and audit projections |
| Lender service | http://localhost:8084 | Agreement decisions and lender-side confirmations |
| Market data | http://localhost:8080 | Security master and market data |

The frontend defaults to organization ID `1`, matching the local demo configuration. Click the organization name in the top bar to change it.

## Environment variables

- `VITE_BORROWER_API` – borrower service URL
- `VITE_LENDER_API` – lender service URL
- `VITE_MARKET_API` – market data service URL
- `VITE_ORG_ID` – initial organization ID

See `.env.example` for defaults. The app uses the existing `/api/v1/organizations/{org}` API routes. It does not introduce backend endpoints or modify the backend repository.

## Workflows

The UI connects to the existing borrower APIs for locate requests, reservations, loan requests, collateral allocation, margin responses, funding requests, returns, fee and rebate views, and audit views. Agreement approve/reject actions use the lender service. The frontend does not fabricate lender/FIX confirmations: requests remain pending until the backend receives the corresponding confirmation event, in accordance with the backend service boundaries.

## Notes

- Tables display the fields returned by the backend rather than inventing response schemas.
- The interface is optimized for desktop operations and adapts to narrower screens.
- Start PostgreSQL, Kafka and the Spring Boot services as documented in `security-lending/START_DEMO.md` before testing workflows.