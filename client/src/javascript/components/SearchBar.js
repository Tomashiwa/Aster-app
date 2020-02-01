import React from "react";
import { IconButton, InputBase } from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";

import "./styles/SearchBar.css"

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.keyPress = this.keyPress.bind(this);
    }

    keyPress(e){
        if(e.keyCode == 13){
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
                    onKeyDown={this.keyPress}
                />
                <IconButton onClick={this.props.onSearch}>
                    <SearchIcon />
                </IconButton>
            </div>
        );
    }
}

export default SearchBar;