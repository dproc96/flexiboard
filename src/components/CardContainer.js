import React, { Component } from 'react';
import Card from './Card';
import { MouseContext } from './MouseTracker';
import styled from 'styled-components';

const StyledContainer = styled.div`
    width: 100vw;
    height: Calc(100vh - 75px);
`

const determineHover = (props, context) => {
    const x = context.x;
    const y = context.y;
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

class CardContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: null,
            hovered: null,
            cards: [
                {
                    top: 200,
                    left: 200,
                    width: 320,
                    height: 180,
                    title: "Motto",
                    body: "Parum claris lucem dare",
                },
                {
                    top: 200,
                    left: 200,
                    width: 320,
                    height: 180,
                    title: "Motto 2",
                    body: "Parum claris lucem dare",
                }
            ]
        }
    }

    cardHandleDown = (e, index) => {
        let cards = [...this.state.cards]
        const card = {...cards[index]}
        const temp = cards.splice(index, 1)
        cards = cards.concat(temp)
        this.setState({ 
            cards: cards,
            active: {
                index: cards.length - 1,
                initial: {...card},
                x: e.pageX,
                y: e.pageY,
                action: determineHover(card, {x: e.pageX, y: e.pageY})
        }})
    }
    cardHandleUp = e => {
        this.setState({ active: null })
    }
    cardHandleMove = e => {
        if (this.state.active && this.state.active.action === "move") {
            const card = {...this.state.active.initial};
            card.top += (e.pageY - this.state.active.y)
            card.left += (e.pageX - this.state.active.x)
            const cards = [...this.state.cards];
            cards[this.state.active.index] = card;
            this.setState({cards: cards})
        }
    }
    render() {
        return (
            <MouseContext.Consumer>
                {value => (
                    <StyledContainer onMouseLeave={this.cardHandleUp} onMouseMove={this.cardHandleMove}>
                        {this.state.cards.map((card, index) => (
                            <Card hover={determineHover(card, value)} onMouseDown={e => { this.cardHandleDown(e, index) }} onMouseUp={this.cardHandleUp} {...card} key={"card-" + index} />
                        ))}
                    </StyledContainer>
                )}
            </MouseContext.Consumer>
        );
    }
}
CardContainer.contextType = MouseContext

export default CardContainer;