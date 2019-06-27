import React, { Component } from "react";
import { Button } from "reactstrap";
import { FirebaseContext } from "./firebase";

class Welcome extends Component {
  state = {};

  handleSignOut = firebase => {
    firebase.doSignOut().then(signout => {
      console.log("signout");
      firebase.auth.onAuthStateChanged(authUser => {
        this.props.changeAuth("null");
        this.props.changePage("LogIn");
      });
    });
  };

  render() {
    console.log("local storage: ", this.props.authUser);
    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div>
            <p className="toptext">Meow! Click the button below and block to your heart's content!</p>
            <br />
            <Button
              className="block"
              color="primary"
              onClick={() => this.props.changePage("BlockedCategories")}
            >
              Block Categories
            </Button>
            <br />
            <Button 
              className="signout"
              onClick={() => this.handleSignOut(firebase)}>
              Sign Out
            </Button>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}

export default Welcome;
