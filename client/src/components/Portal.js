import React, { Component } from 'react';
import { Form, Table, Card, Input } from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';

import styles from '../styles/portal.scss';

class Portal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            selectedCustomer: '',
            products: {},
            order: {},
        };
    }

    componentDidMount() {
        // const base = 'http://localhost:3000';
        axios.all([
            axios.get('http://localhost:3000/customers'),
            axios.get('http://localhost:3000/products'),
        ])
            .then(axios.spread((custRes, prodRes) => {
                const customers = this.mapCustomers(custRes.data);
                const products = _.keyBy(prodRes.data, 'id');
                this.setState({ customers, products });
            }));
    }

    mapCustomers = (customers) => {
        return (customers.map((customer) => {
            const { name } = customer;
            return { key: name, text: name, value: name };
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
                                onClick={this.addToCart}
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
            } = item;
            return (
                <Table.Row key={id}>
                    <Table.Cell>{title}</Table.Cell>
                    <Table.Cell>{sku}</Table.Cell>
                    <Table.Cell>${cost}</Table.Cell>
                    <Table.Cell><Input placeholder='Quantity' type='number' /></Table.Cell>
                    <Table.Cell textAlign='right'>${cost}</Table.Cell>
                </Table.Row>
            );
        });
    };

    addToCart = (e) => {
        e.preventDefault();
        console.log(e.target.value);
    };

    handleCustomer = (e, { value }) => this.setState({ selectedCustomer: value });

    render() {
        const {
            customers,
            selectedCustomer,
            products,
            order,
        } = this.state;
        return (
            <div>
                <Form>
                    <Form.Select
                        fluid
                        label='Customer'
                        options={customers}
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
            </div>
        );
    }
}

export default Portal;
