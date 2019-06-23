import React, { Component } from "react";
import { Button } from "reactstrap";

class SignInGoogle extends Component {
  state = { errror: null };

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        return this.props.firebase.user(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email
          },
          { merge: true }
        );
      })
      .then(socialAuthUser => {
        this.setState({ error: null });
        console.log("success");

        this.props.firebase.auth.onAuthStateChanged(authUser => {
          this.props.changeAuth(authUser);
          this.props.changePage("Welcome");
        });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;
    return (
      <div>
        <Button color="primary" type="submit" onClick={this.onSubmit}>
          Sign In with Google
        </Button>
        {error && <p>{error.message}</p>}
      </div>
    );
  }
}

export default SignInGoogle;
