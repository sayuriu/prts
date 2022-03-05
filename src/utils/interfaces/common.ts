export type EnvironmentVariables = {
	AppVersion: string;
    AppName: string;
	[key: string]: any;
};
export type BrowserWindow = typeof window & { __env: EnvironmentVariables }
