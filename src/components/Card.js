import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { MouseContext } from './MouseTracker';

const determineHover = props => {
    const x = props.context.x;
    const y = props.context.y;
    const top = props.top;
    const left = props.left;
    const width = props.width;
    const height = props.height;
    const buffer = 10
    const topEdge = top < y && y < top + buffer;
    const bottomEdge = (top + height + 30 - buffer) < y && y < (top + height + 30);
    const leftEdge = left < x && x < (left + buffer);
    const rightEdge = (left + width + 30 - buffer) < x && x < (left + width + 30);
    if (topEdge) {
        if (leftEdge) {
            return "nwse-resize"
        }
        if (rightEdge) {
            return "nesw-resize"
        }
        return "ns-resize"
    }
    if (bottomEdge) {
        if (rightEdge) {
            return "nwse-resize"
        }
        if (leftEdge) {
            return "nesw-resize"
        }
        return "ns-resize"
    }
    if (leftEdge || rightEdge) {
        return "ew-resize"
    }
    return "move"
}

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
        cursor: ${props => determineHover(props)};
    }
`

function Card(props) {
    return (
        <MouseContext.Consumer>
            {value => (
                <StyledCard context={{...value}} {...props}>
                    <div>
                        <FontAwesomeIcon className="close" icon={faTimes} />
                        <h3 title={props.title}>{props.title}</h3>
                        <p>{props.body}</p>
                    </div>
                </StyledCard>
            )}
        </MouseContext.Consumer>
    );
}

export default Card;
