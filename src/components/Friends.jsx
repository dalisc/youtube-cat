import React, { Component } from "react";
import { Input, Button, Form, FormGroup } from "reactstrap";
import Spinner from "react-bootstrap/Spinner";

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
          <h6>{friend.username}</h6>
          <Button
            color="success"
            onClick={() => this.props.handleHelpFriend(friend)}
          >
            Help my friend!
          </Button>
          <Button
            color="danger"
            onClick={() => this.handleRemoveFriend(friend, firebase)}
          >
            Remove friend
          </Button>
        </div>
      ))
    ) : (
      <div />
    );
  };

  renderRequestsSent = firebase => {
    return this.state.requestsSent.map(friend => (
      <div>
        <h6>{friend.username}</h6>
        <Button
          color="danger"
          onClick={() => this.cancelSentRequest(friend, firebase)}
        >
          Cancel Request
        </Button>
      </div>
    ));
  };

  acceptReceivedRequest = (friend, firebase) => {
    // add this new friend to the existing list of friends locally and on firestore
    this.setState(
      {
        friendsList: [...this.state.friendsList, friend]
      },
      () => {
        console.log("friends list: ", this.state.friendsList);
        firebase.user(this.props.authUser.uid).set(
          {
            friends: this.state.friendsList
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
        <h6>{friend.username}</h6>
        <Button
          color="success"
          onClick={() => this.acceptReceivedRequest(friend, firebase)}
        >
          Accept
        </Button>
        <Button
          color="danger"
          onClick={() => this.rejectReceivedRequest(friend, firebase)}
        >
          Reject
        </Button>
      </div>
    ));
  };

  handleFriendEmail = e => {
    this.setState({
      friendEmail: e.target.value
    });
  };

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

  handleUpdateFriendsPreferences = firebase => {};

  render() {
    return (
      <div className="container">
        <h3 className="toptext">Friends</h3>

        {this.renderFriendsList(this.props.firebase)}

        {/* <Button
          className="signout"
          onClick={() =>
            this.handleUpdateFriendsPreferences(this.props.firebase)
          }
        >
          Update Preferences
        </Button> */}

        <h4>Requests Sent</h4>
        {this.renderRequestsSent(this.props.firebase)}

        <h4>Requests Received</h4>
        {this.renderRequestsReceived(this.props.firebase)}

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

export default Friends;
