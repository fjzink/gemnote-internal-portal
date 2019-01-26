10.times do |index|
    Customer.create!(name: Faker::Company.name)
end
