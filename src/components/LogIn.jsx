import React, { Component } from "react";
import { Input, Button } from "reactstrap";
import { FirebaseContext } from "./firebase";


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
            <h1 className="toptext">Sign In</h1>
            <Input
              className="signin-input"
              placeholder="Email"
              name="email"
              onChange={this.handleOnChange}
              value={email}
            />
            <Input
              className="signin-input"
              placeholder="Password"
              name="password"
              type="password"
              onChange={this.handleOnChange}
              value={password}
            />
            <Button
              className="signin"
              disabled={isInvalid}
              color="primary"
              type="submit"
              onClick={event => this.onSubmit({ firebase }, event)}
            >
              Sign In
            </Button>
            {error && <p>{error.message}</p>}

            
            <span
              className="linking"
              onClick={() => this.props.changePage("ForgotPassword")}
            >
              Forgot Password?
            </span>
            <br />
            <br />
            Don't have an account?{" "}
            <br/>
            <span
              className="linking"
              onClick={() => this.props.changePage("SignUp")}
            >
              Sign Up
            </span>
            <br />
            <br />
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}

export default LogIn;
