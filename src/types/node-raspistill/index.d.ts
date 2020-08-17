
declare module 'node-raspistill' {
	import { ICamera, ICameraOptions as OriginalCameraOptions, IInnerExecCameraOptions } from 'node-raspistill/build/lib/camera/interfaces';
	import { IWatcher, IRaspistillExecutor } from 'node-raspistill';
	import { ClaMapper } from 'cla-mapper';
	export { RaspistillInterruptError } from 'node-raspistill/build/lib/error/interrupt';
	export { RaspistillDefaultError } from 'node-raspistill/build/lib/error/raspistill';
	export { IWatcher, IWatcherOptions } from 'node-raspistill/build/lib/watcher/interfaces';
	export { IRaspistillExecutor } from 'node-raspistill/build/lib/executor/interfaces';

	export interface ICameraOptions extends OriginalCameraOptions {
		exposure?: 'auto' | 'night' | 'nightpreview' | 'backlight' | 'spotlight' | 'sports' | 'snow' | 'beach' | 'verylong' | 'fixedfps' | 'antishake' | 'fireworks';
		dynamicRange?: 'off' | 'low' | 'med' | 'high';
	}

	export class Raspistill implements ICamera {
		protected _watcher: IWatcher;
		protected _executor: IRaspistillExecutor;
		protected _options: ICameraOptions;
		protected _optionsMap: Record<string, string>;
		private readonly _defaultOptions;
		protected _optionsParser: ClaMapper;
		constructor(options?: ICameraOptions, _watcher?: IWatcher, _executor?: IRaspistillExecutor);
		setOptions(options: ICameraOptions): void;
		getOptions(): ICameraOptions;
		getOption(key: string): any;
		timelapse(fileName: string, intervalMs: number, execTimeMs: number, cb: (image: Buffer) => any): Promise<void>;
		timelapse(intervalMs: number, execTimeMs: number, cb: (image: Buffer) => any): Promise<void>;
		takePhoto(fileName?: string): Promise<Buffer>;
		stop(): void;
		protected _processOptions(newOptions?: IInnerExecCameraOptions): string[];
	}
}