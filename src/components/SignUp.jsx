import React, { Component } from "react";
import { Input, Button } from "reactstrap";
import { FirebaseContext } from "./firebase";
import catIcon from "../icons/icon256.png";
import "../styles23.css";

const INITIAL_STATE = {
  username: "",
  email: "",
  password: "",
  retypePassword: "",
  error: null
};

class SignUp extends Component {
  state = {
    ...INITIAL_STATE
  };

  handleOnChange = event => {
    this.setState(
      this.setState({
        [event.target.name]: event.target.value
      })
    );
  };

  onSubmit = (firebase, event) => {
    console.log(firebase);
    const { email, password, username } = this.state;

    firebase.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return firebase.firebase.user(authUser.user.uid).set(
          {
            username,
            email
          },
          { merge: true }
        );
      })
      .then(() => {
        return firebase.firebase.doSendEmailVerification();
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.setState({
          error: {
            message: "An email verification has been sent to you!"
          }
        });
        // this.props.changePage("LogIn");
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { username, email, password, retypePassword, error } = this.state;
    const isInvalid =
      password === "" || password !== retypePassword || username === "";

    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div className="container">
            <div className="logoContainer">
              <img src={catIcon} className="logoIcon" />
              <h1 className="logoText">
                YouTube <span className="logoText__cat">Cat</span>
              </h1>
            </div>
            <Input
              placeholder="Username"
              name="username"
              onChange={this.handleOnChange}
              value={username}
              className="inputField"
            />
            <Input
              placeholder="Email"
              name="email"
              onChange={this.handleOnChange}
              value={email}
              className="inputField"
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              onChange={this.handleOnChange}
              value={password}
              className="inputField"
            />
            <Input
              placeholder="Retype Password"
              name="retypePassword"
              type="password"
              onChange={this.handleOnChange}
              value={retypePassword}
              className="inputField"
            />
            <Button
              className="signup"
              disabled={isInvalid}
              color="primary"
              type="submit"
              onClick={event => this.onSubmit({ firebase }, event)}
              className="signUpButton"
            >
              SIGN UP
            </Button>{" "}
            <br />
            {(error && <p>{error.message}</p> &&
              error.message ===
                "An email verification has been sent to you!" && (
                <p>
                  A verification email has been sent to you. <br />
                  Please verify your email before{" "}
                  <span
                    className="linking"
                    onClick={() => this.props.changePage("LogIn")}
                  >
                    signing in
                  </span>
                </p>
              )) ||
              (error && error.message)}
            {((error &&
              error.message !==
                "An email verification has been sent to you!") ||
              !error) && (
              <div>
                Already have an account? <br />
                <span
                  className="linking"
                  onClick={() => this.props.changePage("LogIn")}
                >
                  Sign in!
                </span>
              </div>
            )}
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}

export default SignUp;
