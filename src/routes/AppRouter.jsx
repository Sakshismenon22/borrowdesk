import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import WorkspacePage from '../pages/WorkspacePage'
import TradingPage from '../pages/TradingPage'
import {DEFAULT_WORKSPACE_PATH, WORKSPACE_ROUTES} from './routeConfig'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={DEFAULT_WORKSPACE_PATH} replace />} />
        {WORKSPACE_ROUTES.map(({path, page}) => (
          <Route key={path} path={path} element={page === 'Trading' ? <TradingPage /> : <WorkspacePage page={page} />} />
        ))}
        <Route path="*" element={<Navigate to={DEFAULT_WORKSPACE_PATH} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
