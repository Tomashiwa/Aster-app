import React from "react";
import { Typography } from "@material-ui/core";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import "./styles/UserInfo.css"

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let UsernameComponent = this.props.user 
            ? <Typography className="userName" variant={this.props.textVariant} noWrap> {this.props.user.name} </Typography>
            : null;

        return(
            <div className="userInfo">
                <AccountCircleIcon className="userIcon"/>
                {UsernameComponent}
            </div>
        );
    }
}

export default UserInfo;