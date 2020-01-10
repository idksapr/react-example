import React from 'react';
import PropTypes from 'prop-types';
import { Form, ControlLabel, FormControl } from 'react-bootstrap';
import Switch from '../common/CustomizedSwitch';
import Confirm from '../Confirm';
import Alert from '../AlertMessage';
import { Button } from 'react-bootstrap';
import NumberFormControl from '../common/NumberFormControl';
import './SystemSettings.scss';

class SystemSettings extends React.Component  {
    constructor(props) {
        super(props);

        this.onModalApplyShowHide = this.onModalApplyShowHide.bind(this);
        this.onModalResetShowHide = this.onModalResetShowHide.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            modalApplyShow: false,
            modalResetShow: false,
        };
    }

    onModalApplyShowHide() {
        this.setState({modalApplyShow: !this.state.modalApplyShow});
    }

    onModalResetShowHide() {
        this.setState({modalResetShow: !this.state.modalResetShow});
    }

    onChange(event, value) {
        this.props.onChange(
            event,
            value !== undefined ? value : event.target.value
        );
    }

    render() {
        const { modalApplyShow, modalResetShow } = this.state;

        const {
            onApply,
            onReset,
            onChange,
            autoUpdate,
            postTelemetry,
            publicStat,
            useCustomSmtp,
            smtp,
            isSaved,
            error,
            isChanged,
        } = this.props;

        return (
            <section className='SystemSettings'>
                <div className='fz-20 fz-xs-18 mb-20'>System settings</div>
                <div className='color-nobel mb-25'>
                    Setup system settings and SMTP relay settings to send security notifications and service purpose
                </div>
                <Alert isSaved={ isSaved } error={ error } />
                <Form >
                    <div className='SystemSettings-item SystemSettings-switch-wrap'>
                        <div className='SystemSettings-label'>
                            <span className='SystemSettings-label-text'>
                                Software auto update
                            </span>
                            <Switch
                                id='autoUpdate'
                                value={ autoUpdate }
                                checked={ autoUpdate }
                                onChange={ onChange }
                            />
                        </div>
                    </div>
                    <div className='SystemSettings-item SystemSettings-switch-wrap'>
                        <div className='SystemSettings-label'>
                            <span className='SystemSettings-label-text'>
                                Post telemetry
                            </span>
                            <Switch
                                id='postTelemetry'
                                value={ postTelemetry }
                                checked={ postTelemetry }
                                onChange={ onChange }
                            />
                        </div>
                    </div>
                    <div className='SystemSettings-item SystemSettings-switch-wrap'>
                        <div className='SystemSettings-label'>
                            <span className='SystemSettings-label-text'>
                                Public stat
                            </span>
                            <Switch
                                id='publicStat'
                                value={ publicStat }
                                checked={ publicStat }
                                onChange={ onChange }
                            />
                        </div>
                    </div>
                    <div className='SystemSettings-item SystemSettings-switch-wrap'>
                        <div className='SystemSettings-label'>
                            <span className='SystemSettings-label-text'>
                                Use custom SMTP
                            </span>
                            <Switch
                                id='useCustomSmtp'
                                value={ useCustomSmtp }
                                checked={ useCustomSmtp }
                                onChange={ onChange }
                            />
                        </div>
                    </div>
                    <div className={'SystemSettings ' +  (!useCustomSmtp ? 'hidden' : '' )}>
                        <div className='SystemSettings-item'>
                            <ControlLabel className='SystemSettings-label'>
                                <span className='SystemSettings-label-text'>
                                    SMTP host
                                </span>
                                <FormControl
                                    type='text'
                                    id='smtp.host'
                                    value={ smtp.host }
                                    onChange={ this.onChange }
                                />
                            </ControlLabel>
                        </div>
                        <div className='SystemSettings-item is-short'>
                            <ControlLabel className='SystemSettings-label'>
                                <span className='SystemSettings-label-text'>
                                    SMTP port
                                </span>
                                <NumberFormControl
                                    type='number'
                                    id='smtp.port'
                                    value={ smtp.port }
                                    onChange={ this.onChange }
                                />
                            </ControlLabel>
                        </div>
                        <div className='SystemSettings-item'>
                            <ControlLabel className='SystemSettings-label'>
                                <span className='SystemSettings-label-text'>
                                    SMTP username
                                </span>
                                <FormControl
                                    type='text'
                                    id='smtp.username'
                                    value={ smtp.username }
                                    onChange={ this.onChange }
                                />
                            </ControlLabel>
                        </div>
                        <div className='SystemSettings-item'>
                            <ControlLabel className='SystemSettings-label'>
                                <span className='SystemSettings-label-text'>
                                    SMTP password
                                </span>
                                <FormControl
                                    type='password'
                                    id='smtp.password'
                                    value={ smtp.password }
                                    onChange={ this.onChange }
                                />
                            </ControlLabel>
                        </div>
                        <div className='SystemSettings-item'>
                            <ControlLabel className='SystemSettings-label'>
                                <span className='SystemSettings-label-text'>
                                    From address
                                </span>
                                <FormControl
                                    type='text'
                                    id='smtp.fromAddress'
                                    value={ smtp.fromAddress }
                                    onChange={ this.onChange }
                                />
                            </ControlLabel>
                        </div>
                        <div className='SystemSettings-item SystemSettings-switch-wrap'>
                            <div className='SystemSettings-label'>
                                <span className='SystemSettings-label-text'>
                                    SMTP SSl
                                </span>
                                <Switch
                                    id='smtp.ssl'
                                    value={ smtp.ssl }
                                    checked={ smtp.ssl }
                                    onChange={ onChange }
                                />
                            </div>
                        </div>
                    </div>
                    <div className='SystemSettings-btns'>
                        <Button
                            className='btn btn-blue'
                            onClick={ this.onModalApplyShowHide }
                            disabled={ !isChanged }
                        >
                            Apply changes
                        </Button>
                        <Button
                            className='btn btn-gray'
                            onClick={ this.onModalResetShowHide }
                            disabled={ !isChanged }
                        >
                            Reset
                        </Button>
                    </div>
                </Form>

                <Confirm
                    show={ modalApplyShow }
                    onHide={ this.onModalApplyShowHide }
                    onConfirm={ onApply }
                    title='Confirmation'
                    text='Do you go to apply the changes?'
                />

                <Confirm
                    show={ modalResetShow }
                    onHide={ this.onModalResetShowHide }
                    onConfirm={ onReset }
                    title='Confirmation'
                    text='Do you go to reset?'
                />
            </section>
        );
    }
}

SystemSettings.propTypes = {
    onApply: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    autoUpdate: PropTypes.bool,
    postTelemetry: PropTypes.bool,
    publicStat: PropTypes.bool,
    useCustomSmtp: PropTypes.bool,
    smtp: PropTypes.shape({
        host: PropTypes.string,
        port: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        username: PropTypes.string,
        password: PropTypes.string,
        ssl: PropTypes.bool,
        fromAddress: PropTypes.string,
    }),
    isSaved: PropTypes.bool,
    error: PropTypes.shape({
        code: PropTypes.number,
        message: PropTypes.string,
    }),
    isChanged: PropTypes.bool,
};

export default SystemSettings;
