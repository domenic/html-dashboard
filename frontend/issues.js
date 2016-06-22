"use strict";

// Implements a subset of filters from https://help.github.com/articles/searching-issues/
// This may not be a good idea...

const filters = {
  is: issueMatchesIs,
  label: issueMatchesLabel,
  no: issueMatchesNo,
  assignee: issueMatchesAssignee
};

exports.filter = (issues, filterString) => {
  const filtered = [];
  const parsedFilter = parseFilter(filterString);

  issueLoop: for (const issue of issues) {
    for (const key of Object.keys(parsedFilter)) {
      if (!filters[key](issue, parsedFilter[key])) {
        continue issueLoop;
      }
    }

    filtered.push(issue);
  }

  return filtered;
};

function issueMatchesIs(issue, isFilter) {
  return issueMatchesIsType(issue, isFilter) && issueMatchesIsState(issue, isFilter);
}

function issueMatchesIsType(issue, isFilter) {
  const isPR = Boolean(issue.pull_request);

  const negative = isFilter.negative.filter(value => value === "pr" || value === "issue");
  const positive = isFilter.positive.filter(value => value === "pr" || value === "issue");

  if (isPR && negative.includes("pr")) {
    return false;
  }
  if (!isPR && negative.includes("issue")) {
    return false;
  }

  if (isPR && positive.includes("pr")) {
    return true;
  }
  if (!isPR && positive.includes("issue")) {
    return true;
  }

  return negative.length === 0 && positive.length === 0;
}

function issueMatchesIsState(issue, isFilter) {
  const state = issue.state;

  if (isFilter.negative.includes(state)) {
    return false;
  }

  if (isFilter.positive.includes(state)) {
    return true;
  }

  return isFilter.positive.length === 0;
}

function issueMatchesLabel(issue, labelFilter) {
  const labels = issue.labels.map(obj => obj.name);
  return multipleMatcherHelper(labels, labelFilter, { requirePositiveMatches: false });
}

function issueMatchesNo(issue, noFilter) {
  if (noFilter.negative.length > 0) {
    throw new Error("Unexpected negative no filter");
  }

  for (const no of noFilter.positive) {
    if (issue[no] !== null) {
      return false;
    }
  }

  return true;
}

function issueMatchesAssignee(issue, assigneeFilter) {
  const assignees = issue.assignees.map(obj => obj.login);
  console.log("assignees", assignees);
  return multipleMatcherHelper(assignees, assigneeFilter, { requirePositiveMatches: true });
}

function multipleMatcherHelper(candidates, filter, { requirePositiveMatches }) {
  if (filter.negative.length > 0 && candidates.length > 0 && arraysIntersect(filter.negative, candidates)) {
    return false;
  }
  if ((!requirePositiveMatches || candidates.length > 0) && arraysIntersect(filter.positive, candidates)) {
    return true;
  }

  return false;
}

function parseFilter(filterString) {
  const pieceRegexp = /(-?)([a-z]+):([^ "]+|"[^"]+")/g;

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
