"use strict";
const React = require("react");
const Colr = require("colr");
const relativeDate = require("relative-date");

module.exports = ({ issue, getLabelURL }) => (
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
  </li>
);

function foregroundColor(backgroundColor) {
  const color = Colr.fromHex("#" + backgroundColor);
  const hsl = color.toHslObject();

  return hsl.l > 70 ? "#333" : "#fff";
}
