import React, { Component } from "react";
import { Input, Button } from "reactstrap";
import { FirebaseContext } from "./firebase";
import "../css/style145.css"
import catIcon from "../icons/icon256.png";

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
            if (authUser !== null && authUser.emailVerified) {
              this.props.changeAuth(authUser);
              this.props.changePage("Welcome");
            } else if (authUser !== null && !authUser.emailVerified) {
              this.setState({
                error: { message: "Please authenticate your email first!" }
              });
            }
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
            <img className="catIcon" src={catIcon} />
            <h1 className="ytpcat">YouTube <span className="cat">Cat</span></h1>
            
            <div className="input-wrapper">
            <Input
              className="input-text text"
              placeholder="Email"
              name="email"
              onChange={this.handleOnChange}
              value={email}
            />
            <Input
              className="input-text text"
              placeholder="Password"
              name="password"
              type="password"
              onChange={this.handleOnChange}
              value={password}
            />
            </div>
            <div className="button-wrapper">
            <Button
              className="input-btn text"
              disabled={isInvalid}
              type="submit"
              onClick={event => this.onSubmit({ firebase }, event)}
            >
              SIGN IN
            </Button>
            </div>
            {error && <p className="error text">{error.message}</p>}
            <div className="bottom-text text">
            <p className="question text">New to YouTube Cat? 
            <span
              className="linking text"
              onClick={() => this.spanrops.changePage("SignUp")}
              > Sign Up!
            </span>
            </p>
            <p className="text">Forgot password?
            <span
              className="question linking text"
              onClick={() => this.props.changePage("ForgotPassword")}
              > Reset
            </span>
            </p>
            </div>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}

export default LogIn;
