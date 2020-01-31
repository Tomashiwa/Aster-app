class Board < ApplicationRecord
  belongs_to :user, optional: true
  has_many :lists, dependent: :destroy
end
