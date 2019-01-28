import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import axios from 'axios';

class Portal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [
                { key: 'google', text: 'Google', value: 'google' },
                { key: 'facebook', text: 'Facebook', value: 'facebook' },
                { key: 'dropbox', text: 'Dropbox', value: 'dropbox' },
            ],
            selectedCustomer: '',
        };
    }

    componentDidMount() {
        axios.get('http://localhost:3000/customers')
            .then((res) => {
                console.log(res.data);
            });
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
