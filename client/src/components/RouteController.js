import React from 'react';
import { Route, useLocation } from 'react-router-dom';
import Header from './Header';
import Homepage from '../pages/Homepage';
import User, { UserContext } from './User';
import Board from '../pages/Board';
import MyBoards from '../pages/MyBoards';

function RouteController() {
    let location = useLocation()
    const path = location.pathname
    const userStr = localStorage.getItem("flexiboard_user")
    const initialUser = userStr !== null ? JSON.parse(userStr) : null
    return (
        <User user={initialUser}>
            <UserContext.Consumer>
                {value => (
                    <Header userContext={value} path={path} />
                )}
            </UserContext.Consumer>
            <Route exact path="/">
                <Homepage />
            </Route>
            <Route path="/board/">
                <UserContext.Consumer>
                    {value => (
                        <Board userContext={value} token={value.token} path={path} user={value.user} />
                    )}
                </UserContext.Consumer>
            </Route>
            <Route exact path="/me/boards">
                <UserContext.Consumer>
                    {value => (
                        <MyBoards userContext={value} />
                    )}
                </UserContext.Consumer>
            </Route>
        </User>
    );
}

export default RouteController;
