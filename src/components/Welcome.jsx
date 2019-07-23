/*global chrome*/
import React, { Component } from "react";
import { Button, Input } from "reactstrap";
import { FirebaseContext } from "./firebase";
import { DH_CHECK_P_NOT_PRIME } from "constants";

class Welcome extends Component {
  state = { purpose: "" };

  handleSignOut = firebase => {
    firebase.doSignOut().then(signout => {
      console.log("signout");
      firebase.auth.onAuthStateChanged(authUser => {
        this.props.changeAuth("null");
        this.props.changePage("LogIn");
      });
    });
  };

  handlePurpose = e => {
    console.log(e.target.value);
    this.setState({
      purpose: e.target.value
    });
  };

  handlePurposeSubmission = firebase => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          purpose: this.state.purpose,
          todo: "receivePurpose"
        });
      }
    );

    firebase.user(this.props.authUser.uid).set(
      {
        purpose: this.state.purpose
      },
      {
        merge: true
      }
    );
  };

  componentDidMount() {
    this.props.blockedCategoriesUser(this.props.authUser);
  }

  render() {
    console.log("local storage: ", this.props.authUser);
    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div>
            <p className="toptext">
              Meow! Click the button below and block to your heart's content!
            </p>
            <br />
            <Button
              className="block"
              color="primary"
              onClick={() => this.props.changePage("BlockedCategories")}
            >
              Block Categories
            </Button>
            <Button
              className="Friends"
              color="primary"
              onClick={() => this.props.changePage("Friends")}
            >
              Friends
            </Button>
            <br />
            What is the one thing you want to focus on today?
            <Input
              placeholder="Purpose"
              value={this.state.purpose}
              onChange={e => this.handlePurpose(e)}
            />
            <br />
            <Button onClick={() => this.handlePurposeSubmission(firebase)}>
              Start a more meaningful life
            </Button>
            <br />
            <Button
              className="signout"
              onClick={() => this.handleSignOut(firebase)}
            >
              Sign Out
            </Button>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}

export default Welcome;
