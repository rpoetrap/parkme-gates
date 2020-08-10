import { Raspistill } from 'node-raspistill';

const camera = new Raspistill({
	iso: 800,
	encoding: 'jpg',
	quality: 100,
	noFileSave: true,
	noPreview: true,
});

export default camera;