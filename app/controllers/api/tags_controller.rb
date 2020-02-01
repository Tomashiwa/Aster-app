class Api::TagsController < ApiController
    before_action :authenticate_user
    before_action :set_tag, only: [:show, :update, :destroy]

    #GET /tags
    def index
        if current_user.admin?
            @tags = Tag.all
        else
            @tasks = Task.where("?=ANY(participants)", current_user.id)
            @tags = Tag.where(:user_id => [current_user.id, nil]).or(Tag.where(:id => @tasks.pluck(:tag_id)));
        end

        render json: @tags
    end

    #GET /tags/#
    def show
        render json: @tag
    end

    #POST /tag
    def create
        @tag = Tag.new(tag_params)

        if @tag.save
            render json: @tag, status: :created
        else
            puts "error in submit tag"
            render json: @tag.errors.to_json(), status: :unprocessable_entity
        end
    end

    #PATCH/PUT /tags/#
    def update
        if @tag.update(tag_params)
            render json: @tag
        else 
            render json: @tag.errors, status: :unprocessable_entity
        end
    end

    #DELETE /tags/#
    def destroy
        @tag.destroy
    end

    private
        def set_tag
            @tag = Tag.find(params[:id])
        end

        def tag_params
            params.require(:tag).permit(:name, :user_id)
        end
end
