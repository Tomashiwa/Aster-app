class Api::TasksController < ApiController
    before_action :authenticate_user
    before_action :set_task, only: [:show, :update, :destroy]

    #GET /tasks
    def index
        if current_user.admin?
            @tasks = Task.all
        else
            @board = Board.where(:user_id => current_user.id).first

            if(@board != nil) 
                @tasks = Task.where("?=ANY(participants)", current_user.id)
            else
                @tasks = []
            end
        end

        render json: @tasks
    end

    #GET /tasks/#
    def show
        render json: @task
    end

    #POST /task
    def create
        @task = Task.new(task_params)

        if @task.save
            render json: @task, status: :created
        else
            render json: @task.errors, status: :unprocessable_entity
        end
    end

    #PATCH/PUT /tasks/#
    def update
        if @task.update(task_params)
            render json: @task, status: :ok
        else
            render json: @task.errors, status: :unprocessable_entity
        end
    end

    #DELETE /chekis/#
    def destroy
        @task.destroy
    end

    private
        def set_task
            @task = Task.find(params[:id])
        end

        def task_params
            params.require(:task).permit(:list_id, :title, :description, :tag_id, :due_date, :participants => [])
        end
end