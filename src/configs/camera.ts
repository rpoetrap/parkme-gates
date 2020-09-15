import { Camera } from '../helpers/Camera';

const camera = new Camera({
	awb: 'auto',
	exposure: 'auto',
	encoding: 'jpg',
	dynamicRange: 'low',
	quality: 100,
	noFileSave: true,
	noPreview: true,
});

export default camera;