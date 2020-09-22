import React, { useEffect, useRef, useState } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import Header from './Header';
import CardContainer from './CardContainer';
import Homepage from '../pages/Homepage';

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
    // const newBoardId = "/" + makeid(20)
    let location = useLocation()
    const path = location.pathname
    const [showLogin, setShowLogin] = useState(false)
    // const hasId = path !== "/"
    // const boardId = hasId ? path : newBoardId
    // let socket = useRef(null)
    // useEffect(() => {
    //     socket.current = socketIOClient(ENDPOINT);
    //     socket.current.emit(hasId ? "new connection" : "new board", boardId)
    // }, [boardId, hasId]);
    return (
        <React.Fragment>
            <Header setShowLogin={setShowLogin} path={path} />
            <Route exact path="/">
                <Homepage showLogin={showLogin} />
            </Route>
            <Route path="/board/">
                <CardContainer />
            </Route>
        </React.Fragment>
    );
}

export default RouteController;
