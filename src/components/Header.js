import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.header`
    background-color: ${props => props.theme.primary};
    padding: 15px;
    height: 45px;
`

function Header(props) {
    return (
        <StyledHeader>
            <img width="150px" src="/assets/images/flexiboard-header-logo.png" alt="flexiboard" />
        </StyledHeader>
    );
}

export default Header;