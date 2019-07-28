import React, { Component } from "react";
import { Button } from "reactstrap";
import "../css/style67.css";
import catIcon from "../icons/icon256.png";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";

class FriendRequests extends Component {
  state = {
    username: "",
    friendsList: [],
    friendEmail: "",
    message: "",
    isLoading: true,
    friendId: "",
    friendPendingRequests: [],
    requestsSent: [],
    requestsReceived: [],
    myself: this.props.myself
  };

  acceptReceivedRequest = (friend, firebase) => {
    const data = [...this.state.friendsList, friend];
    // add this new friend to the existing list of friends locally and on firestore
    this.setState(
      {
        friendsList: data
      },
      () => {
        console.log("friends list: ", this.state.friendsList);
        firebase.user(this.props.authUser.uid).set(
          {
            friends: data
          },
          {
            merge: true
          }
        );

        //remove this friend from the friends request section locally and on firestore
        this.setState(
          {
            requestsReceived: this.state.requestsReceived.filter(
              request => request.id !== friend.id
            )
          },
          () => {
            firebase.user(this.props.authUser.uid).set(
              {
                requests_received: this.state.requestsReceived
              },
              {
                merge: true
              }
            );

            //add yourself as a friend in this new friend's firestore
            firebase
              .user(friend.id)
              .get()
              .then(querySnapshot => {
                let fetchRequestsSentData = querySnapshot.data().requests_sent;
                console.log("friends: ", firebase.user(friend.id));

                if (fetchRequestsSentData !== undefined) {
                  const temp =
                    querySnapshot.data().friends === undefined ||
                    querySnapshot.data().friends.length === 0
                      ? [
                          {
                            email: this.props.authUser.email,
                            username: this.state.username,
                            id: this.props.authUser.uid
                          }
                        ]
                      : [
                          { ...querySnapshot.data().friends },
                          {
                            email: this.props.authUser.email,
                            username: this.state.username,
                            id: this.props.authUser.uid
                          }
                        ];
                  firebase.user(friend.id).set(
                    {
                      requests_sent: fetchRequestsSentData.filter(
                        request => request.id !== this.props.authUser.uid
                      ),
                      friends: temp
                    },
                    { merge: true }
                  );
                }
              });
          }
        );
      }
    );
  };

  rejectReceivedRequest = (request, firebase) => {
    // remove request received locally and on firestore
    this.setState(
      {
        requestsReceived: this.state.requestsReceived.filter(
          friend => friend.id !== request.id
        )
      },
      () => {
        firebase.user(this.props.authUser.uid).set(
          {
            requests_received: this.state.requestsReceived
          },
          {
            merge: true
          }
        );
      }
    );

    //remove request sent from potential friend's account
    firebase
      .user(request.id)
      .get()
      .then(querySnapshot => {
        let fetchRequestsSentData = querySnapshot.data().requests_sent;

        if (fetchRequestsSentData !== undefined) {
          firebase.user(request.id).set(
            {
              requests_sent: fetchRequestsSentData.filter(
                friend => friend.id !== this.props.authUser.uid
              )
            },
            { merge: true }
          );
        }
      });
  };

  renderRequestsReceived = firebase => {
    return this.state.requestsReceived.map(friend => (
      <div>
        <h6>
          {friend.username}
          <span>
            <Close
              className="icon cancel"
              color="danger"
              onClick={() => this.rejectReceivedRequest(friend, firebase)}
            />
            <Check
              className="icon accept"
              color="success"
              onClick={() => this.acceptReceivedRequest(friend, firebase)}
            />
          </span>
        </h6>
      </div>
    ));
  };

  cancelSentRequest = (request, firebase) => {
    this.setState(
      {
        requestsSent: this.state.requestsSent.filter(
          friend => friend.id !== request.id
        )
      },
      () => {
        firebase.user(this.props.authUser.uid).set(
          {
            requests_sent: this.state.requestsSent
          },
          {
            merge: true
          }
        );
      }
    );
    //remove request sent from potential friend's account
    firebase
      .user(request.id)
      .get()
      .then(querySnapshot => {
        let fetchRequestsreceivedData = querySnapshot.data().requests_received;

        if (fetchRequestsreceivedData !== undefined) {
          firebase.user(request.id).set(
            {
              requests_received: fetchRequestsreceivedData.filter(
                friend => friend.id !== this.props.authUser.uid
              )
            },
            { merge: true }
          );
        }
      });
  };

  renderRequestsSent = firebase => {
    return this.state.requestsSent.map(friend => (
      <div>
        <h6>
          {friend.username}
          <span className="inline-button">
            <Close
              className="icon cancel"
              color="danger"
              onClick={() => this.cancelSentRequest(friend, firebase)}
            />
          </span>
        </h6>
      </div>
    ));
  };

  componentDidMount() {
    console.log(this.props.authUser);

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

  render() {
    return (
      <div className="container">
        <div className="logoContainer">
          <img src={catIcon} className="logoIcon" />
          <h1 className="logoText">
            Meow, <span className="logoText__cat">{this.state.myself}!</span>
          </h1>
        </div>
        <h4 className="title oswald">FRIEND INVITATIONS</h4>
        <div className="friends-list">
          {this.state.requestsReceived.length < 1
            ? "No pending invitations."
            : this.renderRequestsReceived(this.props.firebase)}
        </div>
        <h4 className="title oswald">OUTGOING REQUESTS</h4>
        <div className="friends-list">
          {this.state.requestsSent.length < 1
            ? "No invitations sent."
            : this.renderRequestsSent(this.props.firebase)}
        </div>
      </div>
    );
  }
}

export default FriendRequests;
