import React from "react";
import { List, ListItem, Button, Typography, ListItemText, IconButton, 
    ListItemSecondaryAction, withStyles, TextField, Box } from "@material-ui/core";

import UserInfo from "./UserInfo";

import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';

import "../../assets/stylesheets/CommentSection.css"

// Positioning the comments and its buttons to provide gaps from other elements
const styles = {
    editDelete: {
        top: "85%",
        right: 0
    },
    removePadding: {
        paddingLeft: 8,
        paddingRight: 8,
        alignItems: "stretch"
    }
};

/**
 *  A component that render a list of Comments for a specific Task
 * 
 *  Props:
 *      users, tags
 * 
 *      user, task_id
 */
class CommentSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            newComment: "",
            editingCommentID: -1,
            editedComment: "",
        }
    }

    // Retrieve comments that belong to this Task, ordered by its ID
    fetchComments = () => {
        let bearer = "Bearer " + localStorage.getItem("jwt");
        
        fetch("/api/comments", {
          method: "GET",
          withCredentials: true,
          credentials: "include",
          headers: {
            "Authorization": bearer,
            "Content-Type": "application/json"
          }
        })
        .then(async(response) => {
          return response.json();
        })
        .then(result => {
          let filteredResult =  result.filter(comment => {return comment.task_id === parseInt(this.props.task_id);});
          filteredResult = filteredResult.sort((first, second) => first.id > second.id);

          this.setState({comments: filteredResult});
        })
    }

    componentDidMount() {
        this.fetchComments();
    }

    // Add a new comment to the database
    handleAdd = () => {
        let bearer = "Bearer " + localStorage.getItem("jwt");

        const addComment = async() => {
            const response = await fetch("/api/comments", {
                method: "POST",
                withCredentials: true,
                credentials: "include",
                headers: {
                    "Authorization": bearer,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({comment: {
                    "user_id": this.props.user.id,
                    "task_id": this.props.task_id,
                    "body": this.state.newComment
                }})
            });

            if(response.status === 201) {
                this.setState({newComment: ""});
                this.fetchComments();
            }
        }

        addComment();
    }

    handleEdit = comment => {
        this.setState({editingCommentID: comment.id, editedComment: comment.body});
    }

    // Save the changes made to a comment
    handleSave = () => {
        let bearer = "Bearer " + localStorage.getItem("jwt");

        const saveComment = async() => {
            const response = await fetch("/api/comments/" + this.state.editingCommentID, {
                method: "PATCH",
                withCredentials: true,
                credentials: "include",
                headers: {
                    "Authorization": bearer,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({comment: {
                    "user_id": this.props.user.id,
                    "task_id": this.props.task_id,
                    "body": this.state.editedComment
                }})
            })

            if(response.status === 200) {
                this.setState({editingCommentID: -1, editedComment: ""});
                this.fetchComments();
            }
        }

        saveComment();
    }

    handleCancel =  () => {
        this.setState({editingCommentID: -1, editedComment: ""});
    }

    // Erase deleted comment from the database
    handleDelete = comment => {
        let bearer = "Bearer " + localStorage.getItem("jwt");

        const deleteComment = async() => {
            const response = await fetch("/api/comments/" + comment.id, {
                method: "DELETE",
                withCredentials: true,
                credentials: "include",
                headers: {
                    "Authorization": bearer,
                    "Content-Type": "application/json",
                }
            });

            if(response.status === 204) {
                this.fetchComments();
            }
        }

        deleteComment();
    }
    
    render() {
        const { classes } = this.props;

        return (
            <div>
                <div id="commentSection_title">
                    <Typography id="titleText" variant="h6">
                        Comments
                    </Typography>
                </div>

                <br />

                <Box id="commentSection_box" borderRadius={8} style={{maxWidth: "700px"}}>
                    <List>
                        {
                           this.state.comments.map(comment => (
                                <ListItem className="comment" key={comment.id} divider={true} classes={{ root: classes.removePadding }}>
                                    {/* Comment text */}
                                    <ListItemText
                                        style={{textAlign:"justify"}}
                                        primary={
                                            <div className="comment_userDate">
                                                <UserInfo user={this.props.users[comment.user_id - 1]} textVariant="h6"/>
                                                <Typography> 
                                                    {new Date(comment.updated_at).toLocaleDateString("en-GB", {
                                                        weekday: "short", 
                                                        year: "numeric", 
                                                        month: "short", 
                                                        day: "numeric", 
                                                        hour: "numeric", 
                                                        minute: "numeric", 
                                                        hour12: true})} 
                                                </Typography>
                                            </div>
                                        }
                                        secondary={
                                            this.state.editingCommentID !== comment.id ? comment.body : null
                                    } />

                                    {/* When the user is editing the comment, render a Textfield loaded with the comment and its buttons  */}
                                    {
                                        this.state.editingCommentID === comment.id
                                            ? <div>
                                                <TextField className="comment_editField" autoFocus={true} fullWidth={true} value={this.state.editedComment} onChange={event => {this.setState({editedComment: event.target.value})}} multiline={true} size="small" variant="outlined" />
                                                <div className="comment_saveCancel">
                                                    <Button variant="outlined" onClick={this.handleSave}>
                                                        Save
                                                    </Button>
                                                    <Button variant="outlined" onClick={this.handleCancel}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                            : null
                                    }

                                    {/* Render edit & delete buttons if the comment is posted by the user or the user has admin right */}
                                    {
                                        this.props.user.admin || (parseInt(this.props.user.id) === comment.user_id && this.state.editingCommentID === -1)
                                            ? <ListItemSecondaryAction classes={{ root: classes.editDelete }}>
                                                  <IconButton size="small" onClick={() => this.handleEdit(comment)}>
                                                      <CreateIcon />
                                                  </IconButton>
                                                  <IconButton size="small" onClick={() => this.handleDelete(comment)}>
                                                      <DeleteIcon />
                                                  </IconButton>
                                              </ListItemSecondaryAction>
                                            : null
                                    }
                                </ListItem>
                           ))
                        }
                    </List>
                </Box>

                <br />

                {/* Form for posting new comment */}
                <div id="commentSection_input">
                    <Typography variant="h6">
                        Post new comment:
                    </Typography>
                    
                    <TextField 
                        id="commentSection_newField" 
                        multiline
                        fullWidth 
                        size="small" 
                        rows={5}
                        variant="outlined" 
                        value={this.state.newComment} 
                        onChange={event => {this.setState({newComment: event.target.value})}} 
                    />
                    
                    <div id="commentSection_submitButton">
                        <Button variant="outlined" onClick={this.handleAdd}>
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(CommentSection);