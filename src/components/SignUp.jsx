import React, { Component } from "react";
import { Input, Button } from "reactstrap";
import { FirebaseContext } from "./firebase";

const INITIAL_STATE = {
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
    const { email, password } = this.state;
    firebase.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.changePage("LogIn");
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { email, password, retypePassword, error } = this.state;
    const isInvalid = password === "" || password !== retypePassword;

    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div className="container">
            <h1>Sign Up:</h1>
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
            <Input
              placeholder="Retype Password"
              name="retypePassword"
              type="password"
              onChange={this.handleOnChange}
              value={retypePassword}
            />
            <Button
              disabled={isInvalid}
              color="primary"
              type="submit"
              onClick={event => this.onSubmit({ firebase }, event)}
            >
              Sign Up!
            </Button>{" "}
            <br />
            {error && <p>{error.message}</p>}
            Already have an account?{" "}
            <span
              className="linking"
              onClick={() => this.props.changePage("LogIn")}
            >
              Sign in
            </span>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}

export default SignUp;
