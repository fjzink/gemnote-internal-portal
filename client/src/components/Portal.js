import React, { Component } from 'react';
import { Form, Table, Card, Input } from 'semantic-ui-react';
import axios from 'axios';

class Portal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            selectedCustomer: '',
            products: [],
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
                this.setState({ products: prodRes.data });
                this.setState({ customers });
            }));
    }

    mapCustomers = (customers) => {
        return (customers.map((customer) => {
            const { name } = customer;
            return { key: name, text: name, value: name };
        }));
    }

    displayProducts = (products) => {
        return products.map((product) => {
            const {
                title,
                sku,
                size,
                cost,
                color,
            } = product;
            return (
                <Card>
                    <Card.Content>
                        <Card.Header textAlign='center'>{title}</Card.Header>
                        <Card.Description textAlign='center'>
                            <p>Price: ${cost}</p>
                            <p>Color: {color}</p>
                            <p>Size: {size} kg</p>
                            <p>SKU: {sku}</p>
                        </Card.Description>
                    </Card.Content>
                </Card>
            );
        });
    }

    handleCustomer = (e, { value }) => this.setState({ selectedCustomer: value });

    render() {
        const { customers, selectedCustomer, products } = this.state;
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
                        <Table.Row>
                            <Table.Cell>Flashlight</Table.Cell>
                            <Table.Cell>123456</Table.Cell>
                            <Table.Cell>$20.99</Table.Cell>
                            <Table.Cell><Input placeholder='Quantity' type='number' /></Table.Cell>
                            <Table.Cell textAlign='right'>$20.99</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

export default Portal;
