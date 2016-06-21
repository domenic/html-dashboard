"use strict";

module.exports = function gitHubRequest(pathOrURL, token) {
  if (!pathOrURL.startsWith("https:")) {
    pathOrURL = "https://api.github.com/" + pathOrURL;
  }

  return fetch(pathOrURL, {
    headers: {
      Authorization: "token " + token
    }
  });
};
