import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';

// below modules to be loaded lazily
// import Checkout from './containers/Checkout/Checkout';
// import Orders from './containers/Orders/Orders';
// import Auth from './containers/Auth/Auth';


// loads above commented out modules lazily
const asyncCheckout = asyncComponent(() => {
    return import('./containers/Checkout/Checkout');
});

const asyncOrders = asyncComponent(() => {
    return import('./containers/Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
    return import('./containers/Auth/Auth');
});




class App extends Component {

    componentDidMount() {
        this.props.onTryAutoSignup();
    }
    
    render() {

        let routes = (
            <Switch>
                <Route path="/auth" component={asyncAuth} />
                <Route path="/" exact component={BurgerBuilder} />
                {/*
                    redirect to root path for any url that does
                    not match the above urls
                */}
                <Redirect to="/" />
            </Switch>
        );

        if (this.props.isAuthenticated) {
            routes = (
                <Switch>
                    <Route path="/orders" component={asyncOrders} />
                    <Route path="/checkout" component={asyncCheckout} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/auth" component={asyncAuth} />
                    <Route path="/" exact component={BurgerBuilder} />
                    {/*
                        redirect to root path for any url that does
                        not match the above urls
                    */}
                    <Redirect to="/" />
                </Switch>
            );
        }

        return (
            <React.Fragment>
                <Layout>
                    { routes }
                </Layout>
            </React.Fragment>
        );
    }
}


// convert redux store state into props for this component
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(
            actions.authCheckState()
        )
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
