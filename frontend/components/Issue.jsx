"use strict";
const React = require("react");

module.exports = props => (
  <p><a href={props.issue.url}>{props.issue.title}</a></p>
);
