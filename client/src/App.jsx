import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedWave from './components/AnimatedWave';
import PageTransition from './components/PageTransition';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';

const AnimatedRoutes = () => {
    const location = useLocation();
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
                <Route path="/expenses" element={<PageTransition><Expenses /></PageTransition>} />
                <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
                <Route path="/budget" element={<PageTransition><Budget /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-grid-pattern">
            <AnimatedWave />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen relative z-10">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
                    <AnimatedRoutes />
                </main>
            </div>
        </div>
    );
};

const RootRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<AuthRedirect><PageTransition><Login /></PageTransition></AuthRedirect>} />
                <Route path="/signup" element={<AuthRedirect><PageTransition><Signup /></PageTransition></AuthRedirect>} />
                <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
            </Routes>
        </AnimatePresence>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                borderRadius: '16px',
                                padding: '16px 24px',
                                fontSize: '14px',
                                fontWeight: 600,
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(168, 85, 247, 0.2)',
                                color: '#1e293b',
                            },
                        }}
                    />
                    <RootRoutes />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

// Redirect authenticated users away from auth pages
const AuthRedirect = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default App;
