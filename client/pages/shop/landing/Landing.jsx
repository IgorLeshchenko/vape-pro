'use strict';

// Third party imports:
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// App imports:
import * as usersActions from '../../../store/entities/users/users.actions';

class LandingPage extends Component {

    static propTypes = {
        dispatchSignIn: PropTypes.func.isRequired
    };

    static defaultProps = {

    };

    static serverFetch = (dispatch, params, req) => {
        return Promise.all([
            dispatch(usersActions.fetchMe(req))
        ]);
    };

    handleSignIn = () => {
        const email = 'il@vape-pro.com.ua';
        const password = 'admin';
        const role = 'admin';

        this.props.dispatchSignIn(email, password, role);
    };

    render() {
        return (
            <div>
                <button onClick={this.handleSignIn}>Sign In</button>
            </div>
        );
    }
}

export default connect(
    (state, props) => ({

    }),
    dispatch => ({
        dispatchSignIn: (email, password, role) => {
            return dispatch(usersActions.signIn(email, password, role));
        }
    })
)(LandingPage);
