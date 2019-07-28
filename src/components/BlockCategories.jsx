/*global chrome*/
import React, { Component } from "react";
import Spinner from "react-bootstrap/Spinner";
import "../styles910.css";
import catIcon from "../icons/icon256.png";

class BlockCategories extends Component {
  state = {
    selectAllChecked: true,
    blockedCategories: null,
    userId: null,
    isLoading: true,
    message: ""
  };

  async componentDidMount() {
    const userId =
      this.props.user.id === undefined
        ? this.props.user.uid
        : this.props.user.id;

    console.log("user for blocking: ", userId);
    console.log("user", this.props.user);
    this.props.buttonSetting(
      this.props.user.id === undefined ? "myself" : "friend"
    );
    this.setState({
      userId
    });
    const blockedCategories = await this.props.firebase
      .user(userId)
      .onSnapshot(snapshot => {
        this.setState({ blockedCategories: snapshot.data() }, () => {
          const { blockedCategories } = this.state;

          if (null !== blockedCategories && undefined !== blockedCategories) {
            if (undefined !== blockedCategories.blockedCategories) {
              const elements = document.getElementsByClassName("enableKey");
              const getCategories = blockedCategories.blockedCategories;
              console.log(
                "blocked cats: ",
                blockedCategories.blockedCategories
              );

              for (let i = 0; i < getCategories.length; i++) {
                console.log("element:", getCategories[i]);
                console.log("element nesting: ", elements);
                elements[getCategories[i]].checked = true;
              }
            }
          }
          this.setState({
            isLoading: false
          });
        });
      });
  }

  handleSavePreferences = firebase => {
    const elements = document.getElementsByClassName("enableKey");
    let checkedItems = [];
    const catArray = [];
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].checked) {
        checkedItems.push(elements[i].value);
        catArray.push(elements[i].name);
      }
    }

    if (this.props.user.id === undefined) {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "changePreferences",
            categories: catArray
          });
          console.log("sending message about cats");
        }
      );
    }

    if (this.props.user.id === undefined) {
      //save data in local storage about self
      console.log("setting local storage");
      localStorage.setItem("blockedCategories", JSON.stringify(checkedItems));
    }

    firebase.user(this.state.userId).set(
      {
        blockedCategories: checkedItems
      },
      { merge: true }
    );

    this.setState({ message: "Blocking has begun! Meow" });

    console.log(checkedItems);
  };

  handleSelectAll = () => {
    this.setState({
      selectAllChecked: !this.state.selectAllChecked
    });

    if (this.state.selectAllChecked) {
      const elements = document.getElementsByClassName("enableKey");
      for (let i = 0; i < elements.length; i++) {
        elements[i].checked = true;
      }
    } else {
      const elements = document.getElementsByClassName("enableKey");
      for (let i = 0; i < elements.length; i++) {
        elements[i].checked = false;
      }
    }
  };

  render() {
    return (
      <>
        {this.state.isLoading ? (
          <Spinner animation="border" role="status" />
        ) : (
          <div />
        )}
        <div className="container">
          <div className="bc__logoContainer">
            <img src={catIcon} className="bc__logoIcon" />
            <h1 className="bc__logoText">
              Meow,{" "}
              <span className="bc__logoText__cat">{this.props.username}</span>
            </h1>
          </div>
          <div className="bc__toptext">
            Blocking for{" "}
            <span className="bc__toptext--red">
              {this.props.user.id === undefined
                ? "myself"
                : this.props.user.username}
              :
            </span>
          </div>
          <br />
          <div className="row">
            <div className="checkbox-group">
              <ul className="bc__blockedcategories">
                <li>
                  <input
                    type="checkbox"
                    value="-1"
                    id="selectAll"
                    onClick={this.handleSelectAll}
                  />
                  Select all
                </li>
                <br />
                <li>
                  <input
                    type="checkbox"
                    value="0"
                    name="Auto & Vehicles"
                    className="enableKey"
                  />
                  Auto & Vehicles
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="1"
                    name="Beauty & Fashion"
                    className="enableKey"
                  />
                  Beauty & Fashion
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="2"
                    name="Comedy"
                    className="enableKey"
                  />
                  Comedy
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="3"
                    name="Education"
                    className="enableKey"
                  />
                  Education
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="4"
                    name="Entertainment"
                    className="enableKey"
                  />
                  Entertainment
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="5"
                    name="Family Entertainment"
                    className="enableKey"
                  />
                  Family Entertainment
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="6"
                    name="Film & Animation"
                    className="enableKey"
                  />
                  Film & Animation
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="7"
                    name="Food"
                    className="enableKey"
                  />
                  Food
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="8"
                    name="Gaming"
                    className="enableKey"
                  />
                  Gaming
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="9"
                    name="Howto & Style"
                    className="enableKey"
                  />
                  Howto & Style
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="10"
                    name="Music"
                    className="enableKey"
                  />
                  Music
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="11"
                    name="News & Politics"
                    className="enableKey"
                  />
                  News & Politics
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="12"
                    name="Nonprofits & Activism"
                    className="enableKey"
                  />
                  Nonprofits & Activism
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="13"
                    name="People & Blogs"
                    className="enableKey"
                  />
                  People & Blogs
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="14"
                    name="Pets & Animals"
                    className="enableKey"
                  />
                  Pets & Animals
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="15"
                    name="Science & Technology"
                    className="enableKey"
                  />
                  Science & Technology
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="16"
                    name="Sports"
                    className="enableKey"
                  />
                  Sports
                </li>
                <li>
                  <input
                    type="checkbox"
                    value="17"
                    name="Travel & Events"
                    className="enableKey"
                  />
                  Travel & Events
                </li>
              </ul>
              <div className="buttonwrapper">
                <button
                  id="savePreferences"
                  className="savePreferences"
                  onClick={() =>
                    this.handleSavePreferences(this.props.firebase)
                  }
                >
                  Begin block!
                </button>
                <br />
                {this.state.message}
              </div>
            </div>
          </div>
        </div>
      </>
    );
    //   }}
    // </FirebaseContext.Consumer>
    // );
  }
}

export default BlockCategories;
