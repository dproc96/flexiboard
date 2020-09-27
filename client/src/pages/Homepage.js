import React, { useState } from 'react';
import CardContainer from '../components/CardContainer';
import { UserContext } from '../components/User';

function Homepage(props) {
    const [cards, setCards] = useState([
        {
            top: 200,
            left: 200,
            width: 350,
            height: 250,
            title: "Welcome to Flexiboard",
            body: "Double click anywhere to create a new card\n\nDouble click a card's text to edit a card\n\nClick and drag to move and resize cards\n\nFeel free to play around here and when you're ready, click Log In and create your account to save this as your first board\n\nEnjoy!",
            editing: false,
            initial: null
        },
    ])
    return (
        <UserContext.Consumer>
            {value => (
                <CardContainer showLogin={value.showLogin} setCards={setCards} cards={cards} />
            )}
        </UserContext.Consumer>
    );
}

export default Homepage;