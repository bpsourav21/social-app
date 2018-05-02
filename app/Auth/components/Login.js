import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { login } from '../authAction';
import Messages from '../../Others/Messages';

import '../auth.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', password: '' };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLogin(event) {
    event.preventDefault();
    this.props.dispatch(login(this.state.name, this.state.password, this.props));
  }

  render() {
    return (
      <div className="login-container container">
        <div className="card" style={{ marginTop: '50px', padding: '30px', boxShadow: ' 0 0 2rem rgba(0, 0, 0, 0.3)' }}>
          <div className="card-body">
            <Messages messages={this.props.messages} />
            <form onSubmit={this.handleLogin.bind(this)}>
              <p className="h2 text-center" style={{color:" rgb(133, 203, 240)"}}>Log In</p>
              <br/>
              <div className="wrap-input100">
                <input type="name" name="name" id="name" placeholder="Userame" autoFocus className="input100" value={this.state.name} onChange={this.handleChange.bind(this)} />
              </div>
              <div className="wrap-input100">
                <input type="password" name="password" id="password" placeholder="Password" className="input100" value={this.state.password} onChange={this.handleChange.bind(this)} />
              </div>

              <button type="submit" className="btn btn-info btn-block btn-md">Log in</button>

            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Login);
