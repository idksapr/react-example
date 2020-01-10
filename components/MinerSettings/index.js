import React from 'react';
import PropTypes from 'prop-types';
import Slider from '../common/CustomizedSlider';
import Confirm from '../Confirm';
import Alert from '../AlertMessage';
import { hexToDec, decToHex } from '../../store/utils';
import { Button } from 'react-bootstrap';
import './MinerSettings.scss';

class MinerSettings extends React.Component {
    PSU_VOLTAGE_MIN = 44;
    PSU_VOLTAGE_MAX = 53;
    PSU_VOLTAGE_STEP = 1;

    OSCILATOR_MIN = 0;
    OSCILATOR_MAX = 60;
    OSCILATOR_STEP = 1;

    LOG_DELAY_MIN = 1;
    LOG_DELAY_MAX = 60;
    LOG_DELAY_STEP = 1;

    FAN_POWER_MIN = 0;
    FAN_POWER_MAX = 100;
    FAN_POWER_STEP = 1;

    OCP_MIN = 0;
    OCP_MAX = hexToDec('7F');
    OCP_STEP = 1;

    constructor(props) {
        super(props);

        this.onModalApplyShowHide = this.onModalApplyShowHide.bind(this);
        this.onModalResetShowHide = this.onModalResetShowHide.bind(this);

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

    onChange(name, event, value) {
        this.props.onChange(event, name, value);
    }

    render(){
        const { modalApplyShow, modalResetShow } = this.state;

        const { onApply, onReset, psuVoltage, oscillator, logDelay,
            ocp, fanPower, isSaved, error, isChanged } = this.props;

        return (
            <section className='MinerSettings'>
                <div className='fz-20 fz-xs-18 mb-25'>Miner Configuration</div>

                <Alert isSaved={ isSaved } error={ error } />

                <div className='MinerSettings-item'>
                    <div className='MinerSettings-item-text'>PSU Voltage</div>
                    <div className='MinerSettings-slider-wrap'>
                        <Slider
                            id='psuVoltage'
                            value={ psuVoltage }
                            aria-labelledby='label'
                            min={ this.PSU_VOLTAGE_MIN }
                            max={ this.PSU_VOLTAGE_MAX }
                            step={ this.PSU_VOLTAGE_STEP }
                            onChange={ this.onChange.bind(this, 'psuVoltage') }
                            color='red'
                        />
                    </div>
                    <div className='MinerSettings-slider-value'>{ psuVoltage } V</div>
                </div>

                <div className='MinerSettings-item'>
                    <div className='MinerSettings-item-text'>Oscillator value</div>
                    <div className='MinerSettings-slider-wrap'>
                        <Slider
                            id='oscillator'
                            value={ oscillator }
                            min={ this.OSCILATOR_MIN }
                            max={ this.OSCILATOR_MAX }
                            step={ this.OSCILATOR_STEP }
                            aria-labelledby='label'
                            onChange={ this.onChange.bind(this, 'oscillator') }
                        />
                    </div>
                    <div className='MinerSettings-slider-value'>{ oscillator }</div>
                </div>

                <div className='MinerSettings-item'>
                    <div className='MinerSettings-item-text'>FAN Power</div>
                    <div className='MinerSettings-slider-wrap'>
                        <Slider
                            id='fanPower'
                            value={ fanPower }
                            aria-labelledby='label'
                            min={ this.FAN_POWER_MIN }
                            max={ this.FAN_POWER_MAX }
                            step={ this.FAN_POWER_STEP }
                            onChange={ this.onChange.bind(this, 'fanPower') }
                        />
                    </div>
                    <div className='MinerSettings-slider-value'>{ fanPower } %</div>
                </div>

                <div className='MinerSettings-item'>
                    <div className='MinerSettings-item-text'>Over current protection level</div>
                    <div className='MinerSettings-slider-wrap'>
                        <Slider
                            id='ocp'
                            value={ ocp }
                            min={ this.OCP_MIN }
                            max={ this.OCP_MAX }
                            step={ this.OCP_STEP }
                            onChange={ this.onChange.bind(this, 'ocp') }
                        />
                    </div>
                    <div className='MinerSettings-slider-value'>{ decToHex(ocp) } HEX</div>
                </div>

                <div className='MinerSettings-item'>
                    <div className='MinerSettings-item-text'>Log output interval</div>
                    <div className='MinerSettings-slider-wrap'>
                        <Slider
                            id='logDelay'
                            value={ logDelay }
                            min={ this.LOG_DELAY_MIN }
                            max={ this.LOG_DELAY_MAX }
                            step={ this.LOG_DELAY_STEP }
                            aria-labelledby='label'
                            onChange={ this.onChange.bind(this, 'logDelay') }
                        />
                    </div>
                    <div className='MinerSettings-slider-value'>{ logDelay } s</div>
                </div>

                <div className='MinerSettings-btns mt-35'>
                    <Button
                        className='btn btn-blue'
                        onClick={ this.onModalApplyShowHide }
                        disabled={!isChanged}
                    >
                        Apply changes
                    </Button>
                    <Button
                        className='btn btn-gray'
                        onClick={ this.onModalResetShowHide }
                        disabled={!isChanged}
                    >
                        Reset
                    </Button>
                </div>

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

MinerSettings.propTypes = {
    onApply: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    psuVoltage: PropTypes.number,
    oscillator: PropTypes.number,
    logDelay: PropTypes.number,
    ocp: PropTypes.number,
    fanPower: PropTypes.number,
    isSaved: PropTypes.bool,
    error: PropTypes.shape({
        code: PropTypes.number,
        message: PropTypes.string,
    }),
    isChanged: PropTypes.bool,
};

export default MinerSettings;
