import React from "react";
import { Select, FormControl, MenuItem } from "@material-ui/core";

/**
 * A component that provide a list of Tags to be selected and returns the selected one
 * 
 * Props:
 *    tags tag_id
 *    
 *    onChange
 */
class TagSelect extends React.Component { 
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
                    <MenuItem key={tag.id} value={tag.id} styles={{ ListItem: {alignItems: 'center'}}}>{tag.name}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
        );
    }
}

export default TagSelect;