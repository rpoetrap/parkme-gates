/**
 * When a Freefare object is created, it automatically initialize LibNFC. Once initialized, you can list available NFC devices.
 */
export default class Freefare {
	/**
	 * Give a list of available NFC devices
	 */
	listDevices(): Promise<Device[]>;	
}

/**
 * A NibNFC compatible device that can read NFC tag.
 * The `open()` method have to be executed before any other.
 */
export class Device {
	constructor(cppDevice: any);

	/**
	 * Open device for further communication
	 */
	open(): Promise<void>;

	/**
	 * Close device to release memory and device
	 */
	close(): Promise<void>;

	/**
	 * List of detected tags
	 */
	listTags(): Promise<Array<Tag|MifareUltralightTag|MifareClassicTag|MifareDesfireTag>>;

	/**
	 * Try to abort the current blocking command
	 */
	abort(): Promise<void>;
}

/**
 * A Freefare compatible NFC tag
 */
export class Tag {
	constructor(cppTag: any);

	/**
	 * Get Tag type
	 */
	getType(): string;

	/**
	 * Get Tag friendly name
	 */
	getFriendlyName(): string;

	/**
	 * Get Tag UID
	 */
	getUID(): string;
}

/**
 * A MIFARE Ultralight tag
 */
export class MifareUltralightTag extends Tag {
	constructor(cppTag: any);

	/**
	 * Open tag for further communication
	 */
	open(): Promise<void>;

	/**
	 * Close tag to release memory and device
	 */
	close(): Promise<void>;
	read(page: number): Promise<Buffer>;
	write(page: number, buf: Buffer): Promise<void>;
}

export class MifareClassicTag extends Tag {
	constructor(cppTag: any);

	/**
	 * Open tag for further communication
	 */
	open(): Promise<void>;

	/**
	 * Close tag to release memory and device
	 */
	close(): Promise<void>;

	/**
	 * After openning the tag, an authentication is required for further operation.
	 * @param block The block number between 0 and 63 (for 1k)
	 * @param key The key
	 * @param keyType "A" or "B"
	 */
	authenticate(block: number, key: Buffer, keyType: 'A' | 'B'): Promise<void>;

	/**
	 * Read the given block
	 * @param block The block number between 0 and 63 (for 1k)
	 */
	read(block: number): Promise<Buffer>;

	/**
	 * Write on the given block
	 * @param block The block number between 0 and 63 (for 1k)
	 * @param data A 16 byte buffer (for 1k)
	 */
	write(block: number, data: Buffer): Promise<void>;

	/**
	 * Initialize a value block, with the given value and address
	 * @param block The block number between 0 and 63 (for 1k)
	 * @param value The Int32 value that will be stored
	 * @param adr A 1 byte address which can be used to save the storage address of a block, when implementing a powerful backup management
	 */
	initValue(block: number, value: number, adr: string): Promise<void>;

	/**
	 * Read a value block
	 * @param block The block number between 0 and 63 (for 1k)
	 */
	readValue(block: number): Promise<{ value: number, adr: number }>;

	/**
	 * Increment the block value by a given amount and store it in the internal data register
	 * @param block The block number between 0 and 63 (for 1k)
	 * @param amount The amount that will be added to the value
	 */
	incrementValue(block: number, amount: number): Promise<void>;

	/**
	 * Decrement the block value by a given amount and store it in the internal data register
	 * @param block The block number between 0 and 63 (for 1k)
	 * @param amount The amount that will be remove from the value
	 */
	decrementValue(block: number, amount: number): Promise<void>;

	/**
	 * Put a block value from in the internal data register
	 * @param block The block number between 0 and 63 (for 1k)
	 */
	restoreValue(block: number): Promise<void>;

	/**
	 * Restore the internal data register to the given block value
	 * @param block The block number between 0 and 63 (for 1k)
	 */
	transferValue(block: number): Promise<void>;
}

export class MifareDesfireTag extends Tag {
	constructor(cppTag: any);

	/**
	 * Open tag for further communication
	 */
	open(): Promise<void>;

	/**
	 * Close tag to release memory and device
	 */
	close(): Promise<void>;

	/**
	 * Authenticate with a DES key
	 * @param KeyNum The number of the key
	 * @param key The 8 byte key
	 */
	authenticateDES(KeyNum: number, key: Buffer): Promise<void>;

	/**
	 * Authenticate with a 3DES key
	 * @param KeyNum The number of the key
	 * @param key The 16 byte key
	 */
	authenticate3DES(KeyNum: number, key: Buffer): Promise<void>;

	/**
	 * List application IDs (AID)
	 */
	getApplicationIds(): Promise<number[]>;

	/**
	 * Select an application
	 * @param aid Application id in a 3 bytes Buffer
	 */
	selectApplication(aid: Buffer): Promise<void>;

	/**
	 * List file IDs (AID)
	 */
	getFileIds(): Promise<number[]>;

	/**
	 * Read the given file
	 * @param file The file ID
	 * @param offset The number of bytes before we start reading in the file
	 * @param length The number of bytes we will read in the file
	 */
	read(file: number, offset: number, length: number): Promise<Buffer>;

	/**
	 * Write on the given file
	 * @param file The file ID
	 * @param offset The number of bytes before we start reading in the file
	 * @param length The number of bytes we will read in the file
	 * @param data A data buffer
	 */
	write(file: number, offset: number, length: number, data: Buffer): Promise<void>;
}