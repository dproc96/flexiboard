import React, { useEffect, useRef } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import Header from './Header';
import CardContainer from './CardContainer';

const ENDPOINT = "/";

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function RouteController() {
    const newBoardId = "/" + makeid(20)
    let location = useLocation()
    const path = location.pathname
    const hasId = path !== "/"
    const boardId = hasId ? path : newBoardId
    let socket = useRef(null)
    useEffect(() => {
        socket.current = socketIOClient(ENDPOINT);
        socket.current.emit(hasId ? "new connection" : "new board", boardId)
    }, [boardId, hasId]);
    return (
        <React.Fragment>
            <Header />
            <Route exact path="/">
                <Redirect to={boardId} />
            </Route>
            <Route exact path={boardId}>
                <CardContainer boardId={boardId} socket={socket} />
            </Route>
        </React.Fragment>
    );
}

export default RouteController;
