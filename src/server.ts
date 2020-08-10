import { isNil } from 'lodash';
import readline from 'readline-sync';
import FormData from 'form-data';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import * as sensor from './configs/sensor';
import { findIp } from './helpers/Scanner';
import axios from './helpers/axios';
import { APIResponse } from './types';
import Barrier from './helpers/Barrier';
import Led from './helpers/Led';
import camera from './configs/camera';

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
			const rfid = await sensor.setupRfid();
			const barrier = await new Barrier().setup(sensor.barrierGate);
			const trafficLED = await new Led().setup(sensor.led);
			let barrierTimeout: NodeJS.Timeout = setTimeout(() => { }, 0);

			let requesting = false;
			let released = true;
			if (isNil(rfid)) throw new Error('No RFID Device')
			barrier.close();
			trafficLED.setColor('red');
			while (true) {
				const uid = await sensor.getRfidUid();
				if (uid) {
					console.log('card detected');
					released = false;
					if (!requesting) {
						console.log('sending data to server');
						requesting = true;
						const form = new FormData();
						form.append('card_serial', uid);
						form.append('vehicle_plate', await camera.takePhoto(), { filename: 'capturedImage.jpg' });
						axios.request<APIResponse>({
							url: `${API_HOST}/api/parking`,
							method: 'POST',
							data: form,
							headers: form.getHeaders()
						}).then(({ data: result }) => {
							console.log('data sent');
							if (result.data) {
								barrier.open();
								trafficLED.setColor('yellow');
							} else {
								trafficLED.setColor('yellow');
								setTimeout(() => trafficLED.setColor('red'), 500);
							}
						});
					}
				} else {
					released = true;
					console.log('card released');
				}
				if (!released) {
					clearTimeout(barrierTimeout);
					barrierTimeout = setTimeout(() => {
						barrier.close();
						requesting = false;
						trafficLED.setColor('red');
					}, 5000);
				}
			}
		} else {
			console.log('failed to authenticate');
		}
	} catch (e) {
		console.log(e.message);
	}
})();