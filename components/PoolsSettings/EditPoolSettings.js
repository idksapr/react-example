import React from 'react';
import PropTypes from 'prop-types';
import { Form, ControlLabel, FormControl, Modal, Button } from 'react-bootstrap';
import NumberFormControl from '../common/NumberFormControl';

import './PoolsSettings.scss';
import '../../scss/table-box.scss';

class EditPoolSettings extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {
            pool: this.props.pool,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.pool !== prevState.pool) {
            return { pool: nextProps.pool };
        }
        return null;
    }

    onChange(event, value) {
        const pool = this.state.pool;

        pool[event.target.id] = value !== undefined ? value : event.target.value;

        this.setState({ pool });
    }

    render() {
        const { show, onHide, onModify, poolIndex } = this.props;
        const { pool } = this.state;

        return <Modal show={ show } onHide={ onHide }>
            <Modal.Header closeButton>
                <Modal.Title className='fz-16'>Edit pool</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='color-nobel mb-20'>Define miner pool parameters</div>

                <Form className='PoolsSettings-form'>
                    <div className='PoolsSettings-item'>
                        <ControlLabel className='PoolsSettings-label'>
                            <span className='PoolsSettings-label-text'>Server host</span>
                            <FormControl
                                id='host'
                                type='text'
                                value={ pool.host }
                                onChange={ this.onChange }
                            />
                        </ControlLabel>
                    </div>
                    <div className='PoolsSettings-item is-short'>
                        <ControlLabel className='PoolsSettings-label'>
                            <span className='PoolsSettings-label-text'>Server port</span>
                            <NumberFormControl
                                id='port'
                                type='number'
                                value={ pool.port }
                                onChange={ this.onChange }
                            />
                        </ControlLabel>
                    </div>
                    <div className='PoolsSettings-item'>
                        <ControlLabel className='PoolsSettings-label'>
                            <span className='PoolsSettings-label-text'>Server worker username</span>
                            <FormControl
                                id='user'
                                type='text'
                                value={ pool.user }
                                onChange={ this.onChange }
                            />
                        </ControlLabel>
                    </div>
                    <div className='PoolsSettings-item'>
                        <ControlLabel className='PoolsSettings-label'>
                            <span className='PoolsSettings-label-text'>Server worker password</span>
                            <FormControl
                                id='pass'
                                type='text'
                                value={ pool.pass }
                                onChange={ this.onChange }
                            />
                        </ControlLabel>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <div className='PoolsSettings-btns'>
                    <Button className='btn btn-blue' onClick={ onHide }>Cancel</Button>
                    <Button
                        className='btn btn-gray'
                        onClick={ () => { onModify(pool, poolIndex); onHide() } }
                    >
                        Save
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>;
    }
}

EditPoolSettings.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onModify: PropTypes.func.isRequired,
    pool: PropTypes.shape({
        host: PropTypes.string,
        port: PropTypes.number,
        user: PropTypes.string,
        pass: PropTypes.string,
    }),
    poolIndex: PropTypes.number,
};

export default EditPoolSettings;
