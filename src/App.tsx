import { useEffect, useState } from 'react'
import { type Page } from './types'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import KYCPage from './pages/KYCPage'
import RiderDashboard from './pages/RiderDashboard'
import WorkScorePage from './pages/WorkScorePage'
import EVFinancingPage from './pages/EVFinancingPage'
import FinancingApplicationPage from './pages/FinancingApplicationPage'
import RepaymentsPage from './pages/RepaymentsPage'
import OwnershipPage from './pages/OwnershipPage'
import LenderLoginPage from './pages/LenderLoginPage'
import LenderDashboard from './pages/LenderDashboard'
import RiderProfilePage from './pages/RiderProfilePage'
import ApplicationDetailsPage from './pages/ApplicationDetailsPage'
import { user } from './api'

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const u = user()
    return u?.role === 'lender' || u?.role === 'admin' ? 'lender-dashboard' : u ? 'rider-dashboard' : 'landing'
  })
  const navigate = (p: Page) => {
    setPage(p)
    window.scrollTo(0, 0)
  }

  const props = { navigate }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {page === 'landing' && <LandingPage {...props} />}
      {page === 'login' && <LoginPage {...props} />}
      {page === 'kyc' && <KYCPage {...props} />}
      {page === 'rider-dashboard' && <RiderDashboard {...props} />}
      {page === 'workscore' && <WorkScorePage {...props} />}
      {page === 'ev-financing' && <EVFinancingPage {...props} />}
      {page === 'financing-application' && <FinancingApplicationPage {...props} />}
      {page === 'repayments' && <RepaymentsPage {...props} />}
      {page === 'ownership' && <OwnershipPage {...props} />}
      {page === 'lender-login' && <LenderLoginPage {...props} />}
      {page === 'lender-dashboard' && <LenderDashboard {...props} />}
      {page === 'rider-profile' && <RiderProfilePage {...props} />}
      {page === 'application-details' && <ApplicationDetailsPage {...props} />}
    </div>
  )
}
