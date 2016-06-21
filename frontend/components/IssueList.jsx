"use strict";
const React = require("react");
const Issue = require("./Issue.jsx");
const filterIssues = require("../issues.js").filter;

module.exports = props => {
  const filteredIssues = filterIssues(props.issues, props.filter);

  return (
    <article className="issue-list">
      <h1>{props.description} <span className="count">({filteredIssues.length})</span></h1>
      <p className="filter">{props.filter}</p>

      <div className="issue-container">
      {
        filteredIssues.map(issue => <Issue key={issue.id} issue={issue} />)
      }
      </div>
    </article>
  );
};
