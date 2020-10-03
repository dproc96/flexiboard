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

    h1 {
        color: ${props => props.theme.white};
        text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
        width: 100%;
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
        padding: 27px;
        font-size: 20px;
        z-index: 11;
    }

    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 12;
    }

    @media only screen and (max-width: 900px) {
        h1 {
           display: none; 
        }
    }
`

function Header(props) {
    const [redirect, setRedirect] = useState(false)
    const logButtonClick = (user) => () => {
        if (user) {
            logUserOut()
        }
        else {
            showUserLoginCard()
        }
    }
    const logUserOut = () => {
        removeGlobalUser()
        removeGlobalBoard()
        redirectTo("/")
    }
    const removeGlobalUser = () => {
        props.userContext.setUser(null)
        props.userContext.setToken(null)
        localStorage.removeItem("flexiboard_user")
        localStorage.removeItem("flexiboard_token")
    }
    const removeGlobalBoard = () => {
        props.userContext.setBoard({
            title: "",
            cards: []
        })
    }
    const redirectTo = path => {
        setRedirect(path)
        setTimeout(() => { setRedirect(false) }, 0)
    }
    const showUserLoginCard = () => {
        props.userContext.setShowLogin(true)
    }
    const myBoardsClick = () => {
        removeGlobalBoard()
        redirectTo("/me/boards")
    }
    const newBoardClick = () => {
        const request = getNewBoardRequest()
        requestNewBoard(request)
    }
    const getNewBoardRequest = () => {
        return {
            board: {
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
            },
            options: {
                headers: {
                    Authorization: `Bearer ${props.userContext.token}`
                }
            }
        }
    }
    const requestNewBoard = ({ board, options }) => {
        axios.post(window.location.origin + "/api/v1/boards/create", board, options).then(response => {
            redirectTo(`/board/${response.data._id}`)
        })
    }
    const buttons = {
        newBoard: props.userContext.user && <StyledButton onClick={newBoardClick} style={{ marginRight: "10px" }}>New Board</StyledButton>,
        myBoards: props.userContext.user && props.path !== "/me/boards" && <StyledButton style={{ marginRight: "10px" }} onClick={myBoardsClick}>My Boards</StyledButton>,
        log: <StyledButton onClick={logButtonClick(props.userContext.user)}>Log {props.userContext.user ? "Out" : "In"}</StyledButton>
    }
    return (
        <StyledHeader>
            <div>
                <img width="150px" src="/assets/images/flexiboard-header-logo.png" alt="flexiboard" />
                <div>
                    {buttons.newBoard}
                    {buttons.myBoards}
                    {buttons.log}
                </div>
            </div>
            <h1>{props.userContext.board.title}</h1>
            {redirect && <Redirect to={redirect} />}
        </StyledHeader>
    );
}

export default Header;