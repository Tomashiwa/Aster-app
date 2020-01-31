class Api::UserResource < JSONAPI::Resource
    attributes :name, :password
end