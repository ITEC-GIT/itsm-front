import config from '../app_config.json';

type ConfigKeys = keyof typeof config;

export const getConfig = (key: ConfigKeys) => {
  return config[key];
};