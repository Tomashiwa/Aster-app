class Api::CommentsController < ApiController
    before_action :authenticate_user
    before_action :set_comment, only: [:show, :update, :destroy]

    #GET /comments
    def index
        @comments = Comment.order("created_at").all
        render json: @comments 
    end

    #GET /comments/#
    def show
        render json: @comment
    end

    #POST /comment
    def create
        @comment = Comment.new(comment_params)

        if @comment.save
            render json: @comment, status: :created
        else
            render json: @comment.errors, status: :unprocessable_entity
        end
    end

    #PATCH/PUT /comments/#
    def update
        if @comment.update(comment_params)
            render json: @comment
        else 
            render json: @comment.errors, status: :unprocessable_entity
        end
    end

    #DELETE /comments/#
    def destroy
        @comment.destroy
    end

    private
        def set_comment
            @comment = Comment.find(params[:id])
        end

        def comment_params
            params.require(:comment).permit(:user_id, :task_id, :body)
        end
end
