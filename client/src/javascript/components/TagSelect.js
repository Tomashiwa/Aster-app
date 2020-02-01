import React from "react";
import { Select, FormControl, MenuItem, InputLabel } from "@material-ui/core";

class TagSelect extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <FormControl style={{display:'flex'}}>
              <Select
                labelId="select_new_labelId"
                id="select_add_tag"
                value={this.props.tag_id}
                onChange={this.props.onChange}
                required={true}
                autoWidth={true}
              >
                {
                  this.props.tags.map(tag => 
                    <MenuItem key={tag.id} value={tag.id}>{tag.name}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
        );
    }
}

export default TagSelect;