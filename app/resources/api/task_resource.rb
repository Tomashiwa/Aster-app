class Api::TaskResource < JSONAPI::Resource
    attributes :list_id, :title, :description, :tag_id, :due_date, :participants
end