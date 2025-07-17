import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';

const componentRegistry = {
  'support-tickets': React.lazy(() => import('supportTicketsApp/SupportTickets')),
};

const Dashboard = () => {
    const { token, logout } = useAuth();
    const [screens, setScreens] = useState([]);
    const [SelectedComponent, setSelectedComponent] = useState(null);

    useEffect(() => {
        const fetchScreens = async () => {
            const API_URL = 'http://localhost:5001';
            const response = await fetch(`${API_URL}/api/me/screens`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = 
      const LazyCompone = componentRegistry[screen.id];
      if (LazyComponent) {
        setSelectedComponent(() => LazyComponent);
      } else {
        setSelectedComponent(() => () => <div>Component '{screen.name}' not found.</div>);
      }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md">
                <div className="p-4 font-bold text-xl text-indigo-600 border-b">Flowbit</div>
                <nav className="mt-5">
                    {screens.map(screen => (
                        <a
                            key={screen.id}
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleScreenSelect(screen); }}
                            className="block px-4 py-2 mt-2 text-sm text-gray-600 hover:bg-gray-200"
                        >
                            {screen.name}
                        </a>
                    ))}
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t">
                    <button
                        onClick={logout}
                        className="w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
                    >
                        Sign out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="p-4 bg-white border-b">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                </header>
                <main className="flex-1 p-6">
                    <Suspense fallback={<div className="text-gray-500">Loading component...</div>}>
                        {SelectedComponent ? <SelectedComponent /> : <div className="text-gray-500">Select a screen from the sidebar to begin.</div>}
                    </Suspense>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
