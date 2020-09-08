import React, { Component } from 'react';
import Card from './Card';

class CardContainer extends Component {
    render() {
        return (
            <div>
                <Card top="200px" left="200px" width="320px" height="180px" title="Title" body="Parum clairs lucem dare" />
            </div>
        );
    }
}

export default CardContainer;