"use strict";
const React = require("react");
const Issue = require("./Issue.jsx");
const filterIssues = require("../issues.js").filter;
const config = require("../../config.json");

module.exports = ({ issues, filter, description }) => {
  const filteredIssues = filterIssues(issues, filter);

  function getLabelURL(labelName) {
    return `https://github.com/${config.repo}/issues?q=${encodeURIComponent(filter + " label:\"" + labelName + "\"")}`;
  }

  return (
    <article className="issue-list" hidden={issues.length === 0}>
      <h1>{description} <span className="count">({filteredIssues.length})</span></h1>
      <a className="filter" href={`https://github.com/${config.repo}/issues?q=${encodeURIComponent(filter)}`}>{filter}</a>

      <ol className="issue-container">
      {
        filteredIssues.map(issue => <Issue key={issue.id} issue={issue} getLabelURL={getLabelURL} />)
      }
      </ol>
    </article>
  );
};
