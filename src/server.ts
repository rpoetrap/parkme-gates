import { isNil } from 'lodash';
import readline from 'readline-sync';
import FormData from 'form-data';
import fs from 'fs';
import { Device } from 'freefare';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import * as sensor from './configs/sensor';
import { findIp } from './helpers/Scanner';
import axios from './helpers/axios';
import { APIResponse } from './types';
import Barrier from './helpers/Barrier';
import Led from './helpers/Led';
import camera from './configs/camera';

interface runArgs {
	host: string;
	barrierTimeout: NodeJS.Timeout;
}

let rfid: Device;
let barrier: Barrier;
let trafficLED: Led;

const checkAuth = async (host: string) => {
	const { data: authResult } = await axios.request<APIResponse>({
		url: `${host}/api/gates/check`,
		method: 'GET'
	});

	if (authResult?.error) {
		if (authResult.error.code == 401) {
			let retry = false;
			console.log('Registrasi Palang Parkir');

			do {
				const code = readline.questionInt('Masukkan kode unik: ');
				const { data: registerResult } = await axios.request<APIResponse>({
					url: `${host}/api/gates/register`,
					method: 'PATCH',
					data: { code }
				});

				if (registerResult.error) {
					if (registerResult.error.code == 400) {
						if (registerResult.error.errors?.length) {
							console.log(registerResult.error.errors[0].message);
						} else {
							console.log(registerResult.error.message);
						}
						retry = true;
					} else {
						if (registerResult.error.errors?.length) {
							throw new Error(registerResult.error.errors[0].message);
						} else {
							throw new Error(registerResult.error.message);
						}
					}
				}
				if (registerResult.data) retry = false;
			} while (retry);
		} else {
			if (authResult.error.errors?.length) {
				throw new Error(authResult.error.errors[0].message);
			} else {
				throw new Error(authResult.error.message);
			}
		}

		return false;
	}
	return true
}

(async () => {
	rfid = await sensor.setupRfid();
	barrier = await new Barrier().setup(sensor.barrierGate);
	trafficLED = await new Led().setup(sensor.led);
	let requesting = false;
	let released = true;
	let isFinished = true;

	const run = async (data: runArgs) => {
		let { host, barrierTimeout } = data;
		const uid = await sensor.getRfidUid();
		if (uid) {
			released = false;
			if (!requesting && isFinished) {
				console.log('card detected');
				console.log('sending data to server');
				requesting = true;
				isFinished = false;
				const form = new FormData();
				form.append('card_serial', uid);
				form.append('vehicle_plate', fs.createReadStream('photos/test1.jpg'));
				// form.append('vehicle_plate', await camera.takePhoto(), { filename: 'capturedImage.jpg' });
				axios.request<APIResponse>({
					url: `${host}/api/parking`,
					method: 'POST',
					data: form,
					headers: form.getHeaders()
				}).then(({ data: result }) => {
					console.log('data sent');
					if (result.data) {
						barrier.open();
						trafficLED.setColor('green');
					} else {
						trafficLED.setColor('yellow');
						setTimeout(() => trafficLED.setColor('red'), 500);
						if (result.error?.errors?.length) {
							console.log(result.error?.errors[0].message);
						} else {
							console.log(result.error?.message);
						}
					}
					requesting = false;
				});
			}
		} else {
			if (!released) console.log('card released');
			released = true;
		}

		if (!released || requesting) {
			clearTimeout(barrierTimeout);
			barrierTimeout = setTimeout(() => {
				barrier.close();
				isFinished = true;
				trafficLED.setColor('red');
			}, 5000);
		}
		await run({ host, barrierTimeout });
	}

	try {
		let API_HOST = process.env.API_HOST;
		if (isNil(API_HOST)) {
			const foundIP = await findIp(3002);
			if (isNil(foundIP)) {
				throw new Error('Server not found');
			}
			API_HOST = `http://${foundIP}:3002`;
		}

		const auth = await checkAuth(API_HOST);
		if (auth) {
			console.log('auth passed');
			let barrierTimeout: NodeJS.Timeout = setTimeout(() => { }, 0);

			if (isNil(rfid)) throw new Error('No RFID Device')
			barrier.close();
			trafficLED.setColor('red');

			await run({ host: API_HOST, barrierTimeout });
		} else {
			console.log('failed to authenticate');
		}
	} catch (e) {
		console.log(e.message);
		setInterval(() => {
			trafficLED.setColor('red');
			setTimeout(() => {
				trafficLED.setColor('yellow');
			}, 1000);
		}, 2000);
	}
})();

const exitHandler = async () => {
	console.log('Application exit');

	await rfid.abort();
	await rfid.close();
	barrier.close();
	trafficLED.setColor('red');
}

process.on('exit', () => exitHandler())
process.on('SIGINT', () => exitHandler());
process.on('SIGUSR1', () => exitHandler());
process.on('SIGUSR2', () => exitHandler());
process.on('uncaughtException', () => exitHandler());