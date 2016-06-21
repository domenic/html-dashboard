"use strict";
const React = require("react");

module.exports = props => (
  <section className="git-hub-sign-in">
    {
      props.signedIn ?
        <p>Signed in to GitHub</p>
      :
        <button onClick={props.beginSignIn} disabled={props.disabled}>Sign in with GitHub</button>
    }
  </section>
);
