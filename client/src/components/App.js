import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Portal from './Portal';
import NotFound from './NotFound';

const App = () => {
    return (
        <div>
            <Router>
                <Switch>
                    <Route path='/' exact component={Portal} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        </div>
    );
};

export default App;
