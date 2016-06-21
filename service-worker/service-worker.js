"use strict";
const swToolbox = require("sw-toolbox");
const parseLinkHeader = require("parse-link-header");
const gitHub = require("./github.js");
const config = require("../config.json");

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
  return gitHub(`repos/${config.repo}/issues`, accessToken).then(firstResponse => {
    const links = parseLinkHeader(firstResponse.headers.get("link"));
    const nextPage = Number(links.next.page);
    const lastPage = Number(links.last.page);

    const subsequentPageURLs = [];
    for (let i = nextPage; i <= lastPage; ++i) {
      const url = new URL(links.next.url);
      url.searchParams.set("page", i);
      subsequentPageURLs.push(url.href);
    }

    const subsequentJSONPromises = subsequentPageURLs.map(url => gitHub(url, accessToken).then(res => res.json()));

    const jsonPromises = [firstResponse.json(), ...subsequentJSONPromises];
    return Promise.all(jsonPromises);
  })
  .then(jsons => jsonResponse(flattenArray(jsons)));
}

function jsonResponse(obj) {
  return new Response(JSON.stringify(obj, undefined, 2), { headers: { "Content-Type": "application/json" } });
}

function flattenArray(array) {
  const result = [];
  for (const subarray of array) {
    result.push(...subarray);
  }
  return result;
}
