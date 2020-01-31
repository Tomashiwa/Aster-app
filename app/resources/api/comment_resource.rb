class Api::CommentResource < JSONAPI::Resource
    attributes :user_id, :task_id, :body, :updated_at
end