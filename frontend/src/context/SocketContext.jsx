import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(()=>{
        // connect to socket server
        const newSocket = io('http://localhost:7000', {
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        newSocket.on('connect', ()=>{
            console.log('Socket connected:', newSocket.id);
            setConnected(true);
        });

        newSocket.on('disconnect', ()=>{
            console.log('Socket disconnected');
            setConnected(false);
        });

        setSocket(newSocket);

        // cleanup
        return ()=>{
            newSocket.close();
        };
    }, []);

    return(
        <SocketContext.Provider value={{ socket, connected}}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket =()=>{
    const context = useContext(SocketContext);
    if(!context){
        throw new Error('usseSocket must be used within SocketProvider');
    }
    return context;
};