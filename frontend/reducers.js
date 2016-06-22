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
      username: null,
      accessToken: cookies.get(config.gitHub.cookie)
    };
  }

  switch (action.type) {
    case "begin GitHub sign in": {
      return Object.assign({}, state, {
        signingIn: true,
        username: null,
        accessToken: null
      });
    }

    case "receive GitHub access token": {
      return Object.assign({}, state, {
        signingIn: false,
        username: null,
        accessToken: action.accessToken
      });
    }

    case "issues loaded": {
      return Object.assign({}, state, {
        username: action.data.username
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
      return action.data.issues;
    }

    default: {
      return state;
    }
  }
}
