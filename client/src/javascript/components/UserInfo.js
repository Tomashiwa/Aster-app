import React from "react";
import { Typography } from "@material-ui/core";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import "../../assets/stylesheets/UserInfo.css"

/**
 * A component that display the current user's name and logo
 * 
 * Props:
 *      user
 */
class UserInfo extends React.Component {
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