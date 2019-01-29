import React, { Component } from 'react';
import { Form, Table, Card, Input } from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';

import styles from '../styles/portal.scss';

class Portal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: {},
            selectedCustomer: '',
            products: {},
            order: {},
            shipping: 10,
        };
    }

    componentDidMount() {
        // const base = 'http://localhost:3000';
        axios.all([
            axios.get('/customers'),
            axios.get('/products'),
        ])
            .then(axios.spread((custRes, prodRes) => {
                let customers = this.mapCustomers(custRes.data);
                customers = _.keyBy(customers, 'id');
                const products = _.keyBy(prodRes.data, 'id');
                this.setState({ customers, products });
            }));
    }

    mapCustomers = (customers) => {
        return (customers.map((customer) => {
            const { name, id } = customer;
            return {
                id,
                name,
                key: name,
                text: name,
                value: id,
            };
        }));
    }

    displayProducts = (products) => {
        const mappedProd = Object.values(products);
        return mappedProd.map((product) => {
            const {
                title,
                sku,
                size,
                cost,
                color,
                id,
            } = product;
            return (
                <Card key={id}>
                    <Card.Content>
                        <Card.Header textAlign='center'>{title}</Card.Header>
                        <Card.Description textAlign='center'>
                            <p>Price: ${cost}</p>
                            <p>Color: {color}</p>
                            <p>Size: {size} kg</p>
                            <p>SKU: {sku}</p>
                            <button
                                value={id}
                                className={styles.button}
                                onClick={this.addToOrder}
                            >
                                Add To Order
                            </button>
                        </Card.Description>
                    </Card.Content>
                </Card>
            );
        });
    }

    displayOrderItems = (items) => {
        const mappedItems = Object.values(items);
        return mappedItems.map((item) => {
            const {
                title,
                sku,
                cost,
                id,
                quantity,
            } = item;
            return (
                <Table.Row key={id}>
                    <Table.Cell>{title}</Table.Cell>
                    <Table.Cell>{sku}</Table.Cell>
                    <Table.Cell>${cost}</Table.Cell>
                    <Table.Cell><Input name={id} onChange={this.handleQuantity} value={this.state.order[id].quantity} placeholder='Quantity' type='number' min='0' /></Table.Cell>
                    <Table.Cell textAlign='right'>${_.round(cost * quantity, 2)}</Table.Cell>
                </Table.Row>
            );
        });
    };

    addToOrder = (e) => {
        e.preventDefault();
        const { order, products } = this.state;
        const id = e.target.value;
        const newItem = products[id];
        newItem.quantity = 1;
        order[id] = products[id];
        this.setState({ order });
    };

    handleCustomer = (e, { value }) => this.setState({ selectedCustomer: value });

    handleQuantity = (e) => {
        const quantity = e.target.value;
        const id = e.target.name;
        const { order } = this.state;
        order[id].quantity = quantity;
        this.setState({ order });
    };

    calculateSubtotal = (order) => {
        const items = Object.values(this.state.order);
        let subtotal = 0;
        for (let i = 0; i < items.length; i += 1) {
            subtotal += items[i].cost * items[i].quantity;
        }
        return _.round(subtotal, 2);
    };

    submitOrder = (e) => {
        e.preventDefault();
        const { order, customers, selectedCustomer } = this.state;
        const items = Object.values(order);
        const customer = customers[selectedCustomer];
        // const base = 'http://localhost:3000';
        axios.post('/orders', { order: { items, customer } })
            .then((res) => {
                this.setState({ order: {} });
            });
    };

    render() {
        const {
            customers,
            selectedCustomer,
            products,
            order,
            shipping,
        } = this.state;
        const subtotal = this.calculateSubtotal(order);
        return (
            <div>
                <Form>
                    <Form.Select
                        fluid
                        label='Customer'
                        options={Object.values(customers)}
                        placeholder='Customer'
                        value={selectedCustomer}
                        onChange={this.handleCustomer}
                    />
                </Form>
                <h5>Products</h5>
                <Card.Group stackable>
                    {this.displayProducts(products)}
                </Card.Group>
                <h5>Order</h5>
                <div className={styles.order}>
                    <Table unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Product</Table.HeaderCell>
                                <Table.HeaderCell>SKU</Table.HeaderCell>
                                <Table.HeaderCell>Unit Price</Table.HeaderCell>
                                <Table.HeaderCell>Quantity</Table.HeaderCell>
                                <Table.HeaderCell textAlign='right'>Price</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.displayOrderItems(order)}
                        </Table.Body>
                    </Table>
                </div>
                <h5>Invoice</h5>
                <div className={styles.order}>
                    <Table celled collapsing unstackable>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <span className={styles.invoiceHeader}>Subtotal</span>
                                </Table.Cell>
                                <Table.Cell>${subtotal}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                <span className={styles.invoiceHeader}>Shipping</span>
                                </Table.Cell>
                                <Table.Cell>${shipping}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <span className={styles.invoiceHeader}>Total</span>
                                </Table.Cell>
                                <Table.Cell>
                                    ${subtotal === 0 ? 0 : _.round(subtotal + shipping, 2)}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
                <div className={styles.submit}>
                    <button
                        className={styles.button}
                        onClick={this.submitOrder}
                    >
                        Submit Order
                    </button>
                </div>
            </div>
        );
    }
}

export default Portal;
