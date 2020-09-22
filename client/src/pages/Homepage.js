import React, { Component } from 'react';
import CardContainer from '../components/CardContainer';

class Homepage extends Component {
    render() {
        const cards = [
            {
                top: 200,
                left: 200,
                width: 350,
                height: 250,
                title: "Welcome to Flexiboard",
                body: "Double click anywhere to create a new card\n\nDouble click a card's text to edit a card\n\nClick and drag to move and resize cards\n\nFeel free to play around here and when you're ready, Log In and select \"Log In & Create Board\" and save this as your first board\n\nEnjoy!",
                editing: false,
                initial: null
            },
        ]
        return (
            <CardContainer showLogin={this.props.showLogin} cards={!this.props.showLogin && cards} />
        );
    }
}

export default Homepage;