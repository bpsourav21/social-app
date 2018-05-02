import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { changePassword } from '../authAction';
import Messages from '../../Others/Messages';
import '../auth.css';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = { old_password: '', new_password: '', retype_password: '' };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSignup(event) {
    event.preventDefault();
    this.props.dispatch(changePassword(this.state.old_password, this.state.new_password, this.state.retype_password, this.props.token, this.props));
  }
  render() {
    return (
      <div className="login-container container">
        <div className="card" style={{ padding: '30px' }}>
          <div className="card-body">

            <Messages messages={this.props.messages} />

            <form onSubmit={this.handleSignup.bind(this)}>
              <p className="h2 text-center">Change Password</p>
              <div className="wrap-input100">
                <input type="password" name="old_password" placeholder="Type Old Password" className="input100" value={this.state.old_password} onChange={this.handleChange.bind(this)} />
              </div>
              <div className="wrap-input100">
                <input type="password" name="new_password" placeholder="Type New Password" className="input100" value={this.state.new_password} onChange={this.handleChange.bind(this)} />
              </div>
              <div className="wrap-input100">
                <input type="password" name="retype_password" placeholder="Retype New Password" className="input100" value={this.state.retype_password} onChange={this.handleChange.bind(this)} />
              </div>

              <button type="submit" className="btn btn-info btn-block btn-md">Change Password</button>
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
    user: state.auth.user,
    token: state.auth.token,
  };
};

export default withRouter(connect(mapStateToProps)(ChangePassword));
