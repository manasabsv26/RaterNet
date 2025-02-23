import React from "react";
import {ThemeProvider, createTheme , colors, CssBaseline} from "@mui/material";
import Navbar from "./components/navigation/Navbar";
import {blue, red} from "@mui/material/colors";
import {ThemeContext} from "./context/ThemeContext";
import './App.css';
import {combineReducers} from 'redux';
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';
import logger from 'redux-logger';
import AuthReducer from "./redux/reducers/auth";
import PlansReducer from "./redux/reducers/plans";

import { configureStore } from "@reduxjs/toolkit";
//import ReviewReducer from "./redux/reducers/reviews"

const rootReducer = combineReducers({
  auth: AuthReducer,
  plans: PlansReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk, logger),
});

function App() {
  const {dark} = React.useContext(ThemeContext);

  const theme = createTheme ({
    typography: {
      fontFamily: `"Poppins", sans-serif`,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500
    },
    palette: {
      mode: dark ? 'dark' : 'light',
      primary: {
        main: dark?blue[300]:blue[500],
      },
      secondary: {
        main: '#ffc107',
      },
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          body2: {
            fontSize: "15px !important", // ✅ Correct format
          },
        },
      },
    },
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
