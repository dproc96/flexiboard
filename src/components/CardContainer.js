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
            return ["nwse-resize", true, false, false, true]
        }
        if (rightEdge) {
            return ["nesw-resize", true, true, false, false]
        }
        return ["ns-resize", true, false, false, false]
    }
    if (bottomEdge) {
        if (rightEdge) {
            return ["nwse-resize", false, true, true, false]
        }
        if (leftEdge) {
            return ["nesw-resize", false, false, true, true]
        }
        return ["ns-resize", false, false, true, false]
    }
    if (leftEdge || rightEdge) {
        return ["ew-resize", false, rightEdge, false, leftEdge]
    }
    return ["move"]
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
    handleDoubleClick = e => {
        if (e.target.tagName === "H3" || e.target.tagName === "P") {
            
        }
        else {
            const card = {
                top: e.pageY - 105,
                left: e.pageX - 175,
                width: 320,
                height: 180,
                title: "Untitled Note",
                body: "Enter text body here...",
            }
            const cards = [...this.state.cards]
            cards.push(card)
            this.setState({cards: cards})
        }
    }
    handleDeleteCard = (e, index) => {
        const cards = [...this.state.cards]
        cards.splice(index, 1)
        this.setState({ cards: cards })
    }
    cardHandleUp = e => {
        this.setState({ active: null })
    }
    cardHandleMove = e => {
        if (this.state.active && this.state.active.action[0] === "move") {
            const card = {...this.state.active.initial};
            card.top += (e.pageY - this.state.active.y)
            card.left += (e.pageX - this.state.active.x)
            const cards = [...this.state.cards];
            cards[this.state.active.index] = card;
            this.setState({cards: cards})
        }
        else if (this.state.active && this.state.active.action[0].match(/resize/g)) {
            const card = {...this.state.active.initial}
            const action = this.state.active.action
            const deltaWidth = (e.pageX - this.state.active.x)
            const deltaHeight = (e.pageY - this.state.active.y)
            if (action[1]) {
                card.height -= deltaHeight
                card.top += (deltaHeight)
            }
            if (action[2]) {
                card.width += deltaWidth
            }
            if (action[3]) {
                card.height += deltaHeight
            }
            if (action[4]) {
                card.width -= deltaWidth
                card.left += (deltaWidth)
            }
            const cards = [...this.state.cards];
            cards[this.state.active.index] = card;
            this.setState({ cards: cards })
        }
    }
    render() {
        return (
            <MouseContext.Consumer>
                {value => (
                    <StyledContainer onDoubleClick={this.handleDoubleClick} onMouseLeave={this.cardHandleUp} onMouseMove={this.cardHandleMove} onMouseUp={this.cardHandleUp}>
                        {this.state.cards.map((card, index) => (
                            <Card deleteHandler={e => {this.handleDeleteCard(e, index)}} hover={determineHover(card, value)[0]} onMouseDown={e => { this.cardHandleDown(e, index) }} onMouseUp={this.cardHandleUp} {...card} key={"card-" + index} />
                        ))}
                    </StyledContainer>
                )}
            </MouseContext.Consumer>
        );
    }
}
CardContainer.contextType = MouseContext

export default CardContainer;