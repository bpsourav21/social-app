import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { signup } from '../authAction';
import Messages from '../../Others/Messages';
import '../auth.css';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', email: '', password: '' };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSignup(event) {
    event.preventDefault();
    this.props.dispatch(signup(this.state.name, this.state.email, this.state.password, this.props));
  }
  render() {
    return (
      <div className="login-container container">
        <div className="card" style={{padding: '30px'}}>
          <div className="card-body">

            <Messages messages={this.props.messages}/>

            <form onSubmit={this.handleSignup.bind(this)}>
              <p className="h2 text-center">Create an account</p>
              <div className="wrap-input100">
                <input type="text" name="name" id="name" placeholder="Userame" autoFocus className="input100" value={this.state.name} onChange={this.handleChange.bind(this)}/>
              </div>
              <div className="wrap-input100">
                <input type="email" name="email" id="email" placeholder="Email" className="input100" value={this.state.email} onChange={this.handleChange.bind(this)}/>
              </div>
              <div className="wrap-input100">
                <input type="password" name="password" id="password" placeholder="Password" className="input100" value={this.state.password} onChange={this.handleChange.bind(this)}/>
              </div>

              <button type="submit" className="btn btn-info btn-block btn-md">Create an account</button>
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
    messages: state.messages,
    user: state.auth
  };
};

export default withRouter(connect(mapStateToProps)(Signup));
