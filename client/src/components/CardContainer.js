import React, { Component } from 'react';
import Card from './Card';
import { MouseContext } from './MouseTracker';
import styled from 'styled-components';
import { UserContext } from './User';

const StyledContainer = styled.div`
    width: 100vw;
    height: Calc(100vh - 75px);
`

class CardContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: null,
            editing: false
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

    // HIGHEST ORDER METHODS

    handleStateChange = state => {
        if (state.hasOwnProperty("cards")) {
            this.handleCardState(state)
            delete state.cards
        }
        this.setState(state)
    }

    cardHandleDown = (e, index) => {
        let cards = [...this.props.cards]
        const card = { ...cards[index] }
        if (!card.editing) {
            cards = this.bringCardToFront(cards, index)
            this.handleStateChange({
                cards: cards,
                active: {
                    index: cards.length - 1,
                    initial: { ...card },
                    x: e.pageX,
                    y: e.pageY,
                    action: determineActionByMouseLocation(card, { x: e.pageX, y: e.pageY })
                }
            })
        }
    }

    handleDoubleClick = e => {
        const uiCanBeDoubleClicked = !this.state.editing && !this.props.showLogin

        if (uiCanBeDoubleClicked) {
            const userIsTargettingText = e.target.tagName === "H3" || e.target.tagName === "P"

            if (userIsTargettingText) {
                this.setEditingCard()
            }
            else {
                this.addNewCard(e)
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
        this.handleEndEdit(cards)
    }

    handleConfirmChange = (e, index) => {
        const cards = [...this.props.cards]
        this.handleCloseCardEdit(cards, index, true);
        this.handleEndEdit(cards)
    }

    handleDiscardChange = (e, index) => {
        const cards = [...this.props.cards]
        const cardIsNotNew = cards[index].initial

        if (cardIsNotNew) {
            this.handleCloseCardEdit(cards, index, false)
        }
        else {
            this.handleDeleteCard(e, index)
        }
        this.handleEndEdit(cards)
    }

    cardHandleUp = e => {
        this.handleStateChange({ active: null })
    }

    cardHandleMove = e => {
        const cardIsMoving = this.state.active && this.state.active.action.hover === "move"
        const cardIsResizing = this.state.active && this.state.active.action.hover.match(/resize/g)

        if (cardIsMoving) {
            this.moveCard(e);
        }
        else if (cardIsResizing) {
            this.resizeCard(e);
        }
    }

    getCardProps = (index, card, value) => ({
        cardHandleChange: e => { this.handleCardChange(e, index) },
        confirmHandler: e => { this.handleConfirmChange(e, index) },
        discardHandler: e => { this.handleDiscardChange(e, index) },
        deleteHandler: e => { this.handleDeleteCard(e, index) },
        hover: determineActionByMouseLocation(card, value).hover,
        onMouseDown: e => { this.cardHandleDown(e, index) },
        onMouseUp: this.cardHandleUp
    })

    // LOWER ORDER METHODS

    handleCardState = state => {
        const cards = state.cards.length ? state.cards : [{
            top: 200,
            left: 200,
            width: 350,
            height: 250,
            title: "Untitled Note",
            body: "Why am I here? Because a board must always contain at least one note"
        }]
        this.props.setCards(cards)
    }

    bringCardToFront = (cards, index) => {
        const temp = cards.splice(index, 1)
        return cards.concat(temp)
    }

    setEditingCard = () => {
        const cards = [...this.props.cards]
        cards[cards.length - 1].initial = { ...cards[cards.length - 1] }
        cards[cards.length - 1].editing = true
        this.handleStateChange({
            cards: cards,
            editing: true
        })
    }

    addNewCard = e => {
        const card = this.newCard(e)
        const cards = [...this.props.cards]
        cards.push(card)
        this.handleStateChange({
            cards: cards,
            editing: true
        })
    }

    newCard = e => ({
        top: Math.max(e.pageY - 105, 100),
        left: Math.max(e.pageX - 175, 20),
        width: 350,
        height: 210,
        title: "Untitled Note",
        body: "",
        editing: true,
        initial: null
    })

    handleEndEdit = cards => {
        this.handleStateChange({
            cards: cards,
            editing: false
        })
    }

    resizeCard = e => {
        const card = { ...this.state.active.initial }
        const resizeParameters = this.getResizeParameters(e)
        this.applyResizes(card, resizeParameters);
        this.applyCardHeightAndWidthConstraints(card);
        this.substituteInEditedCard(card);
    }

    getResizeParameters = e => ({
        action: this.state.active.action,
        deltaWidth: (e.pageX - this.state.active.x),
        deltaHeight: (e.pageY - this.state.active.y)
    })

    moveCard = e => {
        const card = { ...this.state.active.initial };
        this.changeCardLocation(card, e);
        this.substituteInEditedCard(card);
    }

    changeCardLocation = (card, e) => {
        card.top += (e.pageY - this.state.active.y);
        card.left += (e.pageX - this.state.active.x);
    }

    substituteInEditedCard = card => {
        const cards = [...this.props.cards];
        cards[this.state.active.index] = card;
        this.handleStateChange({ cards: cards });
    }

    applyResizes = (card, { action, deltaHeight, deltaWidth }) => {
        if (action.top) {
            this.resizeNorth(card, deltaHeight);
        }
        if (action.right) {
            this.resizeEast(card, deltaWidth);
        }
        if (action.bottom) {
            this.resizeSouth(card, deltaHeight);
        }
        if (action.left) {
            this.resizeWest(card, deltaWidth);
        }
    }

    resizeWest = (card, deltaWidth) => {
        card.width -= deltaWidth;
        if (card.width >= 100) {
            card.left += (deltaWidth);
        }
    }

    resizeSouth = (card, deltaHeight) => {
        card.height += deltaHeight;
    }

    resizeEast = (card, deltaWidth) => {
        card.width += deltaWidth;
    }

    resizeNorth = (card, deltaHeight) => {
        card.height -= deltaHeight;
        if (card.height >= 100) {
            card.top += (deltaHeight);
        }
    }

    handleCloseCardEdit = (cards, index, isConfirmingChange) => {
        if (isConfirmingChange) {
            cards[index].initial = { ...cards[index] };
        }
        else {
            cards[index] = { ...cards[index].initial }
        }
        cards[index].editing = false;
    }

    applyCardHeightAndWidthConstraints = card => {
        card.width = Math.max(card.width, 50);
        card.height = Math.max(card.height, 50);
    }
}


const determineActionByMouseLocation = ({ top, left, width, height }, { x, y }) => {
    const buffer = 10
    const edges = {
        top: top < y && y < top + buffer,
        bottom: (top + height + 30 - buffer) < y && y < (top + height + 30),
        left: left < x && x < (left + buffer),
        right: (left + width + 30 - buffer) < x && x < (left + width + 30)
    }
    return {
        hover: determineHover(edges),
        ...edges
    }
}

const determineHover = edges => {
    if (edges.top) {
        if (edges.left) {
            return "nwse-resize"
        }
        if (edges.right) {
            return "nesw-resize"
        }
        return "ns-resize"
    }
    if (edges.bottom) {
        if (edges.right) {
            return "nwse-resize"
        }
        if (edges.left) {
            return "nesw-resize"
        }
        return "ns-resize"
    }
    if (edges.left || edges.right) {
        return "ew-resize"
    }
    return "move"
}

export default CardContainer;