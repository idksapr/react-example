import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppLoader from '../components/AppLoader';
import PoolsSettings from '../components/PoolsSettings';
import {
    getPoolsSettings,
    putPoolsSettings,
    addPoolSettings,
    editPoolSettings,
    movePoolSettings,
    deletePoolSettings,
    getPoolsStat
} from '../actions/PoolsActions';

class PoolsSettingsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.onModify = this.onModify.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onApply = this.onApply.bind(this);
    }

    componentDidMount() {
        const { authState, getPoolsSettings } = this.props;
        getPoolsSettings(authState);
    }

    onModify(poolSettings, index = null) {
        const { poolsSettings, addPoolSettings, editPoolSettings } = this.props;

        if (index === null) {
            addPoolSettings(poolsSettings, poolSettings);
        } else {
            editPoolSettings(poolsSettings, poolSettings, index);
        }
    }

    onDelete(index) {
        const { poolsSettings, deletePoolSettings } = this.props;
        deletePoolSettings(poolsSettings, index);
    }

    onMove(index, step) {
        const { poolsSettings, movePoolSettings } = this.props;
        movePoolSettings(poolsSettings, index, step);
    }

    onApply() {
        const {
            authState,
            putPoolsSettings,
            getPoolsSettings,
            poolsSettings,
            getPoolsStat,
        } = this.props;

        putPoolsSettings(
            poolsSettings,
            authState,
            () => getPoolsSettings(
                authState,
                () => getPoolsStat(authState)
            )
        );
    }

    render() {
        const { isSaved, error, isFetching, poolsStat } = this.props;

        const poolsSettings = this.props.poolsSettings.map(poolSettings => {
            const poolStat = poolsStat.find(poolStat =>
                poolStat.id == poolSettings.id
            );

            return poolStat ?
                Object.assign(poolStat, poolSettings) :
                poolSettings;
        });

        return <section>
            {isFetching ?
                <AppLoader /> :
                <PoolsSettings
                    poolsSettings={ poolsSettings }
                    onModify={ this.onModify }
                    onDelete={ this.onDelete }
                    onMove={ this.onMove }
                    onApply={ this.onApply }
                    isSaved={ isSaved }
                    error={ error }
                />
            }
        </section>;
    }
}

PoolsSettingsContainer.propTypes = {
    authState: PropTypes.shape({
        email: PropTypes.string,
        access_token: PropTypes.string,
        refresh_token: PropTypes.string,
        expires_in: PropTypes.number,
        authed: PropTypes.bool,
    }),
    poolsSettings: PropTypes.array,
    getPoolsSettings: PropTypes.func.isRequired,
    putPoolsSettings: PropTypes.func.isRequired,
    addPoolSettings: PropTypes.func.isRequired,
    editPoolSettings: PropTypes.func.isRequired,
    deletePoolSettings: PropTypes.func.isRequired,
    movePoolSettings: PropTypes.func.isRequired,
    getPoolsStat: PropTypes.func.isRequired,
    isSaved: PropTypes.bool,
    error: PropTypes.shape({
        code: PropTypes.number,
        message: PropTypes.string,
    }),
    isFetching: PropTypes.bool,
    poolsStat: PropTypes.array,
};

const mapStateToProps = store => {
    return {
        authState: store.authState,
        poolsSettings: store.poolsSettingsState.settings,
        isSaved: store.poolsSettingsState.isSaved,
        error: store.poolsSettingsState.error,
        isFetching: store.poolsSettingsState.isFetching,
        poolsStat: store.poolsStatState.items,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPoolsSettings: (authState, successCallback = null) => dispatch(
            getPoolsSettings(authState, successCallback)
        ),
        putPoolsSettings: (poolsSettings, authState, successCallback = null) => dispatch(
            putPoolsSettings(poolsSettings, authState, successCallback)
        ),
        addPoolSettings: (poolsSettings, modifiablePoolSettings) => dispatch(
            addPoolSettings(poolsSettings, modifiablePoolSettings)
        ),
        editPoolSettings: (poolsSettings, modifiablePoolSettings, index) => dispatch(
            editPoolSettings(poolsSettings, modifiablePoolSettings, index)
        ),
        deletePoolSettings: (poolsSettings, index) => dispatch(
            deletePoolSettings(poolsSettings, index)
        ),
        movePoolSettings: (poolsSettings, index, step) => dispatch(
            movePoolSettings(poolsSettings, index, step)
        ),
        getPoolsStat: (authState, successCallback = null, refreshTokenCallback = null) => dispatch(
            getPoolsStat(authState, successCallback, refreshTokenCallback)
        ),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PoolsSettingsContainer);
