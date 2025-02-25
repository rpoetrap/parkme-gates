import Freefare, { Device } from 'freefare';
import { isNil } from 'lodash';
import { TrafficConfig } from '../helpers/Led';

export const barrierGate = 24;
export const sonar = {
	trigger: 20,
	echo: 21
};
export const led: TrafficConfig = {
	red: 21,
	yellow: 20,
	green: 16
}

let rfidDevice: Device;
export const setupRfid = async () => {
	if (isNil(rfidDevice)) {
		let freefare = new Freefare();
		const devices = await freefare.listDevices();
		if (devices.length > 0) rfidDevice = devices[0];
		await rfidDevice.open();
	}
	return rfidDevice;
}

export const getRfidUid = async () => {
	let cardUid;
	if (isNil(rfidDevice)) {
		throw new Error('No RFID Device');
	}
	const tags = await rfidDevice.listTags();
	if (tags.length > 0) {
		cardUid = tags[0].getUID();
	}
	return cardUid;
}