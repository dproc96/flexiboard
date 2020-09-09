import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons"

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
        hyphens: auto;
        max-height: 70%;
        width: fit-content;
        max-width: 90%;
        white-space: pre-wrap;
    }

    h3:hover, p:hover {
        cursor: text;
    }

    .button {
        font-size: 24px;
        color: ${props => props.theme.grey}
    }

    .button:hover {
        cursor: pointer;
        color: ${props => props.theme.black};
    }

    :hover {
        cursor: ${props => props.hover};
    }

    input, textarea {
        border: none;
        border-radius: 10px;
        padding: 5px;
    }

    .input--title {
        font-weight: 700;
        font-size: 24px;
        margin-bottom: 15px;
    }

    .input--body {
        width: 90%;
        height: ${props => (props.height - 100)+"px"};
        margin-bottom: 10px;
        overflow: scroll;
        resize: none;
    }
`

function Card(props) {
    return (
        <StyledCard {...props}>
            <div>
                <FontAwesomeIcon style={{ float: "right" }} onClick={props.deleteHandler} className="button" icon={faTimes} />
                
                {props.editing ? <input className="input--title" name="title" value={props.title} onChange={props.cardHandleChange}></input> : <h3 title={props.title}>{props.title}</h3>}
                {props.editing ? <textarea className="input--body" name="body" value={props.body} onChange={props.cardHandleChange}></textarea> : <p>{props.body}</p>}
                {props.editing && <FontAwesomeIcon onClick={props.confirmHandler} className="button" icon={faCheckCircle} />}
                {props.editing && <FontAwesomeIcon onClick={props.discardHandler} className="button" icon={faTimesCircle} />}
            </div>
        </StyledCard>
    );
}

export default Card;
