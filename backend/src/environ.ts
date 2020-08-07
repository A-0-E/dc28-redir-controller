export const needSudo: boolean = ((process.env.NEED_SUDO?.length || 0) > 0) || false
export const logLevel: string = process.env.LOG_LEVEL || 'debug'
export const configPath: string = process.env.CONFIG_PATH || './config.yaml'
export const watchTime: number = parseInt(process.env.WATCH_TIME || "10") || 10
