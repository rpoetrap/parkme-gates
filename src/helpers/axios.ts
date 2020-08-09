import { machineIdSync } from 'node-machine-id';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.validateStatus = () => true;

axios.interceptors.request.use(req => {
	// console.log(req.headers);
	req.headers['session-id'] = machineIdSync(true);
	return req;
});

export default axios;