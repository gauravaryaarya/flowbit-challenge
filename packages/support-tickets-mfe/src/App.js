import React, { useState, useEffect, useCallback } from 'react';

const useSharedAuth = () => {
    return { token: localStorage.getItem('jwt_token') };
};

const App = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useSharedAuth();

    const fetchTickets = useCallback(async () => {
        if (!token) {
            setError('Authentication token not found.');
            setLoading(false);
            return;
        }
        try {
            const API_URL = 'http://localhost:5001';
            const response = await fetch(`${API_URL}/api/tickets`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }
            const data = await response.json();
            setTickets(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Fetch tickets on initial load
    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    // Poll for updates every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchTickets();
        }, 3000);
        return () => clearInterval(interval); // Cleanup on unmount
    }, [fetchTickets]);

    const handleCreateTicket = async () => {
        if (!token) return;
        const newTicketData = {
            title: `New Ticket on ${new Date().toLocaleTimeString()}`,
            description: 'This is a test ticket created from the UI.'
        };
        try {
            const API_URL = 'http://localhost:5001';
            await fetch(`${API_URL}/api/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTicketData)
            });
            // Immediately fetch again to update the UI
            fetchTickets();
        } catch (err) {
            console.error('Failed to create ticket', err);
        }
    };
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-800';
            case 'Processing': return 'bg-yellow-100 text-yellow-800';
            case 'Done': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-gray-800">Support Tickets</h1>
                <button
                    onClick={handleCreateTicket}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Create New Ticket
                </button>
            </div>

            {loading && <p>Loading tickets...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            <div className="space-y-3">
                {tickets.length > 0 ? tickets.map(ticket => (
                    <div key={ticket._id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{ticket.title}</p>
                            <p className="text-sm text-gray-600">{ticket.description}</p>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ticket.status)}`}>
                            {ticket.status}
                        </span>
                    </div>
                )) : !loading && <p>No tickets found.</p>}
            </div>
        </div>
    );
};

export default App;
