import { Injectable } from '@angular/core';
import { Fetch, XHROptions } from '@utils/Fetch';
import { join } from '@utils/PathUtils';

@Injectable({
	providedIn: 'root'
})
export class JSONLoadService {
	private BASE_PATH = 'assets/gamedata/json';
	// path based on /src/assets/json
	load(path: string, options: XHROptions = {})
	{
		options.responseType = 'json';
		return new Promise((resolve, reject) => {
			Fetch(join(this.BASE_PATH, path), options)
				.then(resolve)
				.catch(reject);
		})
	}
}
