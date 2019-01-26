prng = Random.new

10.times do |index|
    Customer.create!(name: Faker::Company.name)

    fake_price = prng.rand(1.0..100.0).round(2)
    fake_product = {
        title: Faker::Commerce.product_name,
        sku: prng.rand(100000..999999),
        color: Faker::Commerce.color,
        size: prng.rand(0.1..10.0),
        cost: fake_price
    }
    Product.create!(fake_product)
end
