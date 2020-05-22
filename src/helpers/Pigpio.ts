import { pigpio, PiGPIO } from 'pigpio-client';

const myGpio = pigpio({ host: process.env.PIGPIO_HOST });
const gpioReady = new Promise<PiGPIO>((resolve, reject) => {
  myGpio.once('connected', () => (resolve(myGpio)));
  myGpio.once('error', reject);
});

export default gpioReady;