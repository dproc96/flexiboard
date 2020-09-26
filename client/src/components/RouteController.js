import React, { useEffect, useRef, useState } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import Header from './Header';
import CardContainer from './CardContainer';
import Homepage from '../pages/Homepage';
import User from './User';
import Board from '../pages/Board';

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
    let location = useLocation()
    const path = location.pathname
    const [showLogin, setShowLogin] = useState(false)
    const userStr = localStorage.getItem("flexiboard_user")
    const [user, setUser] = useState(typeof userStr !== null ? JSON.parse(userStr) : null)
    const [token, setToken] = useState(localStorage.getItem("flexiboard_token"))
    console.log(user)
    return (
        <User user={user}>
            <Header setUser={setUser} setShowLogin={setShowLogin} path={path} />
            <Route exact path="/">
                <Homepage setToken={setToken} setUser={setUser} setShowLogin={setShowLogin} showLogin={showLogin} />
            </Route>
            <Route path="/board/">
                <Board token={token} path={path} user={user} />
            </Route>
        </User>
    );
}

export default RouteController;
