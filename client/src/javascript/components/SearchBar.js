import React from "react";
import { IconButton, InputBase } from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";

import "../../assets/stylesheets/SearchBar.css"

class SearchBar extends React.Component {
    handleKeyPress = (event) => {
        if(event.keyCode === 13){
           this.props.onSearch();
        }
    }  

    render() {
        return(
            <div id="searchBar">
                <InputBase
                    placeholder="Search..."
                    inputProps={{ "aria-label": "search"}}
                    onChange={this.props.onTermChange}
                    onKeyDown={this.handleKeyPress}
                />
                <IconButton onClick={this.props.onSearch}>
                    <SearchIcon />
                </IconButton>
            </div>
        );
    }
}

export default SearchBar;