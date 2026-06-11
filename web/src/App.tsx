import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { ReportsPage } from './pages/ReportsPage';
import { PerformancePage } from './pages/PerformancePage';
import { BrokerDetailPage } from './pages/BrokerDetailPage';
import { BrokerManagementPage } from './pages/BrokerManagementPage';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/brokers/:brokerCode" element={<BrokerDetailPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/broker-management" element={<BrokerManagementPage />} />
          </Routes>
        </Layout>
      </Router>
    </UserProvider>
  );
}

export default App;
