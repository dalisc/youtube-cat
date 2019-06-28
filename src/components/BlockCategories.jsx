/*global chrome*/
import React, { Component } from "react";
import { FirebaseContext } from "./firebase";

class BlockCategories extends Component {
  state = {
    selectAllChecked: true,
    blockedCategories: null
  };

  async componentDidMount() {
    const blockedCategories = await this.props.firebase
      .user(this.props.authUser.uid)
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
                elements[getCategories[i]].checked = true;
              }
            }
          }
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

    localStorage.setItem("blockedCategories", JSON.stringify(checkedItems));
    firebase.user(this.props.authUser.uid).set(
      {
        blockedCategories: checkedItems
      },
      { merge: true }
    );
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
      // <FirebaseContext.Consumer>
      //   {firebase => {
      //     this.getBlockedCategories(firebase);
      // return (
      <div className="container">
        <h3 className="toptext">Blocked categories:</h3>
        <br/>
        <div className="row">
          <div className="checkbox-group">
            <ul className="blockedcategories">
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
                  class="enableKey"
                />
                Auto & Vehicles
              </li>
              <li>
                <input
                  type="checkbox"
                  value="1"
                  name="Beauty & Fashion"
                  class="enableKey"
                />
                Beauty & Fashion
              </li>
              <li>
                <input
                  type="checkbox"
                  value="2"
                  name="Comedy"
                  class="enableKey"
                />
                Comedy
              </li>
              <li>
                <input
                  type="checkbox"
                  value="3"
                  name="Education"
                  class="enableKey"
                />
                Education
              </li>
              <li>
                <input
                  type="checkbox"
                  value="4"
                  name="Entertainment"
                  class="enableKey"
                />
                Entertainment
              </li>
              <li>
                <input
                  type="checkbox"
                  value="5"
                  name="Family Entertainment"
                  class="enableKey"
                />
                Family Entertainment
              </li>
              <li>
                <input
                  type="checkbox"
                  value="6"
                  name="Film & Animation"
                  class="enableKey"
                />
                Film & Animation
              </li>
              <li>
                <input
                  type="checkbox"
                  value="7"
                  name="Food"
                  class="enableKey"
                />
                Food
              </li>
              <li>
                <input
                  type="checkbox"
                  value="8"
                  name="Gaming"
                  class="enableKey"
                />
                Gaming
              </li>
              <li>
                <input
                  type="checkbox"
                  value="9"
                  name="How-to & Style"
                  class="enableKey"
                />
                Howto & Style
              </li>
              <li>
                <input
                  type="checkbox"
                  value="10"
                  name="Music"
                  class="enableKey"
                />
                Music
              </li>
              <li>
                <input
                  type="checkbox"
                  value="11"
                  name="News & Politics"
                  class="enableKey"
                />
                News & Politics
              </li>
              <li>
                <input
                  type="checkbox"
                  value="12"
                  name="Nonprofits & Activism"
                  class="enableKey"
                />
                Nonprofits & Activism
              </li>
              <li>
                <input
                  type="checkbox"
                  value="13"
                  name="People & Blogs"
                  class="enableKey"
                />
                People & Blogs
              </li>
              <li>
                <input
                  type="checkbox"
                  value="14"
                  name="Pets & Animals"
                  class="enableKey"
                />
                Pets & Animals
              </li>
              <li>
                <input
                  type="checkbox"
                  value="15"
                  name="Science & Technology"
                  class="enableKey"
                />
                Science & Technology
              </li>
              <li>
                <input
                  type="checkbox"
                  value="16"
                  name="Sports"
                  class="enableKey"
                />
                Sports
              </li>
              <li>
                <input
                  type="checkbox"
                  value="17"
                  name="Travel & Events"
                  class="enableKey"
                />
                Travel & Events
              </li>
            </ul>
            <div class="buttonwrapper">
            <button
              id="savePreferences"
              class="savePreferences"
              onClick={() => this.handleSavePreferences(this.props.firebase)}
            >
              Begin block!
            </button>
            </div>
          </div>
        </div>
      </div>
    );
    //   }}
    // </FirebaseContext.Consumer>
    // );
  }
}

export default BlockCategories;
