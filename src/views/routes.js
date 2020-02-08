import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MainContainer from './containers/MainContainer';

const routes = (
    <Router>
        <Switch>
            <Route exact path='/' component={MainContainer} />
        </Switch>
    </Router>
);

export default routes;