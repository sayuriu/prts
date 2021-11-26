import { emptyFunc } from "@utils/utils";
import { Fetch, CallbackOptions } from "./Fetch";

type ResponseDataT = 'blob' | 'arraybuffer' | 'text';

export class ImageLoader {
	load(
		url: string,
		responseType: ResponseDataT = 'arraybuffer',
		callbacks: CallbackOptions = {},
	)
	{
		return new Promise((resolve, reject) => {
			Fetch(
				url,
				Object.assign({ responseType }, callbacks),
			)
			.then((value: XMLHttpRequest['response']) => resolve(window.URL.createObjectURL(new Blob([value]))))
			.catch(reject);
		});
	}
}