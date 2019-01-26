class CreateProducts < ActiveRecord::Migration[5.2]
  def change
    create_table :products do |t|
      t.string :title
      t.integer :sku
      t.string :color
      t.float :size
      t.decimal :cost

      t.timestamps
    end
  end
end
