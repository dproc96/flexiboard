import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import MouseTracker from './components/MouseTracker';
import RouteController from './components/RouteController';

const theme = {
  primary: "#62d1c2",
  primaryDark: "#36b7a6",
  primaryDarker: "#2b9284",
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

function App() {
  return (
    <div>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <MouseTracker>
          <Router>
            <RouteController />
          </Router>
        </MouseTracker>
      </ThemeProvider>

    </div>
  );
}

export default App;
