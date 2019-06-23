import React, { Component } from "react";
import { Input, Button } from "reactstrap";
import { FirebaseContext } from "./firebase";

const INITIAL_STATE = {
  email: "",
  error: null
};

class ForgotPassword extends Component {
  state = {
    ...INITIAL_STATE,
    resetEmailSent: false
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
    const { email } = this.state;
    firebase.firebase
      .doPasswordReset(email)
      .then(authUser => {
        console.log("reset email sent");
        this.setState({ ...INITIAL_STATE, resetEmailSent: true });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { email, resetEmailSent, error } = this.state;
    const isInvalid =
      //   email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ||
      email === "";

    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div className="container">
            <h1>Reset Password</h1>

            <Input
              placeholder="Email"
              name="email"
              onChange={this.handleOnChange}
              value={email}
            />

            <Button
              disabled={isInvalid}
              color="primary"
              type="submit"
              onClick={event => this.onSubmit({ firebase }, event)}
            >
              Send email to reset
            </Button>
            {error && <p>{error.message}</p>}
            {resetEmailSent && (
              <div>
                <p>{"An email has been sent to reset your password"}</p>
              </div>
            )}
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}

export default ForgotPassword;
