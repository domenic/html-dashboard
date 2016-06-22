"use strict";
const React = require("react");
const Colr = require("colr");
const relativeDate = require("relative-date");

module.exports = ({ issue, getLabelURL, getAssigneeURL }) => (
  <li className="issue">
    <a className="title" href={issue.html_url}>{issue.title}</a>

    <ul className="labels">
      {
        issue.labels.map(label => (
          <li key={label.name} style={{backgroundColor: "#" + label.color }}>
            <a href={getLabelURL(label.name)}
               style={{color: foregroundColor(label.color)}}
               title={`See the subset of issues in this search with the label ${label.name}`}>{label.name}</a>
          </li>
        ))
      }
    </ul>

    <p className="extra-info">#{issue.number} opened <time
      datetime={issue.created_at} title={issue.created_at}>{relativeDate(new Date(issue.created_at))}</time> by <a
      className="creator" href={issue.user.html_url}>{issue.user.login}</a>
    </p>

    <ul className="assignees">
      {
        issue.assignees.map(assignee => (
          <li key={assignee.login}>
            <a href={getAssigneeURL(assignee.login)} title={`View everything assigned to ${assignee.login}`}>
              <img alt={`@${assignee.login}`} height="20" width="20" src={`${assignee.avatar_url}&s=40`}/>
            </a>
          </li>
        ))
      }
    </ul>
  </li>
);

function foregroundColor(backgroundColor) {
  const color = Colr.fromHex("#" + backgroundColor);
  const hsl = color.toHslObject();

  return hsl.l > 70 ? "#333" : "#fff";
}
