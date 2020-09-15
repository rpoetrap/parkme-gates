import { GPIO } from 'pigpio-client';
import PiGPIO from './Pigpio';

/**
 * Traffic LED Configuration
 */
export type TrafficConfig = {
	red: number;
	yellow: number;
	green: number;
	[key: string]: number;
}

/**
 * LED Color
 */
type Color = 'red' | 'yellow' | 'green';

/**
 * GPIO for Traffic LED
 */
type TrafficGPIO = {
	red: GPIO;
	yellow: GPIO;
	green: GPIO;
	[key: string]: GPIO;
}

/**
 * Contains LED function to turn on specific LED color
 */
export default class Led {
  private gpioPin!: TrafficConfig;
  private led!: TrafficGPIO;
  private ready = false;

	/**
	 * Setup GPIO Pin for LED
	 * @param config.red Red LED GPIO Pin number 
	 * @param config.yellow Yellow LED GPIO Pin number 
	 * @param config.green Green LED GPIO Pin number 
	 */
  async setup(config: TrafficConfig) {
		this.gpioPin = config;
		const myGpio = await PiGPIO;
		const trafficLed: any = {};
		for (const color of Object.keys(config)) {
			trafficLed[color] = myGpio.gpio(this.gpioPin[color]);
			await trafficLed[color].modeSet('output');
		}
		this.led = trafficLed;
		this.ready = true;
    return this;
  }

	/**
	 * Set traffic LED color to red, yellow, or green
	 * @param color LED color. eg: red, yellow, green
	 */
  setColor(color: Color) {
    try {
			if (this.ready) {
				for (const ledColor of Object.keys(this.led)) {
					if (ledColor == color) {
						this.led[ledColor].write(1);
					} else {
						this.led[ledColor].write(0);
					}
				}
			}
    } catch (e) {
      console.error(`Could not turn led ${color} with pin ${this.gpioPin[color]}. ${e}`);
    }
  }
}