import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppNavbarContainer from './AppNavbarContainer';
import BreadcrumbsContainer from './BreadcrumbsContainer';
import Body from '../components/Body';
import SidebarContainer from './SidebarContainer';
import AppLoader from '../components/AppLoader';
import OTPSetupRequest from '../components/OTPSetup/OTPSetupRequest';
import OTPValidate from '../components/OTPSetup/OTPValidate';
import { getAppMapByPath } from '../store/appMap';
import { userCurrent } from '../actions/UserActions';
import {
    clearOtpRequest,
    setOtpMethod,
    setOtpValidationCode,
    otpSetupRequest,
    otpSetupValidate,
} from '../actions/AuthActions';

class OTPSetupContainer extends React.Component {
    constructor(props) {
        super(props);

        this.onRequest = this.onRequest.bind(this);
        this.onValidate = this.onValidate.bind(this);
        this.onEnterValidationCode = this.onEnterValidationCode.bind(this);

        this.state = {
            isChanged: false,
        };
    }

    componentDidMount() {
        const {
            userCurrent,
            authState,
            clearOtpRequest,
            setOtpMethod,
        } = this.props;

        userCurrent(
            authState,
            data => {
                clearOtpRequest(true);
                setOtpMethod(data.user.otpMethod);
            }
        );
    }

    onRequest(otpMethod) {
        const { otpSetupRequest, authState, setOtpMethod } = this.props;

        setOtpMethod(otpMethod);

        otpSetupRequest(
            otpMethod,
            authState,
            () => this.setState({ isChanged: false })
        );
    }

    onValidate() {
        const {
            otpSetupValidate,
            authState,
            otpSetupState,
        } = this.props;

        const { step, stateToken, code } = otpSetupState;

        if (step == 'request') {
            otpSetupValidate(
                stateToken,
                code,
                authState,
                () => {
                    this.setState({ isChanged: false });
                    clearOtpRequest(true);
                }
            );
        }
    }

    onEnterValidationCode(code) {
        this.props.setOtpValidationCode(code, true);
        this.setState({ isChanged: true });
    }

    render() {
        const { otpSetupState, isUserFetching, authState } = this.props;
        const {
            otpMethod,
            error,
            isFetching,
            step, message,
            secret,
            secretURI,
        } = otpSetupState;
        const { isChanged } = this.state;

        return <section>
            <AppNavbarContainer />
            <BreadcrumbsContainer />
            <Body>
                <SidebarContainer structure={ getAppMapByPath('/configuration') } />
                { isFetching || isUserFetching ?
                    <AppLoader /> :
                    step == 'request' ?
                        <OTPValidate
                            onApply={ this.onValidate }
                            onEnterValidationCode={ this.onEnterValidationCode }
                            isChanged={ isChanged }
                            message={ message }
                            error={ error }
                            secret={ secret }
                            secretURI={ secretURI }
                            authed={ authState.authed }
                        /> :
                        <OTPSetupRequest
                            onApply={ this.onRequest }
                            isChanged={ isChanged }
                            otpMethod={ otpMethod }
                            message={ message }
                            error={ error }
                            otpMethods={{
                                none: 'Disabled',
                                email: 'Email',
                                totp: 'Google Authenticator',
                            }}
                        />
                }
            </Body>
        </section>;
    }
}

OTPSetupContainer.propTypes = {
    authState: PropTypes.shape({
        email: PropTypes.string,
        access_token: PropTypes.string,
        refresh_token: PropTypes.string,
        expires_in: PropTypes.number,
        authed: PropTypes.bool,
    }),
    otpSetupState: PropTypes.shape({
        isFetching: PropTypes.bool,
        step: PropTypes.string,
        success: PropTypes.bool,
        otpMethod: PropTypes.string,
        stateToken: PropTypes.string,
        code: PropTypes.string,
        expiresIn: PropTypes.number,
        message: PropTypes.string,
        secret: PropTypes.string,
        secretURI: PropTypes.string,
        path: PropTypes.string,
        error: PropTypes.shape({
            code: PropTypes.number,
            message: PropTypes.string,
        }),
    }),
    userCurrent: PropTypes.func.isRequired,
    otpSetupRequest: PropTypes.func.isRequired,
    otpSetupValidate: PropTypes.func.isRequired,
    clearOtpRequest: PropTypes.func.isRequired,
    setOtpMethod: PropTypes.func.isRequired,
    setOtpValidationCode: PropTypes.func.isRequired,
    isUserFetching: PropTypes.bool,
};

const mapStateToProps = store => {
    return {
        authState: store.authState,
        otpSetupState: store.otpSetupState,
        isUserFetching: store.userState.isFetching,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        userCurrent: (authState, successCallback = null) => dispatch(
            userCurrent(authState, successCallback)
        ),
        clearOtpRequest: (setup = false) => dispatch(
            clearOtpRequest(setup)
        ),
        setOtpMethod: (otpMethod) => dispatch(
            setOtpMethod(otpMethod)
        ),
        setOtpValidationCode: (code, setup = false) => dispatch(
            setOtpValidationCode(code, setup)
        ),
        otpSetupRequest: (otpMethod, authState, successCallback = null) => dispatch(
            otpSetupRequest(otpMethod, authState, successCallback)
        ),
        otpSetupValidate: (stateToken, code, authState, successCallback = null) => dispatch(
            otpSetupValidate(stateToken, code, authState, successCallback)
        ),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OTPSetupContainer);
