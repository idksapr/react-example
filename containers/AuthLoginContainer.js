import React from 'react';
import PropTypes from 'prop-types';
import AuthLogin from '../components/AuthLogin';
import { connect } from 'react-redux';
import { authLogin, ERROR_TYPE_LOGIN } from '../actions/AuthActions';

class AuthLoginContainer extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            email: '',
            password: '',
        };
    }

    onChange(event) {
        let data = this.state;
        data[event.target.id] = event.target.value;
        this.setState(data);
    }

    onSubmit(event) {
        event.preventDefault();

        const { authLogin, history, authState } = this.props;
        const { from } = this.props.location.state || { from: { pathname: '/' } };

        authLogin(
            this.state.email,
            this.state.password,
            authState,
            () => history.push(from)
        );
    }

    render() {
        const { email, password } = this.state;
        const { error, isFetching } = this.props;
        const errorMessage = error.type == ERROR_TYPE_LOGIN ? error.message : '';

        return (
            <AuthLogin
                email={ email }
                password={ password }
                error={ errorMessage }
                isFetching={ isFetching }
                onSubmit={ this.onSubmit }
                onChange={ this.onChange }
            />
        );
    }
}

AuthLoginContainer.propTypes = {
    authLogin: PropTypes.func.isRequired,
    authState: PropTypes.shape({
        email: PropTypes.string,
        access_token: PropTypes.string,
        refresh_token: PropTypes.string,
        otpToken: PropTypes.string,
        expires_in: PropTypes.number,
        authed: PropTypes.bool,
    }),
    error: PropTypes.shape({
        type: PropTypes.number,
        code: PropTypes.number,
        message: PropTypes.string,
    }),
    isFetching: PropTypes.bool,
    history: PropTypes.object,
    location: PropTypes.shape({
        state: PropTypes.object,
    }),
};

const mapStateToProps = store => {
    return {
        email: store.authState.email,
        error: store.authState.error,
        isFetching: store.authState.isFetching,
        authState: store.authState,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        authLogin: (email, password, authState, successCallback = null) => dispatch(
            authLogin(email, password, authState, successCallback)
        ),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthLoginContainer);
