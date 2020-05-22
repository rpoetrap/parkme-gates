import { GPIO } from 'pigpio-client';
import PiGPIO from './Pigpio';

/**
 * Gate status for servo pulse width (500-2500)
 */
const Gate = {
  open: 500,
  close: 1500
}

/**
 * Contains barrier gate function. eg: open and close. Usage: new Barrier().setup(pin)
 */
export default class Barrier {
  private gpioPin!: number;
  private servo!: GPIO;
  private ready = false;

  /**
   * Setup GPIO Pin for servo sensor
   * @param gpioPin Number of GPIO Pin
   */
  async setup(gpioPin: number) {
    this.gpioPin = gpioPin;
    const myGpio = await PiGPIO;
    this.servo = myGpio.gpio(this.gpioPin);
    await this.servo.modeSet('output');
    this.ready = true;
    return this;
  }

  /**
   * Set barrier gate to open
   */
  open() {
    try {
      if (this.ready) this.servo.setServoPulsewidth(Gate.open);
    } catch (e) {
      console.error(`Could not open barrier gate with pin ${this.gpioPin}. ${e}`);
    }
  }

  /**
   * Set barrier gate to close
   */
  close() {
    try {
      if (this.ready) this.servo.setServoPulsewidth(Gate.close);
    } catch (e) {
      console.error(`Could not close barrier gate with pin ${this.gpioPin}. ${e}`);
    }
  }
}