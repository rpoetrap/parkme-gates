import { EventEmitter } from 'events';

interface Configuration {
  host?: string;
  port?: number;
  pipelining?: boolean;
  timeout?: number;
}

interface Info {
  host: string;
  port: number;
  pipelining: boolean;
  commandSocket: any;
  notificationSocket: any;
  pigpioVersion: string;
  hwVersion: string;
  hardware_type: number;
  userGpioMask: number;
  timeout: number;
  version: string;
}

interface Param {
  loop?: boolean;
  waves?: number[];
  repeat?: boolean;
}

type Callback = (error: Error, ...args: any) => any;
type Pulse = [number, number, number];
type Mode = 'output' | 'input';
type SerialMode = 'invert' | 'normal';

declare class GPIO extends PiGPIO {
  // basic methods
  modeSet(mode: Mode, callback?: Callback): Promise<any>;
  pullUpDown(pud: number, callback?: Callback): Promise<any>;
  write(level: number, callback?: Callback): Promise<any>;
  read(callback?: Callback): Promise<any>;
  modeGet(callback?: Callback): Promise<any>;

  // PWM
  analogWrite(dutyCycle: number, cb?: Callback): Promise<any>;

  // Notification methods
  notify(callback: Callback): any;
  endNotify(cb: Callback): void;

  // glitch
  glitchSet(steady: number, callback?: Callback): Promise<any>;

  // Waveform generation methods
  waveClear(callback?: Callback): Promise<any>;
  waveCreate(callback: Callback): Promise<any>;
  waveBusy(callback: Callback): Promise<any>;
  waveNotBusy(cb: Callback): Promise<any>;
  waveNotBusy(time: number, cb: Callback): Promise<any>;
  waveAddPulse(tripletArr: Pulse[], callback?: Callback): Promise<any>;
  waveChainTx(paramArray: Param[], callback?: Callback): Promise<any>;
  waveTxStop(cb?: Callback): Promise<any>;
  waveSendSync(wid: number, cb?: Callback): Promise<any>;
  waveSendOnce(wid: number, cb?: Callback): Promise<any>;
  waveTxAt(cb?: Callback): Promise<any>;
  waveDelete(wid: number, cb?: Callback): Promise<any>;

  // Pulse Width Modulation
  setPWMdutyCycle(dutyCycle: number, cb?: Callback): Promise<any>;
  setPWMfrequency(freq: number, cb?: Callback): Promise<any>;
  getPWMdutyCycle(cb?: Callback): Promise<any>;
  hardwarePWM(frequency: number, dutyCycle: number, callback?: Callback): Promise<any>;

  // Servo pulse width
  setServoPulsewidth(pulseWidth: number, cb?: Callback): Promise<any>;
  getServoPulsewidth(cb?: Callback): Promise<any>;

  // Bit-Bang Serial IO
  serialReadOpen(baudRate: number, dataBits: number, callback?: Callback): Promise<any>;
  serialRead(count: number, callback: Callback): Promise<any>;
  serialReadClose(callback?: Callback): Promise<any>;
  serialReadInvert(mode: SerialMode, callback?: Callback): Promise<any>;
  waveAddSerial(baud: number, bits: number, delay: number, data: ArrayBuffer, callback?: Callback): Promise<any>;
}

declare class SerialPort extends PiGPIO {
  open(baudrate: number, databits: number, cb?: Callback): void;
  read(size: number, cb: Callback): void;
  write(data: string | Buffer): number;
  close(callback?: Callback): void;
  end(callback?: Callback): void;
}

declare class PiGPIO extends EventEmitter {
  request(cmd: number, p1: number, p2: number, p3: number, cb: Callback, extArrBuf: Buffer): Promise<any>;
  connect(): void;

  startNotifications(bits: number, cb?: Callback): number;
  pauseNotifications(cb?: Callback): Promise<any>;
  stopNotifications(id: number, cb?: Callback): Promise<any>;
  closeNotifications(cb?: Callback): Promise<any>;

  getInfo(): Info;
  getHandle(): number;
  getCurrentTick(cb?: Callback): Promise<any>;
  readBank1(cb?: Callback): Promise<any>;
  hwClock(gpio: number, freq: number, cb?: Callback): Promise<any>;
  destroy(): void;
  end(cb: Callback): void;

  i2cOpen(bus: number, device: number, callback?: Callback): Promise<any>;
  i2cClose(handle: number, callback?: Callback): Promise<any>;
  i2cReadDevice(handle: number, count: number, callback?: Callback): Promise<any>;
  i2cWriteDevice(handle: number, data: ArrayBuffer, callback?: Callback): Promise<any>;
  bscI2C(address: number, data: ArrayBuffer, callback?: Callback): Promise<any>;

  gpio(gpio: number): GPIO;
  serialport(rx: number, tx: number, dtr: number): SerialPort;
}

export function pigpio(pi: Configuration): PiGPIO;