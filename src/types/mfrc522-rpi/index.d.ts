import SoftSPI from "rpi-softspi";

interface Card {
  status: boolean;
  data: number[];
  bitSize: number;
}

export default class MFRC522 {
  constructor(spi: SoftSPI)

  setResetPin(pin: number): this;
  setBuzzerPin(pin: number): this;
  reset(): void;
  writeRegister(addr: number, val: number): void;
  alert(): void;
  readRegister(addr: number): number;
  setRegisterBitMask(reg: number, mask: number): void;
  clearRegisterBitMask(reg: number, mask: number): void;
  antennaOn(): void;
  antennaOff(): void;
  toCard(command: number, bitsToSend: number[]): Card;
  findCard(): Card;
  getUid(): Card;
  calculateCRC(data: number[]): number[];
  selectCard(uid: number[]): number;
  authenticate(address: number, key: number[], uid: number[]): boolean;
  stopCrypto(): void;
  getDataForBlock(address: number): number[];
  appendCRCtoBufferAndSendToCard(buffer: number[]): Card;
  writeDataToBlock(address: number, sixteenBits: Uint16Array): void;
  writeAuthenticationKey(address: number, newKeyA: number[]): void;

  static alert(): void;
}