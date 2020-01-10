import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form, ControlLabel, FormControl, Dropdown, MenuItem, Button } from 'react-bootstrap';
import Switch from '../common/CustomizedSwitch';
import Confirm from '../Confirm';
import Alert from '../AlertMessage';
import './UserSettings.scss';

class UserSettings extends React.Component  {
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

    onChange(event, value, name) {
        this.props.onChange(
            event,
            value !== undefined ? value : event.target.value,
            name !== undefined ? name : event.target.id
        );
    }

    render() {
        const { modalApplyShow, modalResetShow } = this.state;

        const {
            onApply,
            onReset,
            email,
            expiration,
            emailNotifications,
            otpLogin,
            otpSettings,
            otpPassword,
            otpRestart,
            otpMethod,
            encryptConfig,
            isFetching,
            isSaved,
            error,
            isChanged,
        } = this.props;

        return (
            <section className='UserSettings'>
                <div className='fz-20 fz-xs-18 mb-20'>Security settings</div>
                <Alert isSaved={ isSaved } isFetching={ isFetching } error={ error } />
                <div className='color-nobel mb-25'>
                    Setup basic security settings:
                </div>
                <Form>
                    <div className='UserSettings-item'>
                        <ControlLabel className='UserSettings-label'>
                            <span className='UserSettings-label-text'>
                                Email
                            </span>
                            <FormControl
                                type='text'
                                id='email'
                                value={ email }
                                onChange={ this.onChange }
                            />
                        </ControlLabel>
                    </div>
                    <div className='UserSettings-item is-short'>
                        <ControlLabel className='UserSettings-label'>
                            <span className='UserSettings-label-text'>
                                Auto logout interval (s)
                            </span>
                            <Dropdown
                                className='dropdown-select'
                                id='expiration'
                            >
                                <Dropdown.Toggle className='dropdown-select-btn'>
                                    { expiration ? expiration : 'Disabled' }
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {[0, 300, 600, 1200, 1800, 3600].map((item, key) =>
                                        <MenuItem
                                            key={key}
                                            value={item}
                                            eventKey={item}
                                            onSelect={ (value, event) => this.onChange(event, value, 'expiration') }
                                        >
                                            {item == 0 ? 'Disabled' : item}
                                        </MenuItem>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </ControlLabel>
                    </div>
                    <div className='UserSettings-item UserSettings-switch-wrap'>
                        <div className='UserSettings-label'>
                            <span className='UserSettings-label-text'>
                                Email notifications
                            </span>
                            <Switch
                                id='emailNotifications'
                                value={ emailNotifications }
                                checked={ emailNotifications }
                                color='primary'
                                onChange={ this.onChange }
                            />
                        </div>
                    </div>
                    <div className='UserSettings-item UserSettings-switch-wrap'>
                        <div className='UserSettings-label'>
                            <span className='UserSettings-label-text'>
                                Encrypt config
                            </span>
                            <Switch
                                id='encryptConfig'
                                value={ encryptConfig }
                                checked={ encryptConfig }
                                color='primary'
                                onChange={ this.onChange }
                            />
                        </div>
                    </div>

                    <div className='color-nobel mb-25 mt-25'>
                        {
                            otpMethod == 'none' ?
                                <p>
                                    OTP settings cannot be configured and do not work because 2-step verification is disabled
                                    (<b><Link to={'/configuration/user/2-step-verification'}>enable 2-step verification</Link></b>)
                                </p> :
                                <p>Actions protected by 2-step verification:</p>
                        }
                    </div>
                    <div className='UserSettings-item UserSettings-switch-wrap'>
                        <div className='UserSettings-label'>
                            <span className='UserSettings-label-text'>
                                Login to system
                            </span>
                            <Switch
                                id='otpLogin'
                                value={ otpLogin }
                                checked={ otpLogin }
                                color='primary'
                                disabled={ otpMethod == 'none' }
                                onChange={ this.onChange }
                            />
                        </div>
                    </div>
                    <div className='UserSettings-item UserSettings-switch-wrap'>
                        <div className='UserSettings-label'>
                            <span className='UserSettings-label-text'>
                                Change Miner settings
                            </span>
                            <Switch
                                id='otpSettings'
                                value={ otpSettings }
                                checked={ otpSettings }
                                color='primary'
                                disabled={ otpMethod == 'none' }
                                onChange={ this.onChange }
                            />
                        </div>
                    </div>
                    <div className='UserSettings-item UserSettings-switch-wrap'>
                        <div className='UserSettings-label'>
                            <span className='UserSettings-label-text'>
                                Change password
                            </span>
                            <Switch
                                id='otpPassword'
                                value={ otpPassword }
                                checked={ otpPassword }
                                color='primary'
                                disabled={ otpMethod == 'none' }
                                onChange={ this.onChange }
                            />
                        </div>
                    </div>
                    <div className='UserSettings-item UserSettings-switch-wrap'>
                        <div className='UserSettings-label'>
                            <span className='UserSettings-label-text'>
                                Restart and Turn Off Miner
                            </span>
                            <Switch
                                id='otpRestart'
                                value={ otpRestart }
                                checked={ otpRestart }
                                color='primary'
                                disabled={ otpMethod == 'none' }
                                onChange={ this.onChange }
                            />
                        </div>
                    </div>
                    <div className='UserSettings-btns'>
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

UserSettings.propTypes = {
    onApply: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    email: PropTypes.string,
    expiration: PropTypes.number,
    emailNotifications: PropTypes.bool,
    otpLogin: PropTypes.bool,
    otpSettings: PropTypes.bool,
    otpPassword: PropTypes.bool,
    otpRestart: PropTypes.bool,
    otpMethod: PropTypes.string,
    encryptConfig: PropTypes.bool,
    isFetching: PropTypes.bool,
    isSaved: PropTypes.bool,
    error: PropTypes.shape({
        code: PropTypes.number,
        message: PropTypes.string,
    }),
    isChanged: PropTypes.bool,
};

export default UserSettings;
