import React, { useState } from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
    display: block;
    width: 90%;
    margin-bottom: 15px;
`

function LogIn(props) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState("");
    const [isNew, setIsNew] = useState(true)
    const stateFunctions = {
        email: setEmail,
        name: setName,
        password: setPassword,
        passwordMatch: setPasswordMatch,
        isNew: setIsNew
    }
    const handleChange = e => {
        const { name, value } = e.target;
        stateFunctions[name](value)
    }
    return (
        <div>
            <StyledInput onChange={handleChange} name="email" value={email} placeholder="Your Email..." />
            <StyledInput onChange={handleChange} name="name" value={name} placeholder="Your Name..." />
            <StyledInput type="password" onChange={handleChange} name="password" value={password} placeholder="Your Password..." />
            <StyledInput type="password" onChange={handleChange} name="passwordMatch" value={passwordMatch} placeholder="Reenter Password..." />
        </div>
    );
}

export default LogIn;