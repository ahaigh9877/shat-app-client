import React, { Component } from "react";
import superagent from "superagent";
import { Link } from "react-router-dom";
import "./Rooms.css";

export default class Rooms extends Component {
  state = { rooms: [], value: "" };

  // connect to the stream in the backend. No const here cos it's a property of the class.
  stream = new EventSource("http://localhost:4000/stream");

  componentDidMount() {
    // this triggers the stream
    this.stream.onmessage = event => {
      // destrucure the data: what was passed to stream.send on the backend.
      const { data } = event;

      // gotta parse the data, turn it back into an array, cos it was SERIALISED in the back end.
      const parsed = JSON.parse(data);

      // Check if it's now a proper array
      if (Array.isArray(parsed)) {
        // If so, we ASSUME it contains ALL rooms (gotta keep an eye on the backend).
        // Then replace the full message-list in the state.
        this.setState({ rooms: parsed });
      } else {
        // If it's NOT an array, we take it to be a single message (now room ffs).
        // We add it to the END of the array in the state.
        const rooms = [...this.state.rooms, parsed];
        // Then replace the old state array with the newly created (appened) array.
        this.setState({ rooms });
      }
    };
  }

  // handler function for adding stuff from the form
  onChange = event => {
    const { value } = event.target;
    this.setState({ value });
  };

  onSubmit = event => {
    event.preventDefault();
    // send request to backend!! Needs Superagent!!!
    // get the value outta the state
    const { value } = this.state;
    const url = "http://localhost:4000/room";
    // it's a promise, so add a then (or do async await)
    superagent
      .post(url)
      .send({ name: value })
      .then(response => console.log(response));

    /// this only changes the state, but not what's on the damn form. The form isn not yet fully controlled. Add a "value" attribute on the form.
    this.setState({ value: "" });
  };

  reset = () => {
    this.setState({ value: "" });
  };

  render() {
    // it's a nice idea to do the mapping and shit before the return.
    const list = this.state.rooms.map((name, index) => (
      <div key={index} id="oneMessage">
        <p>
          <Link to={`/room/${name}`}>{name}</Link>
        </p>
      </div>
    ));

    return (
      <div>
        <form id="addMessageForm" onSubmit={this.onSubmit}>
          <input
            id="addMessageArea"
            type="text"
            onChange={this.onChange}
            value={this.state.value}
          />
          {/* it's not a submit button, so say type = button */}
          <button
            className="addMessageButton"
            type="button"
            onClick={this.reset}
          >
            REEEEEE-set
          </button>
          <button className="addMessageButton">submit!!!</button>
        </form>
        <div id="allMessages">{list}</div>
      </div>
    );
  }
}
