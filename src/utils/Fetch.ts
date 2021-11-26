import { emptyFunc } from "@utils/utils";

type XHRVoidCallback = (xhr: XMLHttpRequest, ev?: ProgressEvent) => void;
type ResponseDataT = 'blob' | 'arraybuffer' | 'json' | 'text';

export interface CallbackOptions
{
	/** This executes when the load is complete. */
	onload?: XHRVoidCallback;
	onloadend?: XHRVoidCallback;
	onloadstart?: XHRVoidCallback;
	onprogress?: XHRVoidCallback;
	onabort?: XHRVoidCallback;
	onerror?: XHRVoidCallback;
}

export interface XHROptions extends CallbackOptions
{
	responseType?: ResponseDataT;
}

const defaultOptions: XHROptions = {
	responseType: 'blob',
};

export function Fetch(url: string, options: XHROptions = defaultOptions)
{
	if (!options.responseType)
		options.responseType = 'blob';

	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = options.responseType!;
		xhr.onload = function(ev) {
			(options.onload ?? emptyFunc)(this, ev);
			resolve(this.response);
		}
		xhr.onloadstart = function(ev) {
			(options.onloadstart ?? emptyFunc)(this, ev);
		}
		xhr.onloadend = function(ev) {
			(options.onloadend ?? emptyFunc)(this, ev);
		}
		xhr.onprogress = function(ev) {
			(options.onprogress ?? emptyFunc)(this, ev);
		}
		xhr.onabort = function(ev) {
			(options.onabort ?? emptyFunc)(this, ev);
			resolve(null);
		}
		xhr.onerror = function(ev) {
			(options.onerror ?? emptyFunc)(this, ev);
			reject(ev);
		}
		xhr.send();
	});
}