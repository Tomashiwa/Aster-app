import React from "react";
import { List, ListItem, IconButton, Typography, Select, FormControl, MenuItem, InputLabel, Box, ListItemSecondaryAction } from "@material-ui/core";

import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

import UserInfo from "./UserInfo";

import "./styles/ParticipantList.css"

class ParticipantList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdding: false,
            participants: [],
            potentialParticipants: [],
            newPartiId: 1,
            hovered: null
        }
    }

    componentDidMount() {
        this.setState({participants: this.props.task.participants});
    }

    handleClick = () => {
        const potentialParticipants = this.props.users.filter(user => {return (this.state.participants.filter(participant => {return parseInt(user.id) === participant}).length === 0 && !user.admin)});

        this.setState({
            isAdding: true, 
            potentialParticipants: potentialParticipants,
            newPartiId: potentialParticipants[0].id
        });
    }

    handlePartiChange = (event, index, value) => {
        this.setState({newPartiId: event.target.value});
    }

    refreshParticipants = () => {
        this.setState({participants: this.props.task.participants});
    }
    
    handleAdd = () => {
        this.props.onAdd(this.state.newPartiId, this.refreshParticipants);
        this.handleClose();
    }

    handleDelete = (participant) => {
        this.props.onDelete(participant, this.refreshParticipants);
        this.handleClose();
    }

    handleClose = () => {
        this.setState({isAdding: false, potentialParticipants: []});
    }

    handleEnterHover = (value) => {
        this.setState({hovered: value});
    }

    handleExitHover = () => {
        this.setState({hovered: null});
    }

    render() {
        return (
            <div>
                <Typography id="title" variant="h6">
                    Participants
                </Typography>

                <br />

                <Box id="listBox" borderRadius={8}>
                    <List dense={true} disablePadding={true}>
                    {
                        this.state.participants.map((participant) => {
                        return (
                            <ListItem 
                            key={participant} 
                            divider={true} 
                            disableGutters={true} 
                            onMouseOver={() => this.handleEnterHover(participant)} 
                            onMouseLeave={() => this.handleExitHover()}>
                                <UserInfo user={this.props.users.filter(user => {return parseInt(user.id) === participant;})[0]} />
                                {
                                    this.state.hovered === participant && (this.props.user.admin || parseInt(this.props.user.id) === this.state.participants[0] || parseInt(this.props.user.id) === participant)
                                    ? <ListItemSecondaryAction>
                                            <IconButton size="small" onClick={() => this.handleDelete(participant)}>
                                                <CloseIcon />
                                            </IconButton>
                                    </ListItemSecondaryAction>
                                    : null
                                }
                            </ListItem>
                        )
                        })
                    }

                    {
                        this.state.isAdding && this.state.potentialParticipants.length >= 1
                            ? <ListItem id="addPart_item" key={this.props.users.length + 1} disableGutters={true}>
                                <FormControl style={{display: "flex"}}>
                                    <Select
                                        labelId="select_new_partId"
                                        id="select_new_part"
                                        value={this.state.newPartiId}
                                        onChange={this.handlePartiChange}
                                    >
                                        {
                                            this.state.potentialParticipants.map(potentialParticipant =>
                                                <MenuItem key={potentialParticipant.id} value={potentialParticipant.id}>{potentialParticipant.name}</MenuItem>
                                            )
                                        }
                                    </Select>
                                </FormControl>
                                <IconButton size="small" onClick={this.handleAdd}>
                                    <DoneIcon />
                                </IconButton>
                                <IconButton size="small" onClick={this.handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </ListItem> 

                            : parseInt(this.props.user.id) === this.state.participants[0] && this.props.users.length > this.state.participants.length
                                ? <ListItem id="addPart_button" key={this.props.users.length + 1} disableGutters={true}>
                                    <IconButton id="addPart_icon" onClick={this.handleClick}>
                                        <AddIcon />
                                    </IconButton>
                                </ListItem>
                                : null
                    }
                    </List>
                </Box>
            </div>
        );
    }
}

export default ParticipantList;