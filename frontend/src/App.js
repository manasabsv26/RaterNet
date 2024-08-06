import React from "react";
import {ThemeProvider, createMuiTheme, colors, CssBaseline} from "@material-ui/core";
import Navbar from "./components/navigation/Navbar";
import {blue, red} from "@material-ui/core/colors";
import {ThemeContext} from "./context/ThemeContext";
import './App.css';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import AuthReducer from "./redux/reducers/auth";
import PlansReducer from "./redux/reducers/plans";
//import ReviewReducer from "./redux/reducers/reviews"

const store = createStore(
  combineReducers({
    auth : AuthReducer,
    plans : PlansReducer
  }),
  applyMiddleware(thunk, logger)
);



function App() {
  const {dark} = React.useContext(ThemeContext);

  const theme = createMuiTheme({
    typography: {
      fontFamily: `"Poppins", sans-serif`,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500
    },
    palette: {
      type: dark ? 'dark' : 'light',
      primary: {
        main: dark?blue[300]:blue[500],
      },
      secondary: {
        main: '#ffc107',
      },
    },
    overrides: {
      MuiTypography: {
        body2: {
          fontSize: [15, "!important"]
        }
      }
    }
  })
  //#64b5f6

  return (
    <>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
      <CssBaseline/>
      <Navbar/>
      </Provider>
    </ThemeProvider>
    </>
  );
}

export default App;
