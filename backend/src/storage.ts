import YAML from 'yaml';
import fs from 'fs';
import util from 'util';
import chokidar from 'chokidar';

import { Config } from './generated/graphql'
import { PubSub } from 'apollo-server';
import { SubscriptionType } from './messages';

const read = util.promisify(fs.readFile);

let config: Config;

async function reload(filename: string): Promise<Config> {
    const file = await read(filename, { encoding: "utf-8" })
    let m: Config = await YAML.parse(file)
    for (let i = 0; i < m.service.length; i++) {
        if (!m.service[i].stealthPort) {
            m.service[i].stealthPort = m.service[i].normalPort + 10000;
        }
    }
    m.updatedAt = Date.now()
    return m
}

export function getConfig() { return config }


export async function startWatch(filename: string, pubsub: PubSub) {
    config = await reload(filename)
    // One-liner for current directory
    chokidar.watch(filename).on('all', async (event, path) => {
        console.log(`Received ${event} for ${path}`)
        config = await reload(filename);
        // if config changed, push a full-reload notification
        pubsub.publish(SubscriptionType.Config, {config: config})
    });
}

