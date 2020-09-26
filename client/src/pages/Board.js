import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import CardContainer from '../components/CardContainer';

const ENDPOINT = window.location.origin + "/";

class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: [],
            title: ""
        }
    }
    componentDidMount() {
        this.boardId = this.props.path.replace('/board/', '')
        const options = {
            headers: {
                Authorization: `Bearer ${this.props.token}`
            }
        }
        axios.get(`/api/v1/boards/${this.boardId}`, options).then(response => {
            console.log(response.data)
            this.setState({
                title: response.data.title,
                cards: response.data.cards
            })
            this.socket = socketIOClient(ENDPOINT)
            this.socket.emit("new connection", this.boardId)
            this.socket.on("update", data => {
                this.setState({
                    title: data.title,
                    cards: data.cards
                })
            })
        })
    }
    setCards = cards => {
        if (this.socket) {
            const data = {
                title: this.state.title,
                cards: cards
            }
            console.log(data)
            this.socket.emit("update", this.boardId, data)
            this.setState({cards: cards})
        }
    }
    render() {
        return (
            <CardContainer setCards={this.setCards} cards={this.state.cards} />
        );
    }
}

export default Board;