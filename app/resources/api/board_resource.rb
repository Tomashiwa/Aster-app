class Api::BoardResource < JSONAPI::Resource
    attributes :user_id, :name
end