import React, { Component } from 'react';
import Card from './Card';
import { MouseContext } from './MouseTracker';
import styled from 'styled-components';
import { UserContext } from './User';

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
            editing: false
        }
    }
    handleStateChange = state => {
        if (state.hasOwnProperty("cards")) {
            this.props.setCards(state.cards)
            delete state.cards
        }
        this.setState(state)
    }
    cardHandleDown = (e, index) => {
        let cards = [...this.props.cards]
        const card = {...cards[index]}
        if (!card.editing) {
            const temp = cards.splice(index, 1)
            cards = cards.concat(temp)
            this.handleStateChange({ 
                cards: cards,
                active: {
                    index: cards.length - 1,
                    initial: {...card},
                    x: e.pageX,
                    y: e.pageY,
                    action: determineHover(card, {x: e.pageX, y: e.pageY})
            }})
        }
    }
    handleDoubleClick = e => {
        if (!this.state.editing && !this.props.showLogin) {
            if (e.target.tagName === "H3" || e.target.tagName === "P") {
                const cards = [...this.props.cards]
                cards[cards.length - 1].initial = { ...cards[cards.length - 1]}
                cards[cards.length - 1].editing = true
                this.handleStateChange({ 
                    cards: cards,
                    editing: true 
                })
            }
            else {
                const card = {
                    top: Math.max(e.pageY - 105, 100),
                    left: Math.max(e.pageX - 175, 20),
                    width: 350,
                    height: 210,
                    title: "Untitled Note",
                    body: "",
                    editing: true,
                    initial: null
                }
                const cards = [...this.props.cards]
                cards.push(card)
                this.handleStateChange({
                    cards: cards,
                    editing: true
                })
            }
        }
    }
    handleCardChange = (e, index) => {
        const { name, value } = e.target;
        const cards = [...this.props.cards]
        cards[index][name] = value;
        this.handleStateChange({ cards: cards })
    }
    handleDeleteCard = (e, index) => {
        const cards = [...this.props.cards]
        cards.splice(index, 1)
        this.handleStateChange({ 
            cards: cards,
            editing: false
        })
    }
    handleConfirmChange = (e, index) => {
        const cards = [...this.props.cards]
        cards[index].initial = {...cards[index]}
        cards[index].editing = false
        this.handleStateChange({ 
            cards: cards,
            editing: false
        })
    }
    handleDiscardChange = (e, index) => {
        const cards = [...this.props.cards]
        if (cards[index].initial) {
            cards[index] = {...cards[index].initial}
            cards[index].editing = false
        }
        else {
            cards.splice(index, 1)
        }
        this.handleStateChange({
            cards: cards,
            editing: false
        })
    }
    cardHandleUp = e => {
        this.handleStateChange({ active: null })
    }
    cardHandleMove = e => {
        if (this.state.active && this.state.active.action[0] === "move") {
            const card = {...this.state.active.initial};
            card.top += (e.pageY - this.state.active.y)
            card.left += (e.pageX - this.state.active.x)
            const cards = [...this.props.cards];
            cards[this.state.active.index] = card;
            this.handleStateChange({cards: cards})
        }
        else if (this.state.active && this.state.active.action[0].match(/resize/g)) {
            const card = {...this.state.active.initial}
            const action = this.state.active.action
            const deltaWidth = (e.pageX - this.state.active.x)
            const deltaHeight = (e.pageY - this.state.active.y)
            if (action[1]) {
                card.height -= deltaHeight
                if (card.height >= 100) {
                    card.top += (deltaHeight)
                }
            }
            if (action[2]) {
                card.width += deltaWidth
            }
            if (action[3]) {
                card.height += deltaHeight
            }
            if (action[4]) {
                card.width -= deltaWidth
                if (card.width >= 100) {
                    card.left += (deltaWidth)
                }
            }
            card.width = Math.max(card.width, 100)
            card.height = Math.max(card.height, 100)
            const cards = [...this.props.cards];
            cards[this.state.active.index] = card;
            this.handleStateChange({ cards: cards })
        }
    }
    getCardProps = (index, card, value) => {
        return {
            cardHandleChange: e => { this.handleCardChange(e, index) },
            confirmHandler: e => { this.handleConfirmChange(e, index) },
            discardHandler: e => { this.handleDiscardChange(e, index) },
            deleteHandler: e => { this.handleDeleteCard(e, index) },
            hover: determineHover(card, value)[0],
            onMouseDown: e => { this.cardHandleDown(e, index) }, 
            onMouseUp: this.cardHandleUp
        }
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.showLogin && this.props.showLogin) {
            let cards = this.props.cards
            cards = cards.concat([{
                top: 200,
                left: 200,
                width: 350,
                height: 300,
                title: "Login",
                editing: false,
                initial: null,
                isLogIn: true,
                cards: cards
            }])
            this.props.setCards(cards)
        }
    }
    // componentDidMount() {
    //     setTimeout(() => {
    //         if (this.props.socket.current) {
    //             this.props.socket.current.on("update", cards => {
    //                 this.setState({ cards: cards })
    //             })
    //             this.props.socket.current.on("new user", () => {
    //                 this.props.socket.current.emit("update", this.props.boardId, this.state.cards)
    //             })
    //         }
    //     }, 10)
    // }
    render() {
        const containerProps = {
            onDoubleClick: this.handleDoubleClick, 
            onMouseLeave: this.cardHandleUp, 
            onMouseMove: this.cardHandleMove,
            onMouseUp: this.cardHandleUp
        }
        return (
            <MouseContext.Consumer>
                {value => (
                    <StyledContainer {...containerProps}>
                        {this.props.cards.map((card, index) => (
                            card.isLogIn ?
                            <UserContext.Consumer key={index}>
                                {user => <Card userContext={user} {...this.getCardProps(index, card, value)} {...card} key={"card-" + index} />}
                            </UserContext.Consumer>
                            :
                            <Card {...this.getCardProps(index, card, value)} {...card} key={"card-" + index} />
                        ))}
                    </StyledContainer>
                )}
            </MouseContext.Consumer>
        );
    }
}
CardContainer.contextType = MouseContext

export default CardContainer;