import React from 'react';

import RegisterLoginPopup from "./javascript/components/RegisterLoginPopup";
import Navigator from "./javascript/components/Navigator";
import Board from "./javascript/components/Board"

import logo from './assets/images/logo.png';

import './assets/stylesheets/App.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      boards: [],
      lists: [],
      tasks: [],
      tags: [],
      user: null,
      board: 1,
      filterTagId: 1,
      filterSearchTerm: "",
      errorMsg: ""
    };
  }

  componentDidMount() {
    // Auto-logout user if their user token expires
    if(localStorage.getItem("name") === null || localStorage.getItem("jwt") === null) {
      localStorage.clear();
      this.setState({});
    }

    // Retrieve data of user that is still logged in
    if(localStorage.getItem("jwt") !== null) {
      this.fetchAll(localStorage.getItem("name"));
    }
  }

  onFilter = (event) => {
    this.setState({filterTagId: event.target.value});
  }

  onSearch = (searchTerm) => {
    this.setState({filterSearchTerm: searchTerm});
  }

  /**
   * Login with the given account
   * 
   * Param:
   *    givenName - Username
   *    givenPassword - Password
   *    callback - A function that will be called when login succeed
   */
  onLogin = (givenName, givenPassword, callback) => {
    const request = {"auth": {"name": givenName, "password": givenPassword}};

    const attemptLogin = async() => {
      fetch("/api/user_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/vnd.api+json",
        },  
        body: JSON.stringify(request)
      })
      .then(response => {
        return response.status === 201 ? response.json() : null;
      })
      .then(result => {
        if(result !== null) {
          localStorage.setItem("name", givenName);
          localStorage.setItem("jwt", result.jwt);
          this.fetchAll(givenName);
          callback();
        } else {
          this.setState({errorMsg: "Invalid username or password."});
        }
      })
    }

    attemptLogin();
  }

  // Reset the App's state when user logout 
  onLogout = () => {    
    localStorage.clear();
    this.setState({
      users: [],
      boards: [],
      lists: [],
      tasks: [],
      tags: [],
      user: null
    });
  }

  /**
   * Submit a new account onto the database
   * Param:
   *    givenName - Username
   *    givenPassword - Password
   *    callback - A function that will be called when the submit succeed
   */
  onRegister = (givenName, givenPassword, callback) => {
    fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({user: {
        "name": givenName,
        "password": givenPassword,
        "password_confirmation": givenPassword,
        "admin": false
      }})
    })
    .then(async(response) => {
      const responseJson = await response.json();
      return [response.status, responseJson];
    })
    .then(result => {
      if(result[0] === 201) {
        this.onLogin(givenName, givenPassword, callback);
      } else {
        const errorMessage = result[1];
        this.setState({errorMsg: errorMessage[Object.keys(errorMessage)[0]][0] + "."});
      }
    })
  }

  /**
   * Fetch the data sequentially
   * 
   * Param:
   *    name - Name of the current user
   */
  // Fetch the data sequentially
  fetchAll = async(name) => {
    this.fetchUsers(name, 
      () => this.fetchBoards(
        () =>this.fetchLists(
          () =>this.fetchTags(
            () =>this.fetchTasks()))));
  }

  /**
   * Retrieve the users from the database
   * 
   * Param:
   *    name - Name of the current user
   *    callback - A function that will be called when retrieving succeed
   * */ 
  fetchUsers = (name, callback) => {
    let bearer = "Bearer " + localStorage.getItem("jwt");

    fetch("/api/users", {
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
      this.setState({users: result, user: result.filter(user => user.name === name)[0]}, callback);
    })
  }

  /**
   *  Retrieve Boards from the database and locate the board owned by the user
   * 
   *  Param:
   *    callback - A function that will be called when retrieving succeed
   */
  fetchBoards = (callback) => {
    let bearer = "Bearer " + localStorage.getItem("jwt");

    fetch("/api/boards", {
      method: "GET",
      withCredentials: true,
      credentials: "include",
      headers: {
        "Authorization": bearer,
        "Content-Type": "application/json"
      }
    })
    .then(async(response) => {
      if(response.status === 401) {
        localStorage.clear();
        this.setState({});
        return;
      }
      
      return response.json();
    })
    .then(result => {
      if(result != null) {
        this.setState({
          boards: result,
          board: result.filter(board => board.user_id === this.state.user.id)[0]
        }, callback);
      }
    })
  }

  /**
   *  Retrieve Lists from the database
   * 
   *  Param:
   *    callback - A function that will be called when retrieving succeed
   */
  fetchLists = (callback) => {
    let bearer = "Bearer " + localStorage.getItem("jwt");

    fetch("/api/lists", {
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
      this.setState({lists: result}, callback);
    })
  }

  /**
   *  Retrieve Tags from the database
   * 
   *  Param:
   *    callback - A function that will be called when retrieving succeed
   */
  fetchTags = (callback) => {
    let bearer = "Bearer " + localStorage.getItem("jwt");

    fetch("/api/tags", {
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
      this.setState({tags: result}, callback);
    })
  }
  
  /**
   *  Retrieve Tasks from the database
   * 
   *  Param:
   *    callback - The function that will be called when retrieving succeed
   */
  fetchTasks = (callback) => {
    let bearer = "Bearer " + localStorage.getItem("jwt");

    fetch("/api/tasks", {
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
      this.setState({tasks: result}, callback);
    })
  }

  render() {
    return (
      this.state
        ? <div className="App"> 
            <img className="Logo" src={logo} alt="logo" width="250" height="90" />

            <div className="Navigator">
              {
                this.state.users && this.state.tags
                  ? <Navigator 
                      tags={this.state.tags} 
                      user={this.state.user} 
                      filterTagId={this.state.filterTagId} 
                      onLogout={this.onLogout} 
                      onFilter={this.onFilter} 
                      onSearch={this.onSearch} />
                  : null              
              }
            </div>

            <br />

            <div className="Board">
              {
                this.state.users && this.state.lists && this.state.tags && this.state.tags
                  ? <Board 
                      id={this.state.board.id} 
                      tasks={this.state.tasks} 
                      lists={this.state.lists} 
                      users={this.state.users} 
                      tags={this.state.tags} 
                      user={this.state.user} 
                      filterTagId={this.state.filterTagId} 
                      filterSearchTerm={this.state.filterSearchTerm}
                      fetchTasks={this.fetchTasks}  
                      onUpdateTags={this.fetchTags} />
                  : null
              }
            </div>
            
            <RegisterLoginPopup 
              isOpened={localStorage.getItem("jwt") === null}
              errorMsg={this.state.errorMsg}
              resetErrorMsg={() => this.setState({errorMsg: ""})}               
              onRegister={this.onRegister}
              onLogin={this.onLogin}
            />
          </div>
        : <div>LOADING...</div>
    );
  }
}

export default App;
