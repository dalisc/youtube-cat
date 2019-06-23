/*global chrome*/
import React, { Component } from "react";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import BlockedCategories from "./components/BlockCategories";
import ForgotPassword from "./components/ForgotPassword";
import Welcome from "./components/Welcome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class App extends Component {
  state = {
    page: "",
    authUser: localStorage.getItem("authUser")
  };

  handlePages = pageTitle => {
    this.setState({
      page: pageTitle
    });
  };

  handleAuthUser = user => {
    this.setState({
      authUser: user
    });
    localStorage.setItem("authUser", user);
  };

  handleBack = () => {
    if (this.state.page === "SignUp" || this.state.page === "ForgotPassword") {
      this.handlePages("LogIn");
    } else if (this.state.page === "BlockedCategories") {
      this.handlePages("Welcome");
    }
  };

  renderBack = () => {
    console.log(this.state.page);
    if (
      this.state.page === "LogIn" ||
      this.state.page === "" ||
      this.state.page === "Welcome"
    ) {
      return <div />;
    } else {
      return <FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />;
    }
  };

  renderComponent = () => {
    switch (this.state.page) {
      case "LogIn":
        return (
          <LogIn
            changePage={this.handlePages}
            changeAuth={this.handleAuthUser}
            page={this.state.page}
          />
        );
      case "SignUp":
        return <SignUp changePage={this.handlePages} />;
      case "ForgotPassword":
        return <ForgotPassword changePage={this.handlePages} />;
      case "Welcome":
        return (
          <Welcome
            changePage={this.handlePages}
            changeAuth={this.handleAuthUser}
            authUser={this.state.authUser}
          />
        );
      case "BlockedCategories":
        return <BlockedCategories changePage={this.handlePages} />;

      default:
        if (this.state.authUser !== "null") {
          return (
            <Welcome
              changePage={this.handlePages}
              changeAuth={this.handleAuthUser}
              authUser={this.state.authUser}
            />
          );
        } else {
          return (
            <LogIn
              changePage={this.handlePages}
              changeAuth={this.handleAuthUser}
              page={this.state.page}
            />
          );
        }
    }
  };

  render() {
    return (
      <div className="container flexing">
        <div className="flex1" onClick={this.handleBack}>
          {this.renderBack()}
        </div>
        <div className="flex2">{this.renderComponent()}</div>
      </div>
    );
  }
}

export default App;
