import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
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
  }
`

function App() {
  return (
    <div>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <MouseTracker>
          <Header />
          <CardContainer />
        </MouseTracker>
      </ThemeProvider>

    </div>
  );
}

export default App;
