import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, 
    TextField } from "@material-ui/core";

import "../../assets/stylesheets/RegisterLoginPopup.css"

/**
 *  A component that provide a form for registering and logining
 *  
 *  Props:
 *      isOpened
 * 
 *      errorMsg, resetErrorMsg
 * 
 *      onRegister, onLogin
 */
class RegisterLoginPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRegistering: false,
            newName: "",
            newPassword: ""
        }
    }

    resetForm = () => {
        this.props.resetErrorMsg();
        this.setState({
            isRegistering: false,
            newName: "",
            newPassword: ""
        })
    }

    handleRegister = async() => {
        await this.props.onRegister(this.state.newName, this.state.newPassword, this.resetForm);
    }

    handleLogin = async() => {
        await this.props.onLogin(this.state.newName, this.state.newPassword, this.resetForm);
    }

    handleSwitch = () => {
        this.props.resetErrorMsg();
        this.setState({
            isRegistering: !this.state.isRegistering,
            newName: "",
            newPassword: ""
        })
    }
    
    // Capture pressing "enter" event
    handleKeyPress = (event) => {
        if(event.key === "Enter") {
            this.state.isRegistering 
                ? this.handleRegister()
                : this.handleLogin();                
        }
    }
 
    render() {
        return (
            // Based on the boolean property, isRegistering, elements within the dialog will be swapped 
            <Dialog open={this.props.isOpened} onClose={this.props.onClose}
                PaperProps={{ style: {
                    backgroundImage: "linear-gradient(to bottom, #e2a3ad, #ffe4e1)"
                }}}
            >
                <DialogTitle id="title">
                    {this.state.isRegistering ? "Create an account" : "Login"}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        {this.state.isRegistering ? "Please fill in your account details" : "Kindly login with your account:"}
                    </DialogContentText>

                    <TextField 
                        id="field_name" 
                        label="Username" 
                        margin="dense" 
                        required 
                        autoFocus 
                        fullWidth 
                        value={this.state.newName}
                        inputProps={{ maxLength: 16 }}
                        error={this.props.errorMsg !== ""}
                        // Display error messages based on previous submit (eg. wrong username or password)
                        helperText={this.props.errorMsg}
                        onChange={input => this.setState({newName: input.target.value})} 
                    />
                    <TextField 
                        id="field_password" 
                        label="Password" 
                        type="password" 
                        margin="dense" 
                        required 
                        fullWidth
                        value={this.state.newPassword} 
                        inputProps={{ maxLength: 20 }}
                        onChange={input => this.setState({newPassword: input.target.value})}
                        onKeyPress={this.handleKeyPress} 
                    />                    
                
                    <br /><br />

                    {
                        <div className="buttonArea">
                            <Button variant="outlined" onClick={this.state.isRegistering ? this.handleRegister : this.handleLogin}>
                                {this.state.isRegistering ? "Confirm" : "Login"}
                            </Button>
                            <Button variant="outlined" onClick={this.handleSwitch}>
                                {this.state.isRegistering ? "Sign in" : "Sign up"}
                            </Button>                            
                        </div>
                    }
                </DialogContent>
            </Dialog>
        );
    }
}

export default RegisterLoginPopup;