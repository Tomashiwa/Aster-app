class CreateLists < ActiveRecord::Migration[6.0]
  def change
    create_table :lists do |t|
      t.references :board, null: true, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
