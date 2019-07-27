import React, { Component } from "react";
import { Input, Button, Form, FormGroup } from "reactstrap";

class AddFriend extends Component {
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

  handleAddFriend = firebase => {
    if (this.state.friendEmail === this.props.authUser.email) {
      this.setState({
        message:
          "There is no denying that you are a friend of yourself! Broaden your horizons!",
        friendEmail: ""
      });
    } else {
      const alreadyFriend = this.state.friendsList.filter(friend => {
        // console.log(friend.email, "     ", this.state.friendEmail);
        return friend.email === this.state.friendEmail;
      });

      const alreadyRequestReceived = this.state.requestsReceived.filter(
        request => {
          // console.log(request.email, "     ", this.state.friendEmail);
          return request.email === this.state.friendEmail;
        }
      );

      console.log(this.state.requestsSent);
      const alreadyRequestSent = this.state.requestsSent.filter(request => {
        // console.log(request.email, "     ", this.state.friendEmail);
        return request.email === this.state.friendEmail;
      });
      if (alreadyFriend.length > 0) {
        this.setState({
          message:
            "The user is already your friend!! Do you doubt your friendship meow?",
          friendEmail: ""
        });
      } else if (alreadyRequestReceived.length > 0) {
        this.setState({
          message:
            "The user has already sent you a request! Go ahead and accept it! Start of a new friendship!",
          friendEmail: ""
        });
      } else if (alreadyRequestSent.length > 0) {
        this.setState({
          message:
            "Don't be so desperate meow. Give the user some time to accept your request!",
          friendEmail: ""
        });
      } else {
        firebase.db
          .collection("users")
          .where("email", "==", this.state.friendEmail)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.docs.length < 1) {
              this.setState({
                message:
                  "Meow Meow. This user does not exist. Please check the email and try again",
                friendEmail: ""
              });
            } else {
              querySnapshot.forEach(doc => {
                if (
                  this.state.requestsSent.filter(
                    friend => friend.uid === doc.id
                  ).length === 0
                ) {
                  this.setState(
                    {
                      requestsSent: [
                        ...this.state.requestsSent,
                        {
                          email: this.state.friendEmail,
                          username: doc.data().username,
                          id: doc.id
                        }
                      ],
                      friendId: doc.id
                    },
                    () => {
                      console.log("friend id: ", this.state.friendId);
                      firebase.user(this.props.authUser.uid).set(
                        {
                          requests_sent: this.state.requestsSent
                        },
                        { merge: true }
                      );

                      this.setState(
                        {
                          message: "Request sent"
                        },
                        () => {
                          firebase
                            .user(this.state.friendId)
                            .get()
                            .then(querySnapshot => {
                              this.setState(
                                {
                                  friendsPendingRequests:
                                    querySnapshot.data().requests_received ===
                                    undefined
                                      ? []
                                      : querySnapshot.data().requests_received
                                },
                                () => {
                                  firebase.user(this.state.friendId).set(
                                    {
                                      requests_received: [
                                        ...this.state.friendPendingRequests,
                                        {
                                          id: this.props.authUser.uid,
                                          email: this.props.authUser.email,
                                          username: this.state.username
                                        }
                                      ]
                                    },
                                    { merge: true }
                                  );
                                }
                              );
                            });
                        }
                      );
                    }
                  );
                } else {
                  this.setState({
                    message:
                      "Request is already sent. Please be patient and purr"
                  });
                }
                this.setState({
                  friendEmail: ""
                });
              });
            }
          });
      }
    }
  };

  handleFriendEmail = e => {
    this.setState({
      friendEmail: e.target.value
    });
  };

  render() {
    return (
      <div>
        {" "}
        <h2>Meow {this.props.username}</h2>
        <h4>Add a friend!</h4>
        <Form>
          <FormGroup>
            <Input
              placeholder="email"
              type="email"
              onChange={e => this.handleFriendEmail(e)}
              value={this.state.friendEmail}
            />

            <Button
              className=""
              onClick={() => this.handleAddFriend(this.props.firebase)}
            >
              Add!
            </Button>
            <div>{this.state.message}</div>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default AddFriend;
