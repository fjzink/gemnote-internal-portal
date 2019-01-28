class Order < ApplicationRecord
    has_many :items, class_name: :OrdersProduct
    belongs_to :customer
end
