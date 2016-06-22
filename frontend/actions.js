"use strict";
const cookies = require("cookies-js");
const config = require("../config.json");

const gitHubOauthURL =
  `https://github.com/login/oauth/authorize` +
  `?client_id=${encodeURIComponent(config.gitHub.clientId)}` +
  `&scope=${encodeURIComponent(config.gitHub.scopes)}` +
  `&redirect_uri=${encodeURIComponent(config.gitHub.redirectURL)}`;
// TODO use state?

function beginGitHubSignIn() {
  return {
    type: "begin GitHub sign in"
  };
}

function receiveGitHubAccessToken(accessToken) {
  return {
    type: "receive GitHub access token",
    accessToken
  };
}

exports.signInToGitHub = () =>
  dispatch => {
    dispatch(beginGitHubSignIn());

    window[config.gitHub.callback] = () => {
      delete window[config.gitHub.callback];

      dispatch(receiveGitHubAccessToken(cookies.get(config.gitHub.cookie)));
      dispatch(exports.loadIssues());
    };

    window.open(gitHubOauthURL, "OAuth",
                "width=1038,height=650,status=no,resizable=yes,toolbar=no,menubar=no,scrollbars=yes");
  };

function issuesLoaded(issuesData, userData) {
  return {
    type: "issues loaded",
    data: {
      issues: issuesData,
      username: userData.login
    }
  };
}

exports.loadIssues = () =>
  (dispatch, getState) => {
    const accessToken = getState().gitHub.accessToken;

    return Promise.all([
      fetch("/issues.json?token=" + accessToken).then(res => res.json()),
      fetch("/user.json?token=" + accessToken).then(res => res.json())
    ])
    .then(([issuesData, userData]) => dispatch(issuesLoaded(issuesData, userData)));
    // TODO error handling
  };
