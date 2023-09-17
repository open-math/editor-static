export class Config
{
    watch: boolean;
}

//
//
//

export let CONFIG: Config;

export function setConfig(config: Config)
{
    CONFIG = config;
}