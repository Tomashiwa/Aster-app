import React from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

import TagSelect from "./TagSelect";

import '../../assets/stylesheets/AddEditPopup.css'

class AddEditPopup extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        newTag: ""
      }
    }

    handleKeyPress = (event) => {
      if(event.key == "Enter") {
        this.props.onAddTag();
      }
    }

    render() {
        return(
            <Dialog fullWidth={true} maxWidth={"sm"} open={this.props.isOpened} onClose={this.props.onClose} aria-labelledby="form-dialog-title"
                PaperProps={{ style: {
                  backgroundImage: "linear-gradient(to bottom, #e2a3ad, #ffe4e1)"
              }}}
            >
                <DialogTitle id="addEdit_title">
                  {this.props.isAdding ? "Create new task" : "Edit task"}
                </DialogTitle>
                
                <DialogContent>
                  <Box id="addEdit_content" borderRadius={8}>
                    <TextField 
                      id="addEdit_titleField" 
                      autoFocus 
                      required={true} 
                      margin="dense"
                      label="Title" 
                      fullWidth 
                      defaultValue={this.props.selectedTask ? this.props.selectedTask.title : this.props.newTitle}/>

                    <div id="addEdit_dateTags">
                      <MuiPickersUtilsProvider id="addEdit_date" utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                          required={true}
                          ampm={false}
                          showTodayButton
                          value={this.props.newDueDate}
                          onChange={this.props.onDateChange}
                          format="dd/MM/yyyy HH:mm"
                          label="Due date"
                        />
                      </MuiPickersUtilsProvider>

                      {
                        this.props.isAddingTag
                          ? <div id="addEdit_tags_new">
                              <TagSelect tags={this.props.tags} tag_id={this.props.newTagId} onChange={this.props.onTagChange} />  
                              <div id="addEdit_tags_newBox">
                                <TextField 
                                  id="addEdit_newTag" 
                                  label="New Tag" 
                                  margin="dense"
                                  value={this.state.newTag}
                                  inputProps={{ maxLength: 20 }}
                                  error={this.state.newTag.length <= 2}
                                  helperText={"Must be more than 2 characters."} 
                                  onChange={input => this.setState({newTag: input.target.value})}
                                  onKeyPress={this.handleKeyPress}
                                />
                                {
                                  this.state.newTag.length <= 2
                                  ? null
                                  : <IconButton size="small" onClick={this.props.onAddTag}>
                                      <DoneIcon />
                                  </IconButton> 
                                }
                                <IconButton size="small" onClick={this.props.onCancelTag}>
                                  <CloseIcon />
                                </IconButton> 
                              </div> 
                          </div>
                          : <div id="addEdit_tags_choosing">
                              <TagSelect tags={this.props.tags} tag_id={this.props.newTagId} onChange={this.props.onTagChange} />
                              <IconButton onClick={this.props.onNewTag}>
                                <AddIcon />
                              </IconButton>
                          </div>
                      }
                    </div>
                    
                    <div id="addEdit_descriptionBox">
                      <TextField
                        id="addEdit_descriptionField" 
                        multiline 
                        required={true} 
                        margin="dense" 
                        label="Description" 
                        fullWidth 
                        rows={15}
                        defaultValue={this.props.selectedTask ? this.props.selectedTask.description : this.props.newDescription} />
                    </div>
                  </Box>
                </DialogContent>

                <DialogActions id="addEdit_buttons">
                  {
                    this.props.isAdding
                      ? <Button
                          variant="outlined"
                          onClick={() => this.props.onSubmit(document.getElementById("addEdit_titleField").value, document.getElementById("addEdit_descriptionField").value)} 
                        >
                          Submit
                        </Button>
                      : <Button
                          variant="outlined"
                          onClick={() => this.props.onConfirm(document.getElementById("addEdit_titleField").value, document.getElementById("addEdit_descriptionField").value)()}
                        >
                          Confirm
                        </Button>
                  }

                  <Button variant="outlined" onClick={this.props.onClose}>
                    Cancel
                  </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AddEditPopup;