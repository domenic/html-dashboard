"use strict";
const swToolbox = require("sw-toolbox");
const gitHub = require("./github.js");

const CACHE_NAME = "v1";

swToolbox.router.get("/issues.json", request => {
  const search = (new URL(request.url)).search.substring("?".length);
  const accessToken = (new URLSearchParams(search)).get("token");

  return caches.match(request)
    .then(res => res || fetchAndCacheIssues(request, accessToken));
});

function fetchAndCacheIssues(request, accessToken) {
  return fetchIssues(accessToken).then(response =>
    caches.open(CACHE_NAME).then(cache => {
      cache.put(request, response.clone());
      return response;
    })
  );
}

function fetchIssues(accessToken) {
  return gitHub("repos/whatwg/html/issues", accessToken);
}
