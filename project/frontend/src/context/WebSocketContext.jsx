import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setReloadTimeout, clearReloadTimeout } from '../components/timeoutUtil';

// Create a context for the WebSocket
const WebSocketContext = createContext(null);

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);

// Provider component to manage the WebSocket connection
export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [dataCenter, setDataCenter] = useState([]);
    const [load, setLoad] = useState(true);

    // Function to initiate the WebSocket connection
    const connectWebSocket = useCallback(() => {
        setReloadTimeout(); // Call this function to set the initial timeout
        // Establish the WebSocket connection
        const ws = new WebSocket(`${import.meta.env.VITE_REACT_APP_API_BC_PREFIX}${window.location.hostname}${import.meta.env.VITE_REACT_APP_API_BC}`);

        ws.onopen = () => {
            console.log('WebSocket connection opened.');
            // You can add more logic here for when the connection opens
        };

        ws.onmessage = (event) => {
            // Handle incoming WebSocket messages
            // console.log('Received data:', event.data);
            const data = JSON.parse(event.data);
            setReloadTimeout(); // Call this function when a message is received.


            setDataCenter(data || []);
            setLoad(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            // Handle WebSocket errors
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed.');
            // Handle WebSocket disconnection
        };

        setSocket(ws);
        return () => {
            clearReloadTimeout();
            ws.close();
        };
    }, []);

    // Function to close the WebSocket connection
    const disconnectWebSocket = useCallback(() => {
        if (socket) {
            socket.close();
            setSocket(null); // Reset the socket state
            console.log('WebSocket connection closed by disconnect function.');
        }
    }, [socket]);

    // Effect to clean up WebSocket connection on component unmount
    //   useEffect(() => {
    //     return () => {
    //       if (socket) {
    //         socket.close();
    //         console.log('WebSocket connection closed by cleanup effect.');
    //       }
    //     };
    //   }, [socket]);

    const value = {
        connectWebSocket,
        disconnectWebSocket,
        socket,
        dataCenter,
        load
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};