import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/expenses" element={<Expenses />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/budget" element={<Budget />} />
                    </Routes>
                </main>
            </div>
        </div>
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
                                borderRadius: '12px',
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontWeight: 500,
                            },
                        }}
                    />
                    <Routes>
                        <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
                        <Route path="/signup" element={<AuthRedirect><Signup /></AuthRedirect>} />
                        <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
                    </Routes>
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
