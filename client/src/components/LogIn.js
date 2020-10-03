import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
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
    const [boardId, setBoardId] = useState(false)
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
        attemptLogin(body)
    }
    const attemptLogin = body => {
        if (body.email && body.email.match(/.+@.+\..+/) && body.password) {
            requestLogInAndEstablishUser(body)
        }
    }
    const requestLogInAndEstablishUser = body => {
        axios.post(window.location.origin + "/api/v1/users/login", body).then(response => {
            establishUser(response.data)
        })
    }
    const establishUser = data => {
        setGlobalParameter("flexiboard_user", data.user, props.setUser)
        setGlobalParameter("flexiboard_token", data.token, props.setToken)
    }
    const setGlobalParameter = (parameter, value, setValue) => {
        localStorage.setItem(parameter, JSON.stringify(value))
        setValue(value)
    }
    const handleSignUp = () => {
        const body = {
            user: {
                email: email,
                password: password,
                name: name
            },
            board: {
                title: `${name}'s First Board`,
                cards: props.cards
            }
        }
        attemptSignUp(body)
    }
    const attemptSignUp = body => {
        if (body.user.email && body.user.email.match(/.+@.+\..+/) && body.user.password && body.user.password === passwordMatch && body.user.name) {
            requestSignUpAndEstablishUserAndBoard(body);
        }
    }
    const requestSignUpAndEstablishUserAndBoard = body => {
        axios.post(window.location.origin + "/api/v1/users/register", body).then(response => {
            establishUser(response.data);
            establishBoard(response.data)
        });
    }
    const establishBoard = data => {
        setBoardId(data.board._id);
    }
    const getInputProps = (value, inputName, placedholder) => {
        return {
            onChange: handleChange,
            name: inputName,
            value: value,
            placeholder: placedholder
        }
    }
    return (
        <div>
            <StyledInput {...getInputProps(email, "email", "Your Email...")} />
            {isNew && <StyledInput {...getInputProps(name, "name", "Your Name...")} />}
            <StyledInput {...getInputProps(password, "password", "Your Password...")} type="password" />
            {isNew && <StyledInput {...getInputProps(passwordMatch, "passwordMatch", "Reenter Password...")} type="password" />}
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
            {
                boardId && <Redirect to={`/board/${boardId}`} />
            }
        </div>
    );
}

export default LogIn;