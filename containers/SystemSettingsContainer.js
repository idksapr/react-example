import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppNavbarContainer from './AppNavbarContainer';
import BreadcrumbsContainer from './BreadcrumbsContainer';
import AppLoader from '../components/AppLoader';
import Body from '../components/Body';
import SidebarContainer from './SidebarContainer';
import SystemSettings from '../components/SystemSettings';
import { getSystemSettings, putSystemSettings } from '../actions/SystemActions';
import { setObjectValue } from '../store/utils';
import { getAppMapByPath } from '../store/appMap';

class SystemSettingsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.onApply = this.onApply.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            systemSettings: this.props.systemSettings,
            isChanged: false,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.systemSettings !== prevState.systemSettings) {
            return { systemSettings: nextProps.systemSettings };
        }
        return null;
    }

    componentDidMount() {
        const { authState, getSystemSettings } = this.props;
        getSystemSettings(authState);
    }

    onApply() {
        const { authState, putSystemSettings } = this.props;

        putSystemSettings(
            this.state.systemSettings,
            authState,
            () => this.setState({ isChanged: false })
        );
    }

    onReset() {
        const { authState, getSystemSettings } = this.props;
        getSystemSettings(
            authState,
            () => this.setState({ isChanged: false })
        );
    }

    onChange(event, value) {
        const systemSettings = this.state.systemSettings;
        const path = event.target.id.split('.');

        setObjectValue(systemSettings, path, value);

        this.setState({
            systemSettings,
            isChanged: true,
        });
    }

    render() {
        const {
            autoUpdate,
            postTelemetry,
            publicStat,
            useCustomSmtp,
            smtp,
        } = this.state.systemSettings;

        const { isSaved, error, isFetching } = this.props;

        return <section>
            <AppNavbarContainer />
            <BreadcrumbsContainer />
            <Body>
                <SidebarContainer structure={ getAppMapByPath('/configuration') } />
                {isFetching ?
                    <AppLoader /> :
                    <SystemSettings
                        onApply={ this.onApply }
                        onReset={ this.onReset }
                        onChange={ this.onChange }
                        autoUpdate={ autoUpdate }
                        postTelemetry={ postTelemetry }
                        publicStat={ publicStat }
                        useCustomSmtp={ useCustomSmtp }
                        smtp={ smtp }
                        isSaved={ isSaved }
                        error={ error }
                        isChanged={ this.state.isChanged }
                    />
                }
            </Body>
        </section>;
    }
}

SystemSettingsContainer.propTypes = {
    authState: PropTypes.shape({
        email: PropTypes.string,
        access_token: PropTypes.string,
        refresh_token: PropTypes.string,
        expires_in: PropTypes.number,
        authed: PropTypes.bool,
    }),
    systemSettings: PropTypes.shape({
        autoUpdate: PropTypes.bool,
        postTelemetry: PropTypes.bool,
        publicStat: PropTypes.bool,
        useCustomSmtp: PropTypes.bool,
        smtp: PropTypes.shape({
            host: PropTypes.string,
            port: PropTypes.number,
            username: PropTypes.string,
            password: PropTypes.string,
            ssl: PropTypes.bool,
            fromAddress: PropTypes.string,
        }),
    }),
    getSystemSettings: PropTypes.func.isRequired,
    putSystemSettings: PropTypes.func.isRequired,
    isSaved: PropTypes.bool,
    error: PropTypes.shape({
        code: PropTypes.number,
        message: PropTypes.string,
    }),
    isFetching: PropTypes.bool,
};

const mapStateToProps = store => {
    return {
        authState: store.authState,
        systemSettings: store.systemSettingsState.settings,
        isSaved: store.systemSettingsState.isSaved,
        error: store.systemSettingsState.error,
        isFetching: store.systemSettingsState.isFetching,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getSystemSettings: (authState, successCallback = null) => dispatch(
            getSystemSettings(authState, successCallback)
        ),
        putSystemSettings: (systemSettings, authState, successCallback = null) => dispatch(
            putSystemSettings(systemSettings, authState, successCallback)
        ),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SystemSettingsContainer);
