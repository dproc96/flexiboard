import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from "@fortawesome/free-solid-svg-icons"

function Card(props) {
    const StyledCard = styled.div`
        background-color: ${props => props.theme.white};
        padding: 15px;
        border-radius: 5px;
        width: ${props.width};
        height: ${props.height};
        position: absolute;
        top: ${props.top};
        left: ${props.left};

        h3 {
            font-weight: 700;
            font-size: 24px;
            padding-bottom: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid ${props => props.theme.grey}
        }

        .close {
            float: right;
            font-size: 24px;
            color: ${props => props.theme.grey}
        }

        .close:hover {
            cursor: pointer;
            color: ${props => props.theme.black};
        }
    `
    return (
        <StyledCard>
            <FontAwesomeIcon className="close" icon={faTimes} />
            <h3>{props.title}</h3>
            <p>{props.body}</p>
        </StyledCard>
    );
}

export default Card;