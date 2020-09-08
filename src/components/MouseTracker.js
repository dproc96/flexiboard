import React, { Component, createContext } from 'react';

export const MouseContext = createContext({
    x: 0,
    y: 0,
    doubleClickCount: 0,
    dragStartX: null,
    dragStartY: null
})

class MouseTracker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            x: 0,
            y: 0,
            doubleClickCount: 0,
            dragStartX: null,
            dragStartY: null
        }
    }
    handleMouseMove = e => {
        this.setState({
            x: e.pageX,
            y: e.pageY
        })
    }
    handleDoubleClick = e => {
        this.setState({
            doubleClickCount: this.state.doubleClickCount + 1
        })
    }
    handleMouseDown = e => {
        this.setState({
            dragStartX: e.pageX,
            dragStartY: e.pageY
        })
    }
    handleMouseUp = e => {
        this.setState({
            dragStartX: null,
            dragStartY: null
        })
    }
    render() {
        return (
            <div style={{ width: "100vw", height: "100vh"}} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onDoubleClick={this.handleDoubleClick} onMouseMove={this.handleMouseMove}>
                <MouseContext.Provider value={this.state}>
                        {this.props.children}
                </MouseContext.Provider>
            </div>
        );
    }
}

export default MouseTracker;