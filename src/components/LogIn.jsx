import React, { Component } from "react";
import { Input, Button } from "reactstrap";
import { FirebaseContext } from "./firebase";
import SignInGoogle from "./SignInGoogle";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class LogIn extends Component {
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
    const { email, password } = this.state;
    firebase.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        console.log("logged in");
        this.setState({ ...INITIAL_STATE });

        firebase.firebase.auth
          .onAuthStateChanged(authUser => {
            console.log("going to welcome");
            this.props.changeAuth(authUser);
            this.props.changePage("Welcome");
          })
          .catch(error => {
            console.log("inner errors: ", error);
          });
      })
      .catch(error => {
        this.setState({ error });
        console.log("errors: ", this.state.error);
      });

    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === "" || email === "";

    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div className="container">
            <h1>Sign In</h1>
            <Input
              placeholder="Email"
              name="email"
              onChange={this.handleOnChange}
              value={email}
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              onChange={this.handleOnChange}
              value={password}
            />
            <Button
              disabled={isInvalid}
              color="primary"
              type="submit"
              onClick={event => this.onSubmit({ firebase }, event)}
            >
              Sign In
            </Button>
            {error && <p>{error.message}</p>}
            <SignInGoogle
              changePage={this.props.changePage}
              changeAuth={this.props.changeAuth}
              firebase={firebase}
            />
            <br />
            <span
              className="linking"
              onClick={() => this.props.changePage("ForgotPassword")}
            >
              Forgot Password?
            </span>
            <br />
            Don't have an account?{" "}
            <span
              className="linking"
              onClick={() => this.props.changePage("SignUp")}
            >
              Sign Up
            </span>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}

export default LogIn;
