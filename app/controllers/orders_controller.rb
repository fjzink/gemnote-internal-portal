class OrdersController < ApplicationController
  before_action :set_order, only: [:show, :update, :destroy]

  # GET /orders
  def index
    @orders = Order.all

    render json: @orders
  end

  # GET /orders/1
  def show
    render json: @order
  end

  # POST /orders
  def create
    item_details = params[:order][:items].map { |item|
      item_subtotal = item_subtotal(item)
      item[:subtotal] = item_subtotal
      item
    }
    customer = params[:order][:customer]
    subtotal = order_subtotal(item_details)
    shipping = 10
    total = subtotal + shipping
    order_data = {
      items: item_details,
      subtotal: subtotal,
      shipping: shipping,
      total: total,
      customer: customer
    }

    invoice_response = HTTParty.post(
      'https://gemnote.free.beeceptor.com/invoices', 
      body: order_data.to_json,
      headers: { 'Content-Type' => 'application/json' }
    )

    prng = Random.new
    order_number = prng.rand(100000..999999)
    
    @order = Order.new(number: order_number, customer_id: customer[:id])

    if @order.save
      item_details.each { |item| OrdersProduct.create(order: @order, product_id: item[:id], quantity: item[:quantity]) }
      render json: @order, status: :created, location: @order
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /orders/1
  def update
    if @order.update(order_params)
      render json: @order
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  # DELETE /orders/1
  def destroy
    @order.destroy
  end

  private
    def item_subtotal(item)
      subtotal = item[:cost].to_f * item[:quantity].to_f
      return subtotal.round(2)
    end

    def order_subtotal(items)
      subtotal = items.reduce(0) { |total, item| total + item[:subtotal]}
      return subtotal.round(2)
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_order
      @order = Order.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def order_params
      params.require(:order).permit(:number, :customer_id)
    end
end
