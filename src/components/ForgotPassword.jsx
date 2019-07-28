import React, { Component } from "react";
import { Input, Button } from "reactstrap";
import { FirebaseContext } from "./firebase";
import "../css/style145.css"
import catIcon from "../icons/icon256.png";

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
            <img className="catIcon" src={catIcon} />
            <h1 className="ytpcat">YouTube <span className="cat">Cat</span></h1>
            
            <div className="inputWrapper">
            <Input
              placeholder="Email"
              className="input-text text"
              name="email"
              onChange={this.handleOnChange}
              value={email}
            />
            </div>

            <div className="button-wrapper">
            <Button
              className="input-btn text"
              disabled={isInvalid}
              type="submit"
              onClick={event => this.onSubmit({ firebase }, event)}
            >
              RESET PASSWORD
            </Button>
            </div>
            {error && <p className="error text">{error.message}</p>}
            {resetEmailSent && (
              <div>
                <p className="verify text">{"An email has been sent to reset your password"}</p>
              </div>
            )}
                        <div className="bottom-text text">
            <p className="question text">Remembered your password? 
            <span
              className="linking text"
              onClick={() => this.props.changePage("LogIn")}
              > Sign In!
            </span>
            </p>
            </div>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}

export default ForgotPassword;
