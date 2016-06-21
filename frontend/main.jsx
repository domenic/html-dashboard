"use strict";
const React = require("react");
const reactRedux = require("react-redux");
const { Provider } = require("react-redux");
const reactDOM = require("react-dom");
const redux = require("redux");
const reduxThunk = require("redux-thunk").default;

const reducers = require("./reducers.js");
const App = require("./App.jsx");

navigator.serviceWorker.register("service-worker-bundle.js");

const store = redux.createStore(reducers, undefined, redux.applyMiddleware(reduxThunk));

reactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("main")
);
