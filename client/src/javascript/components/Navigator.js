import React from "react";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import { Typography } from "@material-ui/core";

import UserInfo from "./UserInfo";
import TagSelect from "./TagSelect";    
import SearchBar from "./SearchBar";

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import "../../assets/stylesheets/Navigator.css"

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
            <AppBar id="navBar" position="static">
                <Toolbar>
                    <UserInfo user={this.props.user} textVariant="h6"/>

                    <IconButton id="logOut" onClick={this.props.onLogout}>
                        <ExitToAppIcon />
                    </IconButton>

                    <div id="searchFilter">
                        {/* <Typography> Filter by </Typography> */}
                        <TagSelect tags={this.props.tags} tag_id={this.props.filterTagId} onChange={this.props.onFilter} />
                        <SearchBar onTermChange={this.onTermChange} onSearch={() => this.props.onSearch(this.state.searchTerm)} />
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

export default Navigator;