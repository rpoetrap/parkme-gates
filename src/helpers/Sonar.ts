import { GPIO } from 'pigpio-client';
import PiGPIO from './Pigpio';

/**
 * Contains sonar function. Usage: new Barrier().setup(pin)
 */
export default class Sonar {
  private triggerPin!: number;
  private echoPin!: number;
  private trigger!: GPIO;
  private echo!: GPIO;
  private distances: number[] = [];

  /**
   * Setup GPIO Pin for sonar sensor
   * @param triggerPin GPIO Pin number for trigger
   * @param echoPin GPIO Pin number for echo
   */
  async setup(triggerPin: number, echoPin: number) {
    const myGpio = await PiGPIO;
    
    // Setup trigger pin
    this.triggerPin = triggerPin;
    this.trigger = myGpio.gpio(this.triggerPin);
    await this.trigger.modeSet('output');
    await this.trigger.write(0);
    
    // Setup echo pin
    this.echoPin = echoPin;
    this.echo = myGpio.gpio(this.echoPin);
    await this.echo.modeSet('input');

    // Setup sonar notifier
    const MICROSECDONDS_PER_CM = 1e6/34321; // The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
    let startTick: number;
    this.echo.notify((level, tick) => {
      if (level == 1) {
        startTick = tick;
      } else {
        const endTick = tick;
        const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
        const distance = (diff / 2 / MICROSECDONDS_PER_CM);
        this.distances.push(distance);
      }
    });
    return this;
  }

  /**
   * Get approximate distance in centimeters (cm)
   */
  getDistance() {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          // Cleaning distance data
          this.distances.shift();
    
          // Calculate distance average
          const sum = this.distances.reduce((a, b) => a + b, 0);
          const avg = (sum / this.distances.length) || 0;

          // Reset distances
          this.distances = [];

          resolve(avg);
        }, 500);
      } catch (e) {
        reject(e);
      }
    });
  }
}