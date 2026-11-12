# BorrowDesk

BorrowDesk is the borrower-operations frontend for the Security Lending platform. It follows the supplied enterprise reference screens: dark grouped sidebar, compact top navigation, KPI strips, dense filterable grids, status badges, master/detail inspection and contextual workflow panels.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173.

## Frontend structure

```text
src/
  components/
    layout/
      Sidebar.jsx
      TopBar.jsx
    trading/
      TradingWorkspace.jsx
  data/
    demoData.js
  pages/
    WorkspacePage.jsx
    TradingPage.jsx
  routes/
    AppRouter.jsx
    routeConfig.js
  services/
    apiClient.js
    apiConfig.js
    borrowerService.js
    marketDataService.js
  App.jsx
  main.jsx
  App.css
  index.css
```

- React Router DOM owns navigation; each workspace destination has its own URL.
- Page-level screens live in `pages/`; reusable shell and Trading UI live in `components/`.
- API base URLs and request handling live in `services/`. Market-data endpoint paths are kept identical to the backend controller mappings.
- Demo fixtures live in `data/`.

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

See `.env.example` for defaults. The app uses the existing `/api/v1/organizations/{org}` API routes. Trading uses the market-data-service security-master, current-price and historical-candle endpoints. The current-price GET endpoint is exposed by the companion backend repository.

## Workflows

The UI connects to the existing borrower APIs for locate requests, reservations, loan requests, collateral allocation, margin responses, funding requests, returns, fee and rebate views, and audit views. Agreement approve/reject actions use the lender service. The frontend does not fabricate lender/FIX confirmations: requests remain pending until the backend receives the corresponding confirmation event, in accordance with the backend service boundaries.

## Notes

- Tables display the fields returned by the backend rather than inventing response schemas.
- The interface is optimized for desktop operations and adapts to narrower screens.
- Start PostgreSQL, Kafka and the Spring Boot services as documented in `security-lending/START_DEMO.md` before testing workflows.

## Data modes

The top-bar **Live data / Demo data** selector changes the source used by the workspace.

- **Live data** loads the selected organization's records from the borrower and lender Spring Boot services. Trading loads the displayed security universe from market-data-service `/api/v1/security-master/get-all-securities`, overlays prices/OHLCV from `/api/v1/securities-current-price/get-all-securities-current-prices`, and loads historical OHLCV candles from `/api/v1/security-data/history?symbol={symbol}&exchange={exchange}`. The borrower security list is used only to map market symbols to borrower IDs for watchlist and order operations; its prices are not displayed. The Trading screen alone uses TradingView Lightweight Charts with client-side timeframe aggregation and a volume histogram. Orders are submitted to `POST /api/v1/organizations/{org}/orders`.
- **Demo data** uses the frontend fixtures in `src/data/demoData.js` for sample dashboard, borrowing, collateral, account, agreement and trading records. Demo order/watchlist actions stay local and never call transaction APIs.

## Trading workspace

Trading is a dedicated sidebar destination, not a role selector. It includes name/symbol/ISIN search, add/remove watchlist actions, per-security candlestick history, an order ticket, recent orders and trades. Orders use the existing backend paper-trading API. The backend documents execution against delayed completed-minute prices; this is not a connection to an exchange or brokerage.
