import React, { useState } from 'react';
import styled from 'styled-components';
import StyledButton from '../styles/StyledButton';
import { Redirect } from 'react-router-dom';

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
    return (
        <StyledHeader>
            <img width="150px" src="/assets/images/flexiboard-header-logo.png" alt="flexiboard" />
            <div>
                {props.userContext.user && props.path !== "/me/boards" && <StyledButton style={{margin: "0px 10px"}} onClick={myBoardsClick}>My Boards</StyledButton>}
                <StyledButton onClick={logButtonClick(props.userContext.user)}>Log {props.userContext.user ? "Out" : "In"}</StyledButton>
            </div>
            {redirect && <Redirect to={redirect} />}
        </StyledHeader>
    );
}

export default Header;