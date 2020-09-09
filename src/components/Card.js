import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from "@fortawesome/free-solid-svg-icons"

const StyledCard = styled.div`
    background-color: ${props => props.theme.white};
    padding: 15px;
    border-radius: 5px;
    width: ${props => props.width + "px"};
    height: ${props => props.height + "px"};
    position: absolute;
    top: ${props => props.top + "px"};
    left: ${props => props.left + "px"};
    overflow: hidden;
    box-shadow: 1px 1px 2px 2px rgba(0,0,0,0.1);

    h3 {
        font-weight: 700;
        font-size: 24px;
        margin-bottom: 15px;
        width: fit-content;
        max-width: 90%;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        max-height: 1.7em;
        line-height: 1.7em;
    }

    p {
        overflow: scroll;
        max-height: 70%;
        width: fit-content;
        max-width: 90%;
    }

    h3:hover, p:hover {
        cursor: text;
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

    :hover {
        cursor: ${props => props.hover};
    }
`

function Card(props) {
    return (
        <StyledCard {...props}>
            <div>
                <FontAwesomeIcon onClick={props.deleteHandler} className="close" icon={faTimes} />
                <h3 title={props.title}>{props.title}</h3>
                <p>{props.body}</p>
            </div>
        </StyledCard>
    );
}

export default Card;
