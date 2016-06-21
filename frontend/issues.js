"use strict";

exports.filter = (issues, filterString) => {
  const filtered = [];
  const parsedFilter = parseFilter(filterString);

  issueLoop: for (const issue of issues) {
    for (const key of Object.keys(parsedFilter)) {
      if (key === "is") {
        if (!issueMatchesIs(issue, parsedFilter[key])) {
          continue issueLoop;
        }
      }
      if (key === "label") {
        if (!issueMatchesLabel(issue, parsedFilter[key])) {
          continue issueLoop;
        }
      }
    }

    filtered.push(issue);
  }

  return filtered;
};

function issueMatchesIs(issue, isFilter) {
  const isPR = Boolean(issue.pull_request);
  const state = issue.state;

  if (isPR && isFilter.negative.includes("pr")) {
    return false;
  }
  if (!isPR && isFilter.negative.includes("issue")) {
    return false;
  }
  if (isFilter.negative.includes(state)) {
    return false;
  }

  if (isPR && isFilter.positive.includes("pr")) {
    return true;
  }
  if (!isPR && isFilter.positive.includes("issue")) {
    return true;
  }
  if (isFilter.positive.includes(state)) {
    return true;
  }

  return false;
}

function issueMatchesLabel(issue, labelFilter) {
  const issueLabels = issue.labels.map(obj => obj.name);

  if (arraysIntersect(labelFilter.negative, issueLabels)) {
    return false;
  }
  if (arraysIntersect(labelFilter.positive, issueLabels)) {
    return true;
  }

  return false;
}

function parseFilter(filterString) {
  const pieceRegexp = /(-?)([a-z]+):([^ ]+|"[^"]+")/g;

  const parsed = Object.create(null);

  let result;
  while ((result = pieceRegexp.exec(filterString))) {
    const [isNegation, type, value] = [result[1] === "-", result[2], removeOuterQuotes(result[3])];

    if (!(type in parsed)) {
      parsed[type] = {
        positive: [],
        negative: []
      };
    }

    parsed[type][isNegation ? "negative" : "positive"].push(value);
  }

  return parsed;
}

function arraysIntersect(array1, array2) {
  for (const el1 of array1) {
    for (const el2 of array2) {
      if (el1 === el2) {
        return true;
      }
    }
  }

  return array1.length === 0 || array2.length === 0;
}

function removeOuterQuotes(string) {
  if (string.startsWith("\"") && string.endsWith("\"")) {
    return string.substring(1, string.length - 1);
  }

  return string;
}
