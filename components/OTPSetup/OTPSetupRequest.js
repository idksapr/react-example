import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Alert from '../AlertMessage';
import './OTPSetup.scss';

const OTPSetupRequest = props =>
    <section className='OTPSetup'>
        <div className='OTPSetup-title'>
            2-step Verification ( current: { props.otpMethods[props.otpMethod] } )
        </div>

        <Alert error={ props.error } />

        <div className='OTPSetup-btns'>
            { props.otpMethod == 'none' ?
                <section>
                    <Button
                        className='btn btn-blue'
                        onClick={ () => props.onApply('email') }
                    >
                        Email
                    </Button>
                    <Button
                        className='btn btn-blue'
                        onClick={ () => props.onApply('totp') }
                    >
                        Google Authenticator
                    </Button>
                </section> :
                <Button
                    className='btn btn-gray'
                    onClick={ () => props.onApply('none') }
                >
                    Disable
                </Button>
            }
        </div>
    </section>;

OTPSetupRequest.propTypes = {
    onApply: PropTypes.func.isRequired,
    otpMethod: PropTypes.string,
    otpMethods: PropTypes.object,
    error: PropTypes.shape({
        code: PropTypes.number,
        message: PropTypes.string,
    }),
};

export default OTPSetupRequest;
