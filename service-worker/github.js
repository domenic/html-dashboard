"use strict";

module.exports = function gitHubRequest(pathOrURL, token) {
  if (!pathOrURL.startsWith("https:")) {
    pathOrURL = "https://api.github.com/" + pathOrURL;
  }

  return fetch(pathOrURL, {
    headers: {
      Authorization: "token " + token,
      // https://developer.github.com/changes/2016-5-27-multiple-assignees/
      Accept: "application/vnd.github.cerberus-preview"
    }
  });
};
