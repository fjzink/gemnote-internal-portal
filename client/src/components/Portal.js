import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import axios from 'axios';

class Portal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            selectedCustomer: '',
        };
    }

    componentDidMount() {
        // const base = 'http://localhost:3000';
        axios.get('/customers')
            .then((res) => {
                const customers = this.mapCustomers(res.data);
                this.setState({ customers });
            });
    }

    mapCustomers = (customers) => {
        return (customers.map((customer) => {
            const { name } = customer;
            return { key: name, text: name, value: name };
        }));
    }

    handleCustomer = (e, { value }) => this.setState({ selectedCustomer: value });

    render() {
        const { customers, selectedCustomer } = this.state;
        return (
            <div>
                <Form>
                    <Form.Select
                        fluid
                        width='8'
                        label='Customer'
                        options={customers}
                        placeholder='Customer'
                        value={selectedCustomer}
                        onChange={this.handleCustomer}
                    />
                </Form>
            </div>
        );
    }
}

export default Portal;
