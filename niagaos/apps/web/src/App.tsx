import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthPage } from './pages/AuthPage';

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Vertical Routes */}
            <Route path="/:vertical/:tenant/:mode/*" element={<DashboardPage />} />

            {/* Fallback */}
            <Route path="*" element={<LandingPage />} />
        </Routes>
    );
}

export default App;
