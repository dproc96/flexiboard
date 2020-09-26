import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import CardContainer from '../components/CardContainer';

const ENDPOINT = "/";

class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: [],
            title: ""
        }
    }
    componentDidMount() {
        const boardId = this.props.path.replace('/board/', '')
        const options = {
            headers: {
                Authorization: `Bearer ${this.props.token}`
            }
        }
        axios.get(`/api/v1/boards/${boardId}`, options).then(response => {
            console.log(response.data)
            this.setState({
                cards: response.data.cards
            })
            this.socket = socketIOClient(ENDPOINT)
            this.socket.emit(this.props.boardId)
        })
    }
    render() {
        return (
            <CardContainer cards={this.state.cards} />
        );
    }
}

export default Board;