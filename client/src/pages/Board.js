import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import CardContainer from '../components/CardContainer';

const ENDPOINT = window.location.origin + "/";

class Board extends Component {
    fetchBoardAndShowToUser = () => {
        this.getBoardId();
        this.fetchBoard();
    }

    getBoardId = () => {
        this.boardId = this.props.path.replace('/board/', '');
    }

    fetchBoard = () => {
        const options = {
            headers: {
                Authorization: `Bearer ${this.props.token}`
            }
        };
        axios.get(`/api/v1/boards/${this.boardId}`, options).then(this.handleBoardResponse);
    }

    handleBoardResponse = response => {
        this.setBoard(response.data);
        this.notifySocketOfConnection();
    }

    setCards = cards => {
        const data = {
            title: this.props.userContext.board.title,
            cards: cards
        };
        this.notifySocketOfUpdate(data);
        this.setBoard(data)
    }

    setBoard = board => {
        this.props.userContext.setBoard(board)
    }

    notifySocketOfConnection = () => {
        this.socket = socketIOClient(ENDPOINT);
        this.socket.emit("new connection", this.boardId);
        this.socket.on("update", data => {
            this.setBoard(data);
        });
    }

    notifySocketOfUpdate = data => {
        if (this.socket) {
            this.socket.emit("update", this.boardId, data);
        }
    }

    componentDidMount() {
        this.fetchBoardAndShowToUser()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.path !== this.props.path) {
            this.fetchBoardAndShowToUser()
        }
    }

    render() {
        return (
            <CardContainer setCards={this.setCards} cards={this.props.userContext.board.cards} />
        );
    }
}

export default Board;