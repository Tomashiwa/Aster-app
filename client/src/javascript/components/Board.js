import React from "react";

import TaskIndex from "./TaskIndex"

import "../../assets/stylesheets/Board.css"

/**
 * A component that manages four TaskIndex and provide them with their respective tasks 
 * 
 * Props:
 *      id, tasks, lists, users, tags
 *      
 *      user
 *      
 *      filterTagId, filterSearchTerm, fetchTasks
 *      
 *      onUpdateTags
 */
class Board extends React.Component {
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
                                    users={this.props.users}
                                    tags={this.props.tags}
                                    lists={this.props.lists}
                                    /**
                                     * Provide only tasks that fulfill the following conditions
                                     *      1. Belongs to this List
                                     *      2. Owned by current User  OR current User has admin rights
                                     *      3. Matches the filter tag OR search text
                                     *  */ 
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
                                    list={list}                                
                                    filterTagId={this.props.filterTagId} 
                                    fetchTasks={this.props.fetchTasks} 
                                    onUpdateTags={this.props.onUpdateTags} />
                            </article>
                        )
                    }
                    
                </section>
            </div>
        );
    }
}

export default Board;