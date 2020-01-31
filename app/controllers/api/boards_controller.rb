class Api::BoardsController < ApiController
    before_action :authenticate_user
    before_action :set_board, only: [:show, :update, :destroy]

    #GET /boards
    def index
        if current_user.admin?
            @boards = Board.all
        else
            @boards = Board.where(:user_id => current_user.id)
        end

        render json: @boards
    end

    #GET /boards/#
    def show
        render json: @board
    end

    #POST /board
    def create
        @board = Board.new(board_params)

        if @board.save
            render json: @board, status: :created
        else
            render json: @board.errors, status: :unprocessable_entity
        end
    end

    #PATCH/PUT /boards/#
    def update
        if @board.update(board_params)
            render json: @board
        else 
            render json: @board.errors, status: :unprocessable_entity
        end
    end

    #DELETE /boards/#
    def destroy
        @board.destroy
    end

    private
        def set_board
            @board = Board.find(params[:id])
        end

        def board_params
            params.require(:board).permit(:user_id, :name)
        end
end