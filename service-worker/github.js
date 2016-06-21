"use strict";

module.exports = function gitHubRequest(path, token) {
  return fetch("https://api.github.com/" + path, {
    headers: {
      Authorization: "token " + token
    }
  })
  .then(r => r.json());
};
