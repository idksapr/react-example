import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppNavbarContainer from './AppNavbarContainer';
import BreadcrumbsContainer from './BreadcrumbsContainer';
import SidebarContainer from './SidebarContainer';
import AppLoader from '../components/AppLoader';
import Body from '../components/Body';
import UserSettings from '../components/UserSettings';
import { getUserSettings, putUserSettings, userCurrent } from '../actions/UserActions';
import { getAppMapByPath } from '../store/appMap';

class UserSettingsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.onApply = this.onApply.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            userSettings: this.props.userSettings,
            isChanged: false,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.userSettings !== prevState.userSettings) {
            return { userSettings: nextProps.userSettings };
        }
        return null;
    }

    componentDidMount() {
        const { authState, getUserSettings, userCurrent } = this.props;
        getUserSettings(authState);
        userCurrent(authState);
    }

    onApply() {
        const { authState, putUserSettings } = this.props;

        putUserSettings(
            this.state.userSettings,
            authState,
            () => this.setState({ isChanged: false })
        );
    }

    onReset() {
        const { authState, getUserSettings } = this.props;
        getUserSettings(
            authState,
            () => this.setState({ isChanged: false })
        );
    }

    onChange(event, value, name) {
        const userSettings = this.state.userSettings;
        userSettings[name] = value;

        this.setState({
            userSettings,
            isChanged: true,
        });
    }

    render() {
        const {
            email,
            expiration,
            emailNotifications,
            otpLogin,
            otpSettings,
            otpPassword,
            otpRestart,
            encryptConfig,
        } = this.state.userSettings;

        const { isSaved, error, isFetching, user } = this.props;

        return <section>
            <AppNavbarContainer />
            <BreadcrumbsContainer />
            <Body>
                <SidebarContainer structure={ getAppMapByPath('/configuration') } />
                {isFetching ?
                    <AppLoader /> :
                    <UserSettings
                        onApply={ this.onApply }
                        onReset={ this.onReset }
                        onChange={ this.onChange }
                        email={ email }
                        expiration={ expiration }
                        emailNotifications={ emailNotifications }
                        otpLogin={ otpLogin }
                        otpSettings={ otpSettings }
                        otpPassword={ otpPassword }
                        otpRestart={ otpRestart }
                        otpMethod={ user.otpMethod }
                        encryptConfig={ encryptConfig }
                        isSaved={ isSaved }
                        isFetching={ isFetching }
                        error={ error }
                        isChanged={ this.state.isChanged }
                    />
                }
            </Body>
        </section>;
    }
}

UserSettingsContainer.propTypes = {
    authState: PropTypes.shape({
        email: PropTypes.string,
        access_token: PropTypes.string,
        refresh_token: PropTypes.string,
        expires_in: PropTypes.number,
        authed: PropTypes.bool,
    }),
    userSettings: PropTypes.shape({
        email: PropTypes.string,
        expiration: PropTypes.number,
        emailNotifications: PropTypes.bool,
        otpLogin: PropTypes.bool,
        otpSettings: PropTypes.bool,
        otpPassword: PropTypes.bool,
        otpRestart: PropTypes.bool,
        encryptConfig: PropTypes.bool,
    }),
    user: PropTypes.shape({
        otpMethod: PropTypes.string,
    }),
    getUserSettings: PropTypes.func.isRequired,
    putUserSettings: PropTypes.func.isRequired,
    userCurrent: PropTypes.func.isRequired,
    isSaved: PropTypes.bool,
    isFetching: PropTypes.bool,
    error: PropTypes.shape({
        code: PropTypes.number,
        message: PropTypes.string,
    }),
};

const mapStateToProps = store => {
    return {
        authState: store.authState,
        userSettings: store.userSettingsState.user,
        isSaved: store.userSettingsState.isSaved,
        isFetching: store.userSettingsState.isFetching,
        error: store.userSettingsState.error,
        user: store.userState.user,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getUserSettings: (authState, successCallback = null) => dispatch(
            getUserSettings(authState, successCallback)
        ),
        putUserSettings: (userSettings, authState, successCallback = null) => dispatch(
            putUserSettings(userSettings, authState, successCallback)
        ),
        userCurrent: (authState, successCallback = null) => dispatch(
            userCurrent(authState, successCallback)
        ),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserSettingsContainer);
