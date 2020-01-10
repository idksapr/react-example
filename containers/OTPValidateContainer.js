import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppNavbarContainer from './AppNavbarContainer';
import BreadcrumbsContainer from './BreadcrumbsContainer';
import Body from '../components/Body';
import SidebarContainer from './SidebarContainer';
import OTPValidate from '../components/OTPSetup/OTPValidate';
import { getAppMapByPath } from '../store/appMap';
import {
    otpValidate,
    clearOtpRequest,
    setOtpValidationCode,
    otpConfirm,
} from '../actions/AuthActions';

class OTPValidateContainer extends React.Component {
    constructor(props) {
        super(props);

        this.onValidate = this.onValidate.bind(this);
        this.onEnterValidationCode = this.onEnterValidationCode.bind(this);

        this.state = {
            isChanged: false,
        };
    }

    componentDidMount() {
        this.props.otpConfirm();
    }

    onValidate(event) {
        event.preventDefault();

        const { otpValidate, authState, otpState, clearOtpRequest, history } = this.props;
        const { step, stateToken, code, restoringCallback, redirect } = otpState;

        if (step == 'confirm' || step == 'validate') {
            otpValidate(
                stateToken,
                code,
                authState,
                authState => {
                    this.setState({ isChanged: false });
                    restoringCallback(authState, () => {
                        history.push(redirect);
                        clearOtpRequest();
                    });
                }
            );
        }
    }

    onEnterValidationCode(code) {
        this.props.setOtpValidationCode(code);
        this.setState({ isChanged: true });
    }

    render() {
        const { error, message } = this.props.otpState;
        const { authed } = this.props.authState;
        const { isChanged } = this.state;

        return authed === true ?
            <section>
                <AppNavbarContainer />
                <BreadcrumbsContainer />
                <Body>
                    <SidebarContainer structure={ getAppMapByPath('/configuration') } />
                    <OTPValidate
                        onApply={ this.onValidate }
                        onEnterValidationCode={ this.onEnterValidationCode }
                        isChanged={ isChanged }
                        message={ message }
                        error={ error }
                        authed={ authed }
                    />
                </Body>
            </section> :
            <OTPValidate
                onApply={ this.onValidate }
                onEnterValidationCode={ this.onEnterValidationCode }
                isChanged={ isChanged }
                message={ message }
                error={ error }
                authed={ authed }
            />;
    }
}

OTPValidateContainer.propTypes = {
    authState: PropTypes.shape({
        email: PropTypes.string,
        access_token: PropTypes.string,
        refresh_token: PropTypes.string,
        expires_in: PropTypes.number,
        authed: PropTypes.bool,
    }),
    otpState: PropTypes.shape({
        isFetching: PropTypes.bool,
        step: PropTypes.string,
        restoringCallback: PropTypes.func,
        redirect: PropTypes.string,
        success: PropTypes.bool,
        otpMethod: PropTypes.string,
        stateToken: PropTypes.string,
        code: PropTypes.string,
        expiresIn: PropTypes.number,
        message: PropTypes.string,
        path: PropTypes.string,
        error: PropTypes.shape({
            code: PropTypes.number,
            message: PropTypes.string,
        }),
    }),
    setOtpValidationCode: PropTypes.func.isRequired,
    otpValidate: PropTypes.func.isRequired,
    clearOtpRequest: PropTypes.func.isRequired,
    otpConfirm: PropTypes.func.isRequired,
    history: PropTypes.object,
};

const mapStateToProps = store => {
    return {
        authState: store.authState,
        otpState: store.otpState,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setOtpValidationCode: (code, setup = false) => dispatch(
            setOtpValidationCode(code, setup)
        ),
        otpValidate: (stateToken, code, authState, successCallback = null) => dispatch(
            otpValidate(stateToken, code, authState, successCallback)
        ),
        clearOtpRequest: (setup = false) => dispatch(
            clearOtpRequest(setup)
        ),
        otpConfirm: () => dispatch(
            otpConfirm()
        ),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OTPValidateContainer);
