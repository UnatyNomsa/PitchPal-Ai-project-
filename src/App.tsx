import { Router, Route, Switch } from 'wouter'
import { WelcomePage } from './pages/WelcomePage'
import { DashboardPage } from './pages/DashboardPage'
import { RecordPage } from './pages/RecordPage'
import { AnalysisPage } from './pages/AnalysisPage'
import { HistoryPage } from './pages/HistoryPage'
import { PricingPage } from './pages/PricingPage'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Router>
        <Switch>
          <Route path="/" component={WelcomePage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/record" component={RecordPage} />
          <Route path="/analysis/:sessionId" component={AnalysisPage} />
          <Route path="/history" component={HistoryPage} />
          <Route path="/pricing" component={PricingPage} />
          <Route>
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Page Not Found
                </h1>
                <p className="text-gray-600 mb-6">
                  The page you're looking for doesn't exist.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Go Home
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App