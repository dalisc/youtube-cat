/*global chrome*/
import React, { Component } from "react";
import { Button, Input } from "reactstrap";
import { FirebaseContext } from "./firebase";
import Spinner from "react-bootstrap/Spinner";
import catIcon from "../icons/icon256.png";
import "../css/styles5.css";

class Welcome extends Component {
  state = { purpose: "", username: "", isLoading: true, savedPurpose: null };

  handleSignOut = firebase => {
    firebase.doSignOut().then(signout => {
      console.log("signout");
      firebase.auth.onAuthStateChanged(authUser => {
        this.props.changePage("LogIn");
        this.props.changeAuth("null");
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

    this.setState({
      savedPurpose: this.state.purpose,
      purpose: ""
    });
  };

  fetchUserDetails = firebase => {
    if (this.state.username === "" && this.props.authUser !== null) {
      firebase.user(this.props.authUser.uid).onSnapshot(snapshot => {
        this.setState({
          username: snapshot.data().username,
          isLoading: false,
          savedPurpose: snapshot.data().purpose
        });
        this.props.setUsername(snapshot.data().username);
      });
    }
  };

  componentDidMount() {
    console.log("authuser: ", this.props.authUser);
    this.props.blockedCategoriesUser(this.props.authUser);
  }

  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => {
          this.fetchUserDetails(firebase);
          return this.state.isLoading ? (
            <div className="spinner-wrapper">
              <Spinner
                size="xl"
                animation="border"
                variant="danger"
                role="status"
                style={{ width: "4rem", height: "4rem" }}
              />
            </div>
          ) : this.props.authUser === null ||
            !this.props.authUser.emailVerified ? (
            <div>
              <p>Please check your email and verify it meow!</p>
              <Button
                className="signout"
                onClick={() => this.handleSignOut(firebase)}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div>
              <p className="toptext">
                <div className="logoContainer">
                  <img src={catIcon} className="logoIcon" />
                  <h1 className="logoText">
                    Meow,{" "}
                    <span className="logoText__cat">
                      {this.state.username}!
                    </span>
                  </h1>
                </div>
                <span className="block_vids_for">Block vids for?</span>
              </p>
              <br />
              <Button
                className="myself_btn"
                color="primary"
                onClick={() => this.props.changePage("BlockedCategories")}
                type="myself"
              >
                <span className="btnText">ME</span>
              </Button>
              <Button
                className="friends_btn"
                color="primary"
                onClick={() => this.props.changePage("Friends")}
                type="friends"
              >
                <span className="btnText">FRIENDS</span>
              </Button>
              <br />
              <div className="purpose">
                <span className="purposeQuestion">
                  What is your purpose today?
                </span>
                <Input
                  type="purpose"
                  placeholder={
                    this.state.savedPurpose === undefined ||
                    this.state.savedPurpose === null ||
                    this.state.savedPurpose === ""
                      ? "Purpose"
                      : this.state.savedPurpose
                  }
                  onChange={e => this.handlePurpose(e)}
                />
              </div>

              <br />
              <div className="button-wrapper">
              <Button
                className="submitPurpose"
                onClick={() => this.handlePurposeSubmission(firebase)}
              >
                <span className="btnText"> Submit </span>
              </Button>
              <br />
              <Button
                className="friends_btn"
                onClick={() => this.handleSignOut(firebase)}
              >
                <span className="btnText"> SIGN OUT </span>
              </Button>
              </div>
            </div>
          );
        }}
      </FirebaseContext.Consumer>
    );
  }
}

export default Welcome;
