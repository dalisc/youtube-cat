import React, { Component } from "react";
import { Input, Button, Form, FormGroup } from "reactstrap";
import Spinner from "react-bootstrap/Spinner";
import "../css/style67.css"
import catIcon from "../icons/icon256.png";

class Friends extends Component {
  state = {
    username: "",
    friendsList: [],
    friendEmail: "",
    message: "",
    isLoading: true,
    friendId: "",
    friendPendingRequests: [],
    requestsSent: [],
    requestsReceived: []
  };

  componentDidMount() {
    console.log(this.props.authUser);
    this.props.changePage("Friends");
    this.props.firebase.user(this.props.authUser.uid).onSnapshot(snapshot => {
      this.setState(
        {
          username: snapshot.data().username,
          friendsList:
            snapshot.data().friends === undefined
              ? []
              : snapshot.data().friends,
          isLoading: false,
          requestsSent:
            snapshot.data().requests_sent === undefined
              ? []
              : snapshot.data().requests_sent,
          requestsReceived:
            snapshot.data().requests_received === undefined
              ? []
              : snapshot.data().requests_received
        },
        () => console.log("friends: ", this.state.friendsList.length === 0)
      );
    });
  }

  handleRemoveFriend = (foe, firebase) => {
    this.setState(
      {
        friendsList: this.state.friendsList.filter(
          friend => friend.id !== foe.id
        )
      },
      () => {
        firebase.user(this.props.authUser.uid).set(
          {
            friends: this.state.friendsList
          },
          {
            merge: true
          }
        );
      }
    );

    firebase
      .user(foe.id)
      .get()
      .then(querySnapshot => {
        let foeFriendsList = querySnapshot.data().friends;

        if (foeFriendsList !== undefined) {
          firebase.user(foe.id).set(
            {
              friends: foeFriendsList.filter(
                friend => friend.id !== this.props.authUser.uid
              )
            },
            {
              merge: true
            }
          );
        }
      });
  };

  renderFriendsList = firebase => {
    return this.state.isLoading ? (
      <Spinner animation="border" role="status" />
    ) : this.state.friendsList !== undefined ? (
      this.state.friendsList.map(friend => (
        <div>
          <h6 className="friend oswald" onClick={() => this.props.handleHelpFriend(friend)}>
            {friend.username}
          </h6>
        </div>
      ))
    ) : (
      <div />
    );
  };

  render() {
    return (
      <div className="container">
        <div className="logoContainer">
            <img src={catIcon} className="logoIcon" />
            <h1 className="logoText">
              Meow, <span className="logoText__cat">{this.props.username}!</span>
            </h1>
          </div>
        <h3 className="title oswald">FRIENDS</h3>
        Choose a friend and block their vids!
        <div className="friends-list">
        {this.renderFriendsList(this.props.firebase)}
        </div>
        <Button 
        className="input-btn"
        onClick={() => this.props.changePage("AddFriend")}>ADD FRIENDS</Button>
        <Button 
        className="input-btn"
        onClick={() => this.props.changePage("FriendRequests")}>
          INVITES
        </Button>
      </div>
    );
  }
}

export default Friends;
