interface Options {
  clock?: number;
  miso?: number;
  mosi?: number;
  client?: number;
  clientSelect?: number;
  mode?: number;
  bitOrder?: number;
}

export default class SoftSPI {
  constructor(options: Options);

  static get MSB(): number;
  static get LSB(): number;

  assert(expression: boolean, message: string): void;

  set mode(value: number);
  get mode();
  set bitOrder(order: number);
  get bitOrder();

  static pinVal(value: number): number;

  get clockOn(): number;
  get clockOff(): number;
  get clientOn(): number;
  get clientOff(): number;

  open(): this;
  activateClient(): void;
  deactivateClient(): void;
  read(bytes: number): Uint8Array;
  write(data: Iterable<number>): this;
  transferBit(byte: number, offset: number, read: boolean, write: boolean): number;
  transferByte(byte: number, read: boolean, write: boolean): number;
  transfer(data: Iterable<number>, read: boolean, write: boolean): Uint8Array;
  close(): this;

  static shiftLeft(value: number, offset: number): number;
  static shiftRight(value: number, offset: number): number;
}