import { io } from "socket.io-client";

const getSocketUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && !envUrl.includes('localhost')) {
        return envUrl.replace('/api', '');
    }
    
    // If we're on a non-localhost host (like an IP address via vite --host), 
    // we should connect to that same host on port 5000
    const hostname = window.location.hostname;
    return `http://${hostname}:5000`;
};

const SOCKET_URL = getSocketUrl();

const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket']
});

export default socket;

