class Api::TagResource < JSONAPI::Resource
    attributes :name, :user_id
end