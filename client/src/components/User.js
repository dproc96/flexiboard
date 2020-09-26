import React, { createContext } from 'react';

export const UserContext = createContext(null)

function User(props) {
    return (
        <UserContext.Provider value={props.user}>
            {props.children}
        </UserContext.Provider>
    );
}

export default User;