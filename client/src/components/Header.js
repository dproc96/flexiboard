import React, { Fragment } from 'react';
import styled from 'styled-components';
import StyledButton from '../styles/StyledButton';
import { UserContext } from './User';

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
    const buttonClick = (user) => () => {
        if (user) {
            props.setUser(null)
            localStorage.removeItem("flexiboard_user")
        }
        else {
            props.setShowLogin(true)
        }
    }
    return (
        <StyledHeader>
            <img width="150px" src="/assets/images/flexiboard-header-logo.png" alt="flexiboard" />
            {props.path === "/" && 
                <UserContext.Consumer>
                    {value => (
                        <Fragment>
                            {value && <p style={{color: "white"}}>Hello {value.name}</p>}
                            <StyledButton onClick={buttonClick(value)}>Log {value ? "Out" : "In"}</StyledButton>
                        </Fragment>
                    )}
                </UserContext.Consumer>
            }
        </StyledHeader>
    );
}

export default Header;