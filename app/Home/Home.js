import React, { Component } from "react";
import { Link } from "react-router-dom";


import "./home.css";

class Home extends Component {
  render() {
    return (
      <div className="container">
        <div className="wrapper text-center">
        <div className="centered">
            <h1 className="text-primary">Welcome to Social App</h1>

            <p className="lead">
              <a href="/login" className="btn btn-lg btn-info">
                Login
              </a>
            </p>
            <p className="lead">
              <a href="/signup" className="btn btn-lg btn-info">
                Signup
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
