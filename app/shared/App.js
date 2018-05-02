import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import NewRoutes from "../newRoutes";

import "./app.css";


function isAuthenticated(){
  return false;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 

     };
  }
  
  render() {
    return (
      <div className="container-fluid nopadding">
      <NewRoutes />
    </div>
    );
  }
}

export default App;
