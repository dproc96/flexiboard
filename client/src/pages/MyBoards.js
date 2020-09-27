import React, { Component } from 'react';
import axios from 'axios';
import BoardButton from '../components/BoardButton';
import styled from 'styled-components';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    text-align: center;

    h2 {
        font-size: 24px;
    }
`

class MyBoards extends Component {
    constructor(props) {
        super(props)
        this.state = {
            boards: []
        }
    }
    componentDidMount() {
        const options = {
            headers: {
                Authorization: `Bearer ${this.props.userContext.token}`
            }
        }
        axios.get(window.location.origin + "/api/v1/users/me", options).then(response => {
            console.log(response)
            this.setState({
                boards: response.data.boards
            })
        })
    }
    render() {
        return (
            <StyledDiv>
                <h2>{`${this.props.userContext.user.name}'s Boards`}</h2>
                {this.state.boards.map(board => (
                    <BoardButton style={{margin: "10px"}} key={board._id} path={board._id} >{board.title}</BoardButton>
                ))}
            </StyledDiv>
        );
    }
}

export default MyBoards;