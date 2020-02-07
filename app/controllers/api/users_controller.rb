class Api::UsersController < ApiController
    require 'jwt'
    require 'json'
    before_action :set_user, only: [:show, :update, :destroy]
   
    # GET /users
    def index
      @users = User.all
      render :json => @users.to_json( :only => [:id, :name, :admin] ) 
    end
  
    # GET /users/1
    def show
      render json: @user
    end
  
    # POST /users
    def create
      @user = User.new(user_params)
      
      if @user.save
        # Create a set of default Board, Lists and Tasks for a new user
        @board = Board.create(user_id: @user.id, name: @user.name + "'s board");

        @list1 = List.create(board_id: @board.id, name: "Backlog");
        @list2 = List.create(board_id: @board.id, name: "To-do");
        @list3 = List.create(board_id: @board.id, name: "In progress");
        @list4 = List.create(board_id: @board.id, name: "Completed");

        @templateTask = Task.create(
          list_id: @list1.id, 
          title: "Press + to start adding tasks !", 
          description: "'< >' shifts the task over lists \n 'Pencil' edits the task \n 'Bin' deletes the task", 
          tag_id: 1, 
          due_date: Time.now.strftime("%A, %d/%m/%Y, %I:%M %p"), 
          participants: [@user.id])

        render :json => @user.to_json( :only => [:id, :name, :admin] ), status: :created
      else
        render json: @user.errors.to_json() , status: :unprocessable_entity
      end
    end
  
    # PATCH/PUT /users/1
    def update
      if @user.update(user_params)
        render json: @user
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    # DELETE /users/1
    def destroy
      @user.destroy
    end
  
    private
      # Use callbacks to share common setup or constraints between actions.
      def set_user
        @user = User.find(params[:id])
      end
  
      # Only allow a trusted parameter "white list" through.
      def user_params
        params.require(:user).permit(:name, :password, :password_confirmation, :admin)
      end
  end