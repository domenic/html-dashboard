"use strict";
const React = require("react");
const { connect } = require("react-redux");
const actions = require("./actions.js");
const GitHubSignIn = require("./components/GitHubSignIn.jsx");
const IssueList = require("./components/IssueList.jsx");

class App extends React.Component {
  componentDidMount() {
    if (this.props.gitHub.accessToken) {
      this.props.dispatch(actions.loadIssues());
    }
  }

  render() {
    const { dispatch, gitHub, issues } = this.props;

    return <div>
      <GitHubSignIn beginSignIn={() => dispatch(actions.signInToGitHub())}
                    disabled={gitHub.signingIn}
                    signedIn={Boolean(gitHub.accessToken)} />
      <IssueList issues={issues}
                 description="Unassigned bugs"
                 filter='is:issue is:open -label:addition/proposal -label:"needs implementor interest" no:assignee' />
    </div>;
  }
}

function mapStateToProps(state) {
  return {
    gitHub: state.gitHub,
    issues: state.issues
  };
}

module.exports = connect(mapStateToProps)(App);
