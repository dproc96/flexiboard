import React, { createContext, useState } from 'react';

export const UserContext = createContext(null)

function User(props) {
    const userStr = localStorage.getItem("flexiboard_user")
    const [user, setUser] = useState(userStr !== null ? JSON.parse(userStr) : null)
    const [token, setToken] = useState(localStorage.getItem("flexiboard_token"))
    const [showLogin, setShowLogin] = useState(false)
    const value = {
        user,
        setUser,
        token,
        setToken,
        showLogin,
        setShowLogin
    }
    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    );
}

export default User;