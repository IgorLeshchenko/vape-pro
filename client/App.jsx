'use strict';

// Third Party imports:
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class App extends React.Component {

    static propTypes = {
        header: PropTypes.node,
        content: PropTypes.node,
        footer: PropTypes.node,
    };

    static contextTypes = {
        store: React.PropTypes.object.isRequired,
    };

    static defaultProps = {

    };

    render() {
        const { header, content, footer } = this.props;

        return (
            <div className="app">
                {header}
                {content}
                {footer}
            </div>
        );
    }
}

export default connect(
    state => ({

    }),
    dispatch => ({

    })
)(App);
