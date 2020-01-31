class User < ApplicationRecord
    has_secure_password
    has_many :tags, dependent: :destroy
    has_many :boards, dependent: :destroy

    validates_uniqueness_of :name, message: "Username has been taken. please try again."
    validates_length_of :name, minimum: 4, message: "Username must be more than 3 characters."
    validates_length_of :name, maximum: 16, message: "Username must be less than 17 characters."

    validates_length_of :password, minimum: 6, message: "Password must be more than 5 characters."
    validates_length_of :password, maximum: 20, message: "Password must be less than 21 characters."
    
    validates_length_of :password_confirmation, minimum: 6, message: "Password confirmation must be more than 5 characters."
    validates_length_of :password_confirmation, maximum: 20, message: "Password confirmation must be less than 21 characters."
    
    validates_length_of :password_digest, minimum: 6, message: "Encrypted password must be more than 5 characters."

    def self.from_token_request request
        name = request.params["auth"] && request.params["auth"]["name"]
        self.find_by name: name
    end
end
