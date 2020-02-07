puts 'Started Seeding'

User.create!(name: "superuser", password: "superpass", password_confirmation: "superpass", admin: true)

Board.create!(user_id: 1, name: "default");

List.create!(board_id: 1, name: "Backlog");
List.create!(board_id: 1, name: "To-do");
List.create!(board_id: 1, name: "In progress");
List.create!(board_id: 1, name: "Completed");

Tag.create!(name: "Any", user_id: nil)

Task.create!(list_id: 1,
    title: "Press + to start adding tasks !", 
    description: "'< >' shifts the task over lists \n 'Pencil' edits the task \n 'Bin' deletes the task", 
    tag_id: 1, 
    due_date: Time.now.strftime("%A, %d/%m/%Y, %I:%M %p"), 
    participants: [1])

puts "Completed Seeding"