import React, { Fragment, Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import Rooms from "./Rooms";

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Route exact path="/" component={Rooms} />
      </Fragment>
    );
  }
}
