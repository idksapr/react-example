import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import EditPoolSettings from './EditPoolSettings';
import Confirm from '../Confirm';
import Alert from '../AlertMessage';
import { Button } from 'react-bootstrap';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { withStyles } from '@material-ui/core/styles';

import './PoolsSettings.scss';
import '../../scss/table-box.scss';

import editSvg from './assets/edit.svg';
import trashcanSvg from './assets/trashcan.svg';

const styles = theme => ({
    root: {
        color: theme.palette.text.primary,
    },
    icon: {
        fontSize: 16,
    },
});

class PoolsSettings extends React.Component {
    constructor(props) {
        super(props);

        this.onEdit = this.onEdit.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
        this.onHide = this.onHide.bind(this);
        this.onModalApplyShowHide = this.onModalApplyShowHide.bind(this);

        this.state = {
            modalEditShow: false,
            modalApplyShow: false,
            modifiablePoolIndex: null,
            modalDeleteShow: false,
            deletedPoolIndex: null,
            modifiablePool: {
                host: '',
                port: 0,
                user: '',
                pass: '',
            },
        };
    }

    onEdit(modifiablePoolIndex) {
        const { poolsSettings } = this.props;

        if (poolsSettings[modifiablePoolIndex]) {
            this.setState({
                modifiablePoolIndex,
                modifiablePool: Object.assign({}, poolsSettings[modifiablePoolIndex]),
                modalEditShow: true,
            });
        }
    }

    onDelete(deletedPoolIndex) {
        const { poolsSettings } = this.props;

        if (poolsSettings[deletedPoolIndex]) {
            this.setState({
                deletedPoolIndex,
                modalDeleteShow: true,
            });
        }
    }

    onConfirmDelete() {
        this.props.onDelete(this.state.deletedPoolIndex);
    }

    onAdd() {
        this.setState({
            modifiablePoolIndex: null,
            modifiablePool: {
                host: '',
                port: 0,
                user: '',
                pass: '',
            },
            modalEditShow: true
        });
    }

    onHide() {
        this.setState({
            modalEditShow: false,
            modalDeleteShow: false,
        });
    }

    onModalApplyShowHide() {
        this.setState({ modalApplyShow: !this.state.modalApplyShow });
    }

    render() {
        const {
            poolsSettings,
            onModify,
            onMove,
            onApply,
            isSaved,
            error,
            classes,
        } = this.props;

        const {
            modalApplyShow,
            modalEditShow,
            modifiablePool,
            modalDeleteShow,
            modifiablePoolIndex
        } = this.state;

        return(
            <section className='PoolsSettings'>
                <div className='fz-20 fz-xs-18 mb-20'>Pools Settings</div>
                <Alert isSaved={ isSaved } error={ error } />

                <PerfectScrollbar
                    option={
                        {
                            suppressScrollY: true,
                            useBothWheelAxes: true,
                        }
                    }
                >
                    <div className='table-box'>
                        <div className='table-box-head'>
                            <div className='table-box-head-item'>#</div>
                            <div className='table-box-head-item'>Host:Port</div>
                            <div className='table-box-head-item'>Username</div>
                            <div className='table-box-head-item'>Password</div>
                            <div className='table-box-head-item'>State</div>
                            <div className='table-box-head-item table-box-tick'/>
                        </div>
                        <div className='table-box-body'>
                            { poolsSettings.map((pool, key) => {
                                let poolState = '';

                                if (pool.stat) {
                                    const state = pool.stat.find(metric => metric.id == 'state');

                                    if (state) {
                                        poolState = state.text;
                                    }
                                }

                                return <div key={key} className='table-box-body-row'>
                                    <div className='table-box-body-item' data-caption='Index'>
                                        { pool.index }
                                    </div>
                                    <div className='table-box-body-item' data-caption='Host:Port'>
                                        { pool.host }:{ pool.port }
                                    </div>
                                    <div className='table-box-body-item' data-caption='Username'>
                                        { pool.user }
                                    </div>
                                    <div className='table-box-body-item' data-caption='Password'>
                                        { pool.pass }
                                    </div>
                                    <div className='table-box-body-item' data-caption='State'>
                                        { poolState }
                                    </div>
                                    <div className='table-box-body-item'/>
                                    <div className='table-box-body-item table-box-dots'>
                                        <span className='table-box-dots-item'>
                                            <img src={ editSvg } onClick={ () => this.onEdit(key) } />
                                        </span>
                                        <span className='table-box-dots-item'>
                                            <img src={ trashcanSvg } onClick={ () => this.onDelete(key) }/>
                                        </span>
                                        <span className='table-box-tick-item'>
                                            {key < (poolsSettings.length-1) ?
                                                <ArrowDownwardIcon
                                                    className={classes.icon}
                                                    onClick={ () => onMove(key, 1) }
                                                /> :
                                                ''
                                            }
                                        </span>
                                        <span className='table-box-tick-item'>
                                            {key > 0 ?
                                                <ArrowUpwardIcon
                                                    className={classes.icon}
                                                    onClick={ () => onMove(key, -1) }
                                                /> :
                                                ''
                                            }
                                        </span>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </PerfectScrollbar>

                <div className='PoolsSettings-btns'>
                    <Button
                        className='btn btn-blue'
                        onClick={ this.onModalApplyShowHide }
                    >
                        Apply changes
                    </Button>
                    <Button
                        className='btn btn-gray'
                        onClick={ this.onAdd }
                    >
                        Add
                    </Button>
                </div>

                <EditPoolSettings
                    show={ modalEditShow }
                    onHide={ this.onHide }
                    onModify={ onModify }
                    pool={ modifiablePool }
                    poolIndex={ modifiablePoolIndex }
                />

                <Confirm
                    show={ modalApplyShow }
                    onHide={ this.onModalApplyShowHide }
                    onConfirm={ onApply }
                    title='Confirmation'
                    text='Do you go to apply the changes?'
                />

                <Confirm
                    show={ modalDeleteShow }
                    onHide={ this.onHide }
                    onConfirm={ () => this.onConfirmDelete() }
                    title='Confirmation'
                    text='Do you go to delete?'
                />
            </section>
        );
    }
}

PoolsSettings.propTypes = {
    poolsSettings: PropTypes.array.isRequired,
    onApply: PropTypes.func.isRequired,
    onModify: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    isSaved: PropTypes.bool,
    error: PropTypes.shape({
        code: PropTypes.number,
        message: PropTypes.string,
    }),
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PoolsSettings);
