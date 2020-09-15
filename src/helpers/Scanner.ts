import net from 'net';
import os from 'os';

const Socket = net.Socket;
const interfaces = os.networkInterfaces();
interface ScanStatus {
	status: boolean;
	host: string;
}

const checkPort = (port: number, host: string) => {
	return new Promise<ScanStatus>(resolve => {
		const socket = new Socket()
		let status = false;
		socket.on('connect', () => {
			status = true;
			socket.end();
		});
		socket.setTimeout(1500); // If no response, assume port is not listening
		socket.on('timeout', () => {
			socket.destroy();
		});
		socket.on('error', (exception) => {
			resolve({ status, host });
		});
		socket.on('close', (exception) => {
			resolve({ status, host });
		});
		socket.connect(port, host);
	});
}

export const findIp = async (portno: number) => {
	return new Promise<string>(resolve => {
		var addresses = [];
		/*Getting IP addresses*/
		for (const k in interfaces) {
			for (const k2 in interfaces[k]) {
				const index = parseInt(k2);
				const address = interfaces[k]![index];
				if (address.family === 'IPv4' && !address.internal) {
					addresses.push(address.address);
				}
			}
		}
	
		let LAN = addresses[0];
		const PORT = portno;
		LAN = LAN.substring(0, 9);
	
		const promises: Promise<ScanStatus>[] = [];
		for (var i = 1; i < 255; i++) {
			const host = LAN + '.' + i;
			promises.push(checkPort(PORT, host));
		}
		Promise.all(promises).then(data => {
			data.map(item => {
				if(item.status) resolve(item.host);
			})
		});
	});
}