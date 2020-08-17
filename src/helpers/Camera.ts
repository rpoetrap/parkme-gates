/// <reference types="../types/node-raspistill" />
import { Raspistill, ICameraOptions, IWatcher, IRaspistillExecutor } from 'node-raspistill';
import { ClaMapper } from 'cla-mapper';

export class Camera extends Raspistill {
	constructor(options?: ICameraOptions, _watcher?: IWatcher, _executor?: IRaspistillExecutor) {
		super(options, _watcher, _executor);
		this._optionsMap = {
			verticalFlip: '-vf',
			horizontalFlip: '-hf',
			noPreview: '-n',
			encoding: '-e',
			width: '-w',
			height: '-h',
			time: '-t',
			iso: '-ISO',
			shutterspeed: '-ss',
			contrast: '-co',
			timelapse: '-tl',
			brightness: '-br',
			saturation: '-sa',
			awb: '-awb',
			awbg: '-awbg',
			quality: '-q',
			thumb: '-th',
			rotation: '-rot',
			output: '-o',
			exposure: '-ex',
			dynamicRange: '-drc'
		};
		this._optionsParser = new ClaMapper(this._optionsMap);
	}
}