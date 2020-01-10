import React from 'react';
import PropTypes from 'prop-types';
import { Form, ControlLabel, FormControl, Button, FormGroup } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import Alert from '../AlertMessage';
import './OTPSetup.scss';

class OTPValidate extends React.Component {
    constructor(props) {
        super(props);

        this.next = this.next.bind(this);

        this.state = {
            isGAView: !!props.secret,
        };
    }

    next() {
        this.setState({ isGAView: false });
    }

    render() {
        const {
            authed,
            message,
            error,
            onApply,
            onEnterValidationCode,
            isChanged,
            secret,
            secretURI,
        } = this.props;

        return <section className={ `OTPSetup${ authed ? '' : ' not-authed' }` }>
            <Alert
                isSaved={ !!message }
                successMessage={ message }
                error={ error }
            />
            <div className='OTPSetup-wrapper'>
                <div className='OTPSetup-title'>2-step Verification</div>
                { this.state.isGAView ?
                    <section>
                        <QRCode
                            value={ secretURI }
                            includeMargin={ true }
                            level='Q'
                            size={ 254 }
                        />
                        <span className='OTPSetup-secret'>{ secret }</span>
                        <div className='OTPSetup-btns'>
                            <Button
                                className='btn btn-blue'
                                onClick={ this.next }
                            >
                                Next
                            </Button>
                        </div>
                    </section> :
                    <section className='OTPSetup-section-form'>
                        <Form onSubmit={ onApply }>
                            <div className='OTPSetup-item'>
                                <ControlLabel className='OTPSetup-label'>
                                    <span className='OTPSetup-label-text'>
                                        Code
                                    </span>
                                    <FormControl
                                        type='text'
                                        id='validaionCode'
                                        className='is-mini'
                                        onChange={ event => onEnterValidationCode(event.target.value) }
                                    />
                                </ControlLabel>
                            </div>

                            <div className='OTPSetup-btns'>
                                <FormGroup>
                                    <Button
                                        className='btn btn-blue'
                                        type='submit'
                                        disabled={ !isChanged }
                                    >
                                        Send
                                    </Button>
                                </FormGroup>
                            </div>
                        </Form>
                    </section>
                }
            </div>





        </section>;
    }
}

OTPValidate.propTypes = {
    onApply: PropTypes.func.isRequired,
    onEnterValidationCode: PropTypes.func.isRequired,
    isChanged: PropTypes.bool,
    error: PropTypes.shape({
        code: PropTypes.number,
        message: PropTypes.string,
    }),
    message: PropTypes.string,
    authed: PropTypes.bool,
    secret: PropTypes.string,
    secretURI: PropTypes.string,
};

export default OTPValidate;
