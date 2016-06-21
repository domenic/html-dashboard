"use strict";
const React = require("react");
const { connect } = require("react-redux");
const actions = require("./actions.js");
const GitHubSignIn = require("./components/GitHubSignIn.jsx");

class App extends React.Component {
  componentDidMount() {
    if (this.props.gitHub.accessToken) {
      this.props.dispatch(actions.loadIssues());
    }
  }

  render() {
    const { dispatch, gitHub } = this.props;

    return <div>
      <GitHubSignIn beginSignIn={() => dispatch(actions.signInToGitHub())}
                    disabled={gitHub.signingIn}
                    signedIn={Boolean(gitHub.accessToken)} />
    </div>;
  }
}

function mapStateToProps(state) {
  return {
    gitHub: state.gitHub
  };
}

module.exports = connect(mapStateToProps)(App);
