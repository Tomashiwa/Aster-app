class Tag < ApplicationRecord
  belongs_to :user, optional: true

  validates_uniqueness_of :name, message: "Tag has been created, please try again."
  validates_length_of :name, minimum: 3, message: "Tag must be more than 2 characters."
  validates_length_of :name, maximum: 20, message: "Tag must be less than 21 characters."
end
