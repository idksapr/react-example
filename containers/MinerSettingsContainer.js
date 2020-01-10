import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppNavbarContainer from './AppNavbarContainer';
import BreadcrumbsContainer from './BreadcrumbsContainer';
import SidebarContainer from './SidebarContainer';
import AppLoader from '../components/AppLoader';
import Body from '../components/Body';
import MinerSettings from '../components/MinerSettings';
import { getMinerSettings, putMinerSettings } from '../actions/MinerActions';
import { getAppMapByPath } from '../store/appMap';

class MinerSettingsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.onApply = this.onApply.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            minerSettings: this.props.minerSettings,
            isChanged: false,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.minerSettings !== prevState.minerSettings) {
            return { minerSettings: nextProps.minerSettings };
        }
        return null;
    }

    componentDidMount() {
        const { authState, getMinerSettings } = this.props;
        getMinerSettings(authState);
    }

    onApply() {
        const { authState, putMinerSettings } = this.props;

        putMinerSettings(
            this.state.minerSettings,
            authState,
            () => this.setState({ isChanged: false })
        );
    }

    onReset() {
        const { authState, getMinerSettings } = this.props;
        getMinerSettings(
            authState,
            () => this.setState({ isChanged: false })
        );
    }

    onChange(event, name, value) {
        const minerSettings = this.state.minerSettings;

        minerSettings[name] = typeof value == 'number' ?
            Math.floor(value) : value;

        this.setState({
            minerSettings,
            isChanged: true,
        });
    }

    render() {
        const { psuVoltage, oscillator, ocp, fanPower, logDelay } = this.state.minerSettings;
        const { isSaved, error, isFetching } = this.props;

        return <section>
            <AppNavbarContainer />
            <BreadcrumbsContainer />
            <Body>
                <SidebarContainer structure={ getAppMapByPath('/configuration') }/>
                {isFetching ?
                    <AppLoader /> :
                    <MinerSettings
                        onApply={ this.onApply }
                        onReset={ this.onReset }
                        onChange={ this.onChange }
                        psuVoltage={ psuVoltage }
                        oscillator={ oscillator }
                        logDelay={ logDelay }
                        ocp={ ocp }
                        fanPower={ fanPower }
                        isSaved={ isSaved }
                        error={ error }
                        isChanged={ this.state.isChanged }
                    />
                }
            </Body>
        </section>;
    }
}

MinerSettingsContainer.propTypes = {
    authState: PropTypes.shape({
        email: PropTypes.string,
        access_token: PropTypes.string,
        refresh_token: PropTypes.string,
        expires_in: PropTypes.number,
        authed: PropTypes.bool,
    }),
    minerSettings: PropTypes.shape({
        psuVoltage: PropTypes.number,
        oscillator: PropTypes.number,
        logDelay: PropTypes.number,
        ocp: PropTypes.number,
        fanPower: PropTypes.number,
    }),
    getMinerSettings: PropTypes.func.isRequired,
    putMinerSettings: PropTypes.func.isRequired,
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
        minerSettings: store.minerSettingsState.settings,
        isSaved: store.minerSettingsState.isSaved,
        error: store.minerSettingsState.error,
        isFetching: store.minerSettingsState.isFetching,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getMinerSettings: (authState, successCallback = null) => dispatch(
            getMinerSettings(authState, successCallback)
        ),
        putMinerSettings: (minerSettings, authState, successCallback = null) => dispatch(
            putMinerSettings(minerSettings, authState, successCallback)
        ),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MinerSettingsContainer);
