/*global chrome*/
import React, { Component } from "react";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import BlockedCategories from "./components/BlockCategories";
import ForgotPassword from "./components/ForgotPassword";
import Welcome from "./components/Welcome";
import AddFriend from "./components/AddFriend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FirebaseContext } from "./components/firebase";
import Friends from "./components/Friends";
import { thisExpression } from "@babel/types";
import FriendRequests from "./components/FriendRequests";

class App extends Component {
  state = {
    page: "",
    authUser:
      localStorage.getItem("authUser") !== "null"
        ? JSON.parse(localStorage.getItem("authUser"))
        : localStorage.getItem("authUser") !== "null",
    blockedCategoriesUser: null,
    backFor: "myself",
    username: ""
  };

  handleUsername = name => {
    this.setState({ username: name });
  };

  handlePages = pageTitle => {
    console.log("page title: ", pageTitle);
    this.setState({
      page: pageTitle
    });
  };

  handleAuthUser = user => {
    this.setState({
      authUser: user
    });
    if (user !== "null") {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.setItem("authUser", user);
    }
  };

  handleBackButtonSettings = backFor => {
    this.setState({
      backFor: backFor
    });
  };

  handleBack = () => {
    if (this.state.page === "SignUp" || this.state.page === "ForgotPassword") {
      this.handlePages("LogIn");
    } else if (
      (this.state.page === "BlockedCategories" &&
        this.state.backFor === "myself") ||
      this.state.page === "Friends"
    ) {
      this.handlePages("Welcome");
    } else if (
      (this.state.page === "BlockedCategories" &&
        this.state.backFor === "friend") ||
      this.state.page === "AddFriend" ||
      this.state.page === "FriendRequests"
    ) {
      this.handlePages("Friends");
    }
  };

  handleBlockedCategoriesUser = user => {
    this.setState({
      blockedCategoriesUser: user
    });
  };

  handleHelpFriend = friend => {
    this.setState(
      {
        blockedCategoriesUser: friend
      },
      () => this.handlePages("BlockedCategories")
    );
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
      return (
        <FontAwesomeIcon
          className="backButton"
          icon={["fas", "arrow-left"]}
          size="lg"
        />
      );
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
            blockedCategoriesUser={this.handleBlockedCategoriesUser}
            setUsername={this.handleUsername}
          />
        );
      case "BlockedCategories":
        return (
          <FirebaseContext.Consumer>
            {firebase => (
              <BlockedCategories
                changePage={this.handlePages}
                user={this.state.blockedCategoriesUser}
                firebase={firebase}
                buttonSetting={this.handleBackButtonSettings}
                username={this.state.username}
              />
            )}
          </FirebaseContext.Consumer>
        );

      case "Friends":
        return (
          <FirebaseContext.Consumer>
            {firebase => (
              <Friends
                changePage={this.handlePages}
                authUser={this.state.authUser}
                firebase={firebase}
                blockedCategoriesUser={this.handleBlockedCategoriesUser}
                handleHelpFriend={this.handleHelpFriend}
                username={this.state.username}
              />
            )}
          </FirebaseContext.Consumer>
        );

      case "AddFriend":
        return (
          <FirebaseContext.Consumer>
            {firebase => (
              <AddFriend
                changePage={this.handlePages}
                authUser={this.state.authUser}
                firebase={firebase}
                blockedCategoriesUser={this.handleBlockedCategoriesUser}
                username={this.state.username}
              />
            )}
          </FirebaseContext.Consumer>
        );

      case "FriendRequests":
        return (
          <FirebaseContext.Consumer>
            {firebase => (
              <FriendRequests
                changePage={this.handlePages}
                authUser={this.state.authUser}
                firebase={firebase}
                blockedCategoriesUser={this.handleBlockedCategoriesUser}
                username={this.state.username}
              />
            )}
          </FirebaseContext.Consumer>
        );

      default:
        if (
          this.state.authUser !== "null" &&
          this.state.authUser !== null &&
          this.state.authUser !== false
        ) {
          return (
            <Welcome
              changePage={this.handlePages}
              changeAuth={this.handleAuthUser}
              authUser={this.state.authUser}
              blockedCategoriesUser={this.handleBlockedCategoriesUser}
              setUsername={this.handleUsername}
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
