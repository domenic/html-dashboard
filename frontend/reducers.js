"use strict";
const config = require("../config.json");
const cookies = require("cookies-js");
const combineReducers = require("redux").combineReducers;

module.exports = combineReducers({
  gitHub,
  issues
});

function gitHub(state, action) {
  if (state === undefined) {
    return {
      signingIn: false,
      accessToken: cookies.get(config.gitHub.cookie)
    };
  }

  switch (action.type) {
    case "begin GitHub sign in": {
      return Object.assign({}, state, {
        signingIn: true,
        accessToken: null
      });
    }

    case "receive GitHub access token": {
      return Object.assign({}, state, {
        signingIn: false,
        accessToken: action.accessToken
      });
    }

    default: {
      return state;
    }
  }
}

function issues(state, action) {
  if (state === undefined) {
    // Consider loading from cache?
    return [];
  }

  switch (action.type) {
    case "issues loaded": {
      return action.data;
    }

    default: {
      return state;
    }
  }
}
