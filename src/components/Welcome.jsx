/*global chrome*/
import React, { Component } from "react";
import { Button, Input } from "reactstrap";
import { FirebaseContext } from "./firebase";
import Spinner from "react-bootstrap/Spinner";

class Welcome extends Component {
  state = { purpose: "", username: "", isLoading: true, savedPurpose: null };

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
    // chrome.tabs.query(
    //   {
    //     active: true,
    //     currentWindow: true
    //   },
    //   function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {
    //       purpose: this.state.purpose,
    //       todo: "receivePurpose"
    //     });
    //   }
    // );

    firebase.user(this.props.authUser.uid).set(
      {
        purpose: this.state.purpose
      },
      {
        merge: true
      }
    );

    this.setState({
      savedPurpose: this.state.purpose,
      purpose: ""
    });
  };

  fetchUserDetails = firebase => {
    if (this.state.username === "") {
      firebase.user(this.props.authUser.uid).onSnapshot(snapshot => {
        this.setState({
          username: snapshot.data().username,
          isLoading: false,
          savedPurpose: snapshot.data().purpose
        });
        console.log("username: ", snapshot.data().username);
      });
    }
  };

  componentDidMount() {
    this.props.blockedCategoriesUser(this.props.authUser);
  }

  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => {
          this.fetchUserDetails(firebase);
          return this.state.isLoading ? (
            <Spinner animation="border" role="status" />
          ) : (
            <div>
              <p className="toptext">
                Meow {this.state.username}! Click the button below and block to
                your heart's content!
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
              <h3>Purpose</h3>
              <br />
              {this.state.savedPurpose === undefined ||
              this.state.savedPurpose === null
                ? ""
                : this.state.savedPurpose}
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
          );
        }}
      </FirebaseContext.Consumer>
    );
  }
}

export default Welcome;
