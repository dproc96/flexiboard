import React, { useState } from 'react';
import styled from 'styled-components';
import StyledButton from '../styles/StyledButton';
import axios from 'axios';

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
    const handleSwapNew = () => {
        setIsNew(!isNew)
    }
    const handleLogIn = () => {
        const body = {
            email: email,
            password: password
        }
        if (body.email && body.email.match(/.+@.+\..+/) && body.password) {
            axios.post(window.location.origin + "/users/login", body).then(response => {
                console.log(response)
                localStorage.setItem("flexiboard-token", response.data.token)
            })
        }
    }
    const handleSignUp = () => {
        const body = {
            email: email,
            password: password,
            name: name
        }
        if (body.email && body.email.match(/.+@.+\..+/) && body.password && body.password === passwordMatch && body.name) {
            axios.post(window.location.origin + "/users/register", body).then(response => {
                console.log(response)
                localStorage.setItem("flexiboard-token", response.data.token)
            })
        }
    }
    return (
        <div>
            <StyledInput onChange={handleChange} name="email" value={email} placeholder="Your Email..." />
            {isNew && <StyledInput onChange={handleChange} name="name" value={name} placeholder="Your Name..." />}
            <StyledInput type="password" onChange={handleChange} name="password" value={password} placeholder="Your Password..." />
            {isNew && <StyledInput type="password" onChange={handleChange} name="passwordMatch" value={passwordMatch} placeholder="Reenter Password..." />}
            {isNew ?
            <React.Fragment>
                <StyledButton onClick={handleSignUp}>Sign Up & Create Board</StyledButton>
                <StyledButton onClick={handleSwapNew}>I Have An Account</StyledButton>
            </React.Fragment>
            :
            <React.Fragment>
                <StyledButton onClick={handleLogIn}>Log In</StyledButton>
                <StyledButton onClick={handleSwapNew}>Create An Account</StyledButton>
            </React.Fragment>
            }
        </div>
    );
}

export default LogIn;