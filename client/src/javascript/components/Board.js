import React from "react";

import TaskIndex from "./TaskIndex"

import "../../assets/stylesheets/Board.css"
// import "./styles/Board.css"

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tagFilterId: -1
        };
    }

    render() {
        const listsOwned = this.props.lists.filter(list => list.board_id === this.props.id);

        return (
            <div>
                <section>
                    {
                        listsOwned.map(list => 
                            <article key={list.id}>
                                <TaskIndex 
                                    board_id={this.props.id} 
                                    lists={this.props.lists}
                                    list={list}
                                    tasks={this.props.tasks.filter(task => {
                                        const listIndex = (this.props.id - 1) <= 0 
                                            ? list.id
                                            : parseInt(list.id) - (4 * (parseInt(this.props.id - 1))); 

                                        const task_listIndex = parseInt(task.list_id) - (4 * (parseInt(this.props.lists.find(searchedList => searchedList.id === task.list_id).board_id - 1)));
                                        const hasViewRight = listIndex === task_listIndex;

                                        const hasPassFilter = this.props.filterTagId > 1
                                            ? parseInt(this.props.filterTagId) === task.tag_id
                                            : true;

                                        const hasPassSearch = this.props.filterSearchTerm !== ""
                                            ? task.title.toLowerCase().includes(this.props.filterSearchTerm.toLowerCase()) 
                                                || task.description.toLowerCase().includes(this.props.filterSearchTerm.toLowerCase())
                                            : true;

                                        return hasViewRight && hasPassFilter && hasPassSearch;
                                    })}
                                    user={this.props.user}
                                    users={this.props.users}
                                    tags={this.props.tags} 
                                    filterTagId={this.props.filterTagId} 
                                    onUpdateTags={this.props.onUpdateTags}
                                    fetchTasks={this.props.fetchTasks} />
                            </article>
                        )
                    }
                    
                </section>
            </div>
        );
    }
}

export default Board;