import React from 'react';
import styled from 'styled-components';
import StyledButton from '../styles/StyledButton';

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
                <StyledButton onClick={buttonClick}>Log In</StyledButton>
            </div>}
        </StyledHeader>
    );
}

export default Header;