import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

const ENDPOINT = "/";

class Board extends Component {
    componentDidMount() {
        axios.get(`/boards/${this.props.boardId}`).then(response => {
            console.log(response.data)
            this.socket = socketIOClient(ENDPOINT)
            this.socket.emit(this.props.boardId)
        })
    }
    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default Board;