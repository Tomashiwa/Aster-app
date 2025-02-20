import React from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";

import UserInfo from "./UserInfo";
import TagSelect from "./TagSelect";    
import SearchBar from "./SearchBar";

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import "../../assets/stylesheets/Navigator.css"

/**
 *  A component that serve as the nagivation bar of this app
 *  Provides the user to log-out and filter their tasks
 * 
 *  Props:
 *      tags
 *      
 *      user, filterTagId
 * 
 *      onLogout, onFilter, onSearch
 */
class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: ""
        };
    }

    onTermChange = (event) => {
        this.setState({searchTerm: event.target.value});
    }

    render() {
        return( 
            <AppBar id="navigator_bar" position="static">
                <Toolbar>
                    <UserInfo user={this.props.user} textVariant="h6"/>

                    <IconButton id="navigator_logOut" onClick={this.props.onLogout} disableRipple={true}>
                        <ExitToAppIcon />
                    </IconButton>

                    <div id="navigator_searchFilter">
                        <Typography> Filter by </Typography>
                        <div style={{marginLeft: "10px", marginRight: "15px"}}>
                            <TagSelect tags={this.props.tags} tag_id={this.props.filterTagId} onChange={this.props.onFilter} />
                        </div>
                        <SearchBar onTermChange={this.onTermChange} onSearch={() => this.props.onSearch(this.state.searchTerm)} />
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

export default Navigator;