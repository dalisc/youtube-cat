/*global chrome*/
import React, { Component } from "react";

class BlockCategories extends Component {
  state = {
    selectAllChecked: true
  };

  componentDidMount() {
    const blockedCategories = JSON.parse(
      localStorage.getItem("blockedCategories")
    );

    console.log("Blocked Categories: ", blockedCategories);

    if (null !== blockedCategories) {
      const elements = document.getElementsByClassName("enableKey");

      console.log("blocked cats: ", blockedCategories);

      for (let i = 0; i < blockedCategories.length; i++) {
        console.log("element:", blockedCategories[i]);
        elements[blockedCategories[i]].checked = true;
      }
    }
  }

  handleSavePreferences = () => {
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
      }
    );

    localStorage.setItem("blockedCategories", JSON.stringify(checkedItems));
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
      <div className="container">
        <h1>Blocked categories:</h1>
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
                How-to & Style
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
                Nonprofits &A Activism
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
            <button id="savePreferences" onClick={this.handleSavePreferences}>
              Let the blocking begin!
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default BlockCategories;
