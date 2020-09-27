import React, { useState } from 'react';
import StyledButton from '../styles/StyledButton';
import { Redirect } from 'react-router-dom';


function BoardButton(props) {
    const [redirect, setRedirect] = useState(false)
    const handleClick = () => {
        setRedirect(true)
    }
    return (
        <StyledButton onClick={handleClick}>
            {props.children}
            {redirect && <Redirect to={`/board/${props.path}`} />}
        </StyledButton>
    );
}

export default BoardButton;