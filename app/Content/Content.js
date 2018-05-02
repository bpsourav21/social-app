import React, { Component } from "react";
import { connect } from 'react-redux';
import { NavLink, Link, withRouter } from "react-router-dom";
import Header from "../Header/Header";
import "./content.css";

const list = [{ img: "/img/logo.png", name: "Cameli", status: null },
{ img: "/img/logo.png", name: "Alexa", status: null },
{ img: "/img/logo.png", name: "Theodor", status: "Accepted" },
{ img: "/img/logo.png", name: "Robert", status: "Rejected" }
]
class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    statusBlockFunc(status) {
        if (status == null) {
            return (<div className="buttonBlock">
                <div className="btnPadding">
                    <button className="btn btn-accept">Accept</button>
                </div>
                <div className="btnPadding">
                    <button className="btn btn-reject">Reject</button>
                </div>
            </div>)
        }
        else if (status == "Accepted") {
            return (<h6 className="text-success">Accepted</h6>)
        }
        else if (status == "Rejected") {
            return (<h6 className="text-danger">Rejected</h6>)
        }
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <Header />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card" style={{ padding: '30px', boxShadow: ' 0 0 2rem rgba(0, 0, 0, 0.3)' }}>
                            <div className="card-body">
                                {list.map((data, i) =>
                                    <div key={i} className="list-group-item list-group-item-action flex-column align-items-start" >
                                        <span>
                                            <img src={data.img} className="rounded float-left" alt="..." style={{ width: 50, height: 50, padding: 5 }} />
                                        </span>
                                        <span>
                                            <div className="d-flex justify-content-between">
                                                <div className="p-2 ">
                                                    <h5 className="mb-1">{data.name}</h5>
                                                </div>
                                                <div>
                                                    {this.statusBlockFunc(data.status)}
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>


            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user
    };
};

export default withRouter(connect(mapStateToProps)(Content));
