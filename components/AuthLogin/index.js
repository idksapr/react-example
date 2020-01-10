import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form, FormGroup,
    Col, ControlLabel, FormControl,
    Button, Row, Grid } from 'react-bootstrap';
import './AuthLogin.scss';

const AuthLogin = props =>
    <section className='AuthLogin'>
        <Grid  bsClass='AuthLogin-container container'>
            <Row className='show-grid'>
                <Col xsHidden md={4} />
                <Col>
                    <Form onSubmit={props.onSubmit}>
                        <FormGroup className='message-container-wrap'>
                            <Col>
                                <div className='message-container'>
                                    {props.isFetching ? 'Auth...' : props.error}
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <h3 className='AuthLogin-header'>Log in</h3>
                        </FormGroup>
                        <FormGroup controlId='email'>
                            <Col className='field'>
                                <Col componentClass={ControlLabel} >
                                    Email
                                </Col>
                                <FormControl
                                    type='email'
                                    name='email'
                                    placeholder='Email'
                                    value={props.email}
                                    onChange={props.onChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='password'>
                            <Col className='field'>
                                <Col componentClass={ControlLabel}>
                                    Password
                                </Col>
                                <FormControl
                                    type='password'
                                    name='password'
                                    placeholder='Password'
                                    value={props.password}
                                    onChange={props.onChange}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col>
                                <input type='checkbox' id='ch-1' className='checkbox-style'/>
                                <label htmlFor='ch-1'>Remember me</label>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col>
                                <Button type='submit'>Log in</Button>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <div className='AuthLogin-forgetPassword'>
                                <Link to={''} className='AuthLogin-forgetpassword-link'><span>Forgot your password?</span></Link>
                            </div>
                        </FormGroup>

                    </Form>
                </Col>
            </Row>
        </Grid>
    </section>;

AuthLogin.propTypes = {
    email: PropTypes.string,
    password: PropTypes.string,
    error: PropTypes.string,
    isFetching: PropTypes.bool,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
};

export default AuthLogin;
