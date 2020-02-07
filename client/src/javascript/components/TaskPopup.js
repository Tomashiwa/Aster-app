import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, Box, Typography } from "@material-ui/core";

import TagSelect from "./TagSelect";
import ParticipantList from "./ParticipantList";
import CommentSection from "./CommentSection";

import "../../assets/stylesheets/TaskPopup.css"

/**
 * A component that provides the full details of the selected Task including
 *      1. Basic information (eg. Title, Tags and Due-date)
 *      2. Comments
 *      3. Participants
 * 
 * Props:
 *      users, tags
 * 
 *      user, selectedTask
 * 
 *      fetchTasks, refreshSelected, deleteSelf
 * 
 *      newTagId, isOpened
 * 
 *      onTagChange, onConfirm, onClose
 */
class TaskPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasChanged: false
        };
    }

    handleTagChange = event => {
        this.props.onTagChange(event);
        this.setState({hasChanged: true});
    }

    handleConfirmChange = () => {
        this.props.onConfirm();
        this.setState({hasChanged: false});
    }

    // Add a new participant to this Task
    addParticipant = (userId, callback) => {
        let bearer = "Bearer " + localStorage.getItem("jwt");

        const addParti = async() => {
            const response = await fetch("/api/tasks/" + this.props.selectedTask.id, {
                method: "PATCH",
                withCredentials: true,
                credentials: "include",
                headers: {
                  "Authorization": bearer,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({task: {
                    "title": this.props.selectedTask.title,
                    "description": this.props.selectedTask.description,
                    "tag_id": this.props.selectedTask.tag_id,
                    "due_date": this.props.selectedTask.due_date,
                    "participants": this.props.selectedTask.participants.concat([userId])
                }})
            });

            // Retrieve the task again to update the Task's information
            if(response.status === 200) {
                this.props.fetchTasks(() => this.props.refreshSelected(this.props.selectedTask, callback));
            }
        }

        addParti();
    }

    // Remove a participant from this Task
    deleteParticipant = (userId, callback) => {
        let bearer = "Bearer " + localStorage.getItem("jwt");

        const deleteParti = async() => {
            if(this.props.selectedTask.participants.length > 1) {
                const response = await fetch("/api/tasks/" + this.props.selectedTask.id, {
                    method: "PATCH",
                    withCredentials: true,
                    credentials: "include",
                    headers: {
                      "Authorization": bearer,
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({task: {
                        "title": this.props.selectedTask.title,
                        "description": this.props.selectedTask.description,
                        "tag_id": this.props.selectedTask.tag_id,
                        "due_date": this.props.selectedTask.due_date,
                        "participants": this.props.selectedTask.participants.filter(participant => {return participant !== userId})
                    }})
                });
    
                // Retrieve the task again to update the Task's information
                if(response.status === 200) {
                    this.props.fetchTasks(() => this.props.refreshSelected(this.props.selectedTask, callback));
                }
            } else {
                this.props.deleteSelf();
            }
        }

        deleteParti();
    }

    render() {
        return(
            <Dialog id="popup" fullWidth={true} maxWidth={"md"} open={this.props.isOpened} onClose={this.props.onClose} 
                PaperProps={{ style: {
                    backgroundImage: "linear-gradient(to bottom, #e2a3ad, #ffe4e1)",
                    minWidth: "700px"
                }}}
            >
                <DialogTitle>
                    <Box id="titleDateBox" borderRadius={8} fontWeight="fontWeightBold">
                        <div id="title">
                            {this.props.selectedTask.title}
                        </div>

                        <div id="date">
                            {/* Provide a more extended format of due-date */}
                            { new Date(this.props.selectedTask.due_date).toLocaleDateString("en-GB", {
                                weekday: "short", 
                                year: "numeric", 
                                month: "short", 
                                day: "numeric", 
                                hour: "numeric", 
                                minute: "numeric", 
                                hour12: true})}
                        </div>                        
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Box id="description" borderRadius={8}>
                        <DialogContentText id="description_text">
                            {this.props.selectedTask.description}
                        </DialogContentText>
                    </Box>

                    <br />

                    <div id="comments_tags_participants">
                        <div id="comments">
                            <CommentSection 
                                users={this.props.users} 
                                tags={this.props.tags} 
                                user={this.props.user} 
                                task_id={this.props.selectedTask.id}/>
                        </div>

                        <div id="tags_participants">
                            <Typography variant="h6">
                                Tags
                            </Typography>
                            <Box id="tags" borderRadius={8}>
                                {
                                    // Only Task owner can modify the Task's tag
                                    this.props.user.id === this.props.selectedTask.participants[0]
                                        ? <TagSelect tags={this.props.tags} tag_id={this.props.newTagId} onChange={this.handleTagChange} />                    
                                        : <div> {this.props.tags[this.props.newTagId - 1].name} </div> 
                                }
                            </Box>
                            <div id="participants">
                                <ParticipantList 
                                    users={this.props.users} 
                                    user={this.props.user} 
                                    task={this.props.selectedTask} 
                                    onAdd={this.addParticipant} 
                                    onDelete={this.deleteParticipant}/>                            
                            </div>
                            <div id="confirmClose">
                                {/* Save the changes for select a new Tag */}
                                <Button id="confirmClose_confirm" variant="outlined" disabled={!this.state.hasChanged} onClick={this.handleConfirmChange}>
                                    Confirm Changes
                                </Button>
                                <Button variant="outlined" onClick={this.props.onClose}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}

export default TaskPopup;