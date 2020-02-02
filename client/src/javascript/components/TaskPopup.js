import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, Box } from "@material-ui/core";

import TagSelect from "./TagSelect";
import ParticipantList from "./ParticipantList";
import CommentSection from "./CommentSection";

import "../../assets/stylesheets/TaskPopup.css"
// import "./styles/TaskPopup.css"

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

            if(response.status === 200) {
                this.props.fetchTasks(() => this.props.refreshSelected(this.props.selectedTask, callback));
            }
        }

        addParti();
    }

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
                    <Box id="titleDateTagsBox" borderRadius={8}>
                        <div id="titleDate">
                            <div id="title">
                                {this.props.selectedTask.title}
                            </div>
                            <div id="date">
                                {"Due by: " + new Date(this.props.selectedTask.due_date).toLocaleDateString("en-GB", {
                                    weekday: "short", 
                                    year: "numeric", 
                                    month: "short", 
                                    day: "numeric", 
                                    hour: "numeric", 
                                    minute: "numeric", 
                                    hour12: true})}
                            </div>
                        </div>
                        <div id="tags">
                            <TagSelect tags={this.props.tags} tag_id={this.props.newTagId} onChange={this.handleTagChange} />                    
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
                            <CommentSection user={this.props.user} users={this.props.users} tags={this.props.tags} task_id={this.props.selectedTask.id}/>
                        </div>

                        <div id="tags_participants">
                            <div id="participants">
                                <ParticipantList task={this.props.selectedTask} user={this.props.user} users={this.props.users} onAdd={this.addParticipant} onDelete={this.deleteParticipant}/>                            </div>
                            <div id="confirmClose">
                                <Button variant="outlined" disabled={!this.state.hasChanged} onClick={this.props.onConfirm}>
                                    Confirm Changes
                                </Button>
                                <br></br>
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