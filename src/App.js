import React, {useEffect} from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import Header from './components/Header';
import MouseTracker from './components/MouseTracker';
import CardContainer from './components/CardContainer';

const theme = {
  primary: "#62d1c2",
  white: "#F2F2F2",
  grey: "#DDDDDD",
  black: "#222222"
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${theme.grey};
    color: ${theme.black};
    -webkit-touch-callout: none;
    -webkit-user-select: none; 
    -khtml-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none; 
    font-family: 'Lato', sans-serif;
  }

  h1, h2, h3, input {
    font-family: 'Roboto', sans-serif;
  }

  textarea {
    font-family: 'Lato', sans-serif;
  }
`

const ENDPOINT = "192.168.0.19:3001";

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function App() {
  const newBoardId = makeid(20)
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit("new board", newBoardId)
  }, []);
  return (
    <div>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <MouseTracker>
          <Router>
            <Switch>
              <Route exact path="/">
                <Redirect to={`/${newBoardId}`} />
              </Route>
              <Route path={`/${newBoardId}`}>
                <Header />
                <CardContainer />
              </Route>
            </Switch>
          </Router>
        </MouseTracker>
      </ThemeProvider>

    </div>
  );
}

export default App;
