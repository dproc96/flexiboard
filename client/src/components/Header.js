import React from 'react';
import styled from 'styled-components';

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
    }

    button {
        background-color: ${props => props.theme.primaryDark};
        border: none;
        color: ${props => props.theme.white};
        border-radius: 10px;
        box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
        margin-left: 10px;
        padding: 15px;
    }

    button:hover {
        cursor: pointer;
        background-color: ${props => props.theme.primaryDarker};
    }

    button:focus {
        outline: none;
    }
    
    button:active {
        transform: scale(0.9, 0.9);
    }
`

function Header(props) {
    const buttonClick = () => {
        props.setShowLogin(true)
    }
    return (
        <StyledHeader>
            <img width="150px" src="/assets/images/flexiboard-header-logo.png" alt="flexiboard" />
            {props.path === "/" && 
            <div>
                <button onClick={buttonClick}>Log In</button>
            </div>}
        </StyledHeader>
    );
}

export default Header;