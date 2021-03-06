"use strict";
const React = require("react");
const { connect } = require("react-redux");
const actions = require("./actions.js");
const GitHubSignIn = require("./components/GitHubSignIn.jsx");
const IssueList = require("./components/IssueList.jsx");
const config = require("../config.json");

class App extends React.Component {
  componentDidMount() {
    if (this.props.gitHub.accessToken) {
      this.props.dispatch(actions.loadIssues());
    }
  }

  render() {
    const { dispatch, gitHub, issues } = this.props;
    const signedIn = Boolean(gitHub.accessToken);

    return <div id="app">
      <h1>{config.repo} issue tracker</h1>
      <GitHubSignIn beginSignIn={() => dispatch(actions.signInToGitHub())}
                    disabled={gitHub.signingIn}
                    signedIn={signedIn} />
      {
        signedIn ?
            <div>
              <IssueList issues={issues}
                         description="Unassigned bugs"
                         filter='is:issue is:open -label:addition/proposal -label:"needs implementor interest" no:assignee' />
              <IssueList issues={issues}
                         description="Assigned to me"
                         filter={`is:open assignee:${gitHub.username}`} />
              <IssueList issues={issues}
                         description="Additions/proposals"
                         filter={`is:issue is:open label:addition/proposal`} />
              <IssueList issues={issues}
                         description="No responses, filed by a non-editor" // NOTE: GitHub search semantics are broken here
                         filter={`is:issue is:open comments:0 -author:annevk -author:domenic -author:foolip -author:zcorpan`} />
            </div>
          :
          <p className="sign-in-reminder">Sign in (click the button in the upper right) to see the dashboard.</p>
      }
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
