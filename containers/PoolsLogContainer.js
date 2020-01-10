import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppLoader from '../components/AppLoader';
import PoolsLog from '../components/PoolsLog';
import { getPoolsLog, sortPoolsLog, addPoolSettings } from '../actions/PoolsActions';

class PoolsLogContainer extends React.Component {
    constructor(props) {
        super(props);

        this.onCountChange = this.onCountChange.bind(this);
        this.onSort = this.onSort.bind(this);
        this.onRestore = this.onRestore.bind(this);

        this.state = {
            count: 5,
            sortField: null,
            sortAsc: false,
        };
    }

    componentDidMount() {
        const { authState, getPoolsLog } = this.props;
        getPoolsLog(this.state.count, authState);
    }

    onCountChange(count) {
        const { authState, getPoolsLog } = this.props;
        getPoolsLog(count, authState, () => this.setState({ count }));
    }

    onSort(sortField) {
        const { poolsLog, sortPoolsLog } = this.props;
        const sortAsc = sortField != this.state.sortField || !this.state.sortAsc;

        sortPoolsLog(poolsLog, sortField, sortAsc);
        this.setState({ sortField, sortAsc });
    }

    onRestore(poolSettings) {
        const { poolsSettings, addPoolSettings } = this.props;
        addPoolSettings(poolsSettings, poolSettings);
    }

    render() {
        const { poolsLog, isSaved, error, isFetching } = this.props;
        const { count, sortField, sortAsc } = this.state;

        return <section>
            {isFetching ?
                <AppLoader /> :
                <PoolsLog
                    poolsLog={ poolsLog }
                    count={ count }
                    sortField={ sortField }
                    sortAsc={ sortAsc }
                    onCountChange={ this.onCountChange }
                    onSort={ this.onSort }
                    isSaved={ isSaved }
                    error={ error }
                    onRestore={ this.onRestore }
                />
            }
        </section>;
    }
}

PoolsLogContainer.propTypes = {
    authState: PropTypes.shape({
        email: PropTypes.string,
        access_token: PropTypes.string,
        refresh_token: PropTypes.string,
        expires_in: PropTypes.number,
        authed: PropTypes.bool,
    }),
    poolsLog: PropTypes.array,
    getPoolsLog: PropTypes.func.isRequired,
    sortPoolsLog: PropTypes.func.isRequired,
    isSaved: PropTypes.bool,
    error: PropTypes.shape({
        code: PropTypes.number,
        message: PropTypes.string,
    }),
    isFetching: PropTypes.bool,
    poolsSettings: PropTypes.array,
    addPoolSettings: PropTypes.func.isRequired,
};

const mapStateToProps = store => {
    return {
        authState: store.authState,
        poolsLog: store.poolsLogState.entries,
        isSaved: store.poolsLogState.isSaved,
        error: store.poolsLogState.error,
        isFetching: store.poolsLogState.isFetching,
        poolsSettings: store.poolsSettingsState.settings,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPoolsLog: (count, authState, successCallback = null) => dispatch(
            getPoolsLog(count, authState, successCallback)
        ),
        sortPoolsLog: (poolsLog, field, asc = true) => dispatch(
            sortPoolsLog(poolsLog, field, asc)
        ),
        addPoolSettings: (poolsSettings, modifiablePoolSettings) => dispatch(
            addPoolSettings(poolsSettings, modifiablePoolSettings)
        ),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PoolsLogContainer);
