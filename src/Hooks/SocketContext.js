import React, { createContext, useState, useEffect } from "react";
import socket from "../utils/Socket";

const SocketContext = createContext();

const ProvideContext = ({ children }) => {

    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        socket.on("receive-notification", ({ notif, sender, time }) => {
            setNotifications((notification) => [...notification, { notif, sender, time }]);
            // console.log(chat);
        });
        
    }, [socket]);
    useEffect(() => {
        socket.on("me", ( id ) => {
            // setNotifications((notification) => [...notification, { notif, sender, time }]);
            // socket.emit('me', {socket.id});
            
            console.log(id);
        });
    }, [socket]);

    return (
        <SocketContext.Provider value={{ notifications }}>{children}</SocketContext.Provider>
    );
}

export {SocketContext, ProvideContext}