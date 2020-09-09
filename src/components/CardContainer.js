import React, { Component } from 'react';
import Card from './Card';
import { MouseContext } from './MouseTracker';
import styled from 'styled-components';

const StyledContainer = styled.div`
    width: 100vw;
    height: Calc(100vh - 75px);
`

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
                y: e.pageY
        }})
    }
    cardHandleUp = e => {
        this.setState({ active: null })
    }
    cardHandleMove = e => {
        if (this.state.active) {
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
            <StyledContainer onMouseLeave={this.cardHandleUp} onMouseMove={this.cardHandleMove}>
                {this.state.cards.map((card, index) => (
                    <Card onMouseDown={e => { this.cardHandleDown(e, index) }} onMouseUp={this.cardHandleUp} {...card} key={"card-" + index} />
                ))}
            </StyledContainer>
        );
    }
}
CardContainer.contextType = MouseContext

export default CardContainer;