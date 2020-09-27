import React, { useState } from 'react';
import styled from 'styled-components';
import StyledButton from '../styles/StyledButton';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const StyledHeader = styled.header`
    background-color: ${props => props.theme.primary};
    padding: 15px;
    height: 45px;
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: space-between;

    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`

function Header(props) {
    const [redirect, setRedirect] = useState(false)
    const logButtonClick = (user) => () => {
        if (user) {
            props.userContext.setUser(null)
            props.userContext.setToken(null)
            localStorage.removeItem("flexiboard_user")
            localStorage.removeItem("flexiboard_token")
            setRedirect("/me/boards")
            setTimeout(() => { setRedirect(false) }, 0)
        }
        else {
            props.userContext.setShowLogin(true)
        }
    }
    const myBoardsClick = () => {
        setRedirect("/me/boards")
        setTimeout(() => {setRedirect(false)}, 0)
    }
    const newBoardClick = () => {
        const board = {
            title: "New Board",
            cards: [
                {
                    top: 200,
                    left: 200,
                    width: 350,
                    height: 250,
                    title: "Untitled Note"
                }
            ]
        }
        const options = {
            headers: {
                Authorization: `Bearer ${props.userContext.token}`
            }
        }
        axios.post(window.location.origin + "/api/v1/boards/create", board, options).then(response => {
            setRedirect(`/board/${response.data._id}`)
            setTimeout(() => { setRedirect(false) }, 0)
        })
    }
    const buttons = {
        newBoard: props.userContext.user && <StyledButton onClick={newBoardClick} style={{ marginRight: "10px" }}>New Board</StyledButton>,
        myBoards: props.userContext.user && props.path !== "/me/boards" && <StyledButton style={{ marginRight: "10px" }} onClick={myBoardsClick}>My Boards</StyledButton>,
        log: <StyledButton onClick={logButtonClick(props.userContext.user)}>Log {props.userContext.user ? "Out" : "In"}</StyledButton>
    }
    return (
        <StyledHeader>
            <img width="150px" src="/assets/images/flexiboard-header-logo.png" alt="flexiboard" />
            <div>
                {buttons.newBoard}
                {buttons.myBoards}
                {buttons.log}
            </div>
            {redirect && <Redirect to={redirect} />}
        </StyledHeader>
    );
}

export default Header;