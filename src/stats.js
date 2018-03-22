import makeDebug from 'debug';
import { checkPlugin } from 'mostly-node';

const debug = makeDebug('mostly:plugins:common:stats');

const options = {};

const attributes = {
  name: 'stats',
  description: 'Provide informations about the current MostlyJS microservice instance',
  version: require('../package.json').version
};

function pubProcessInfo (trans, topic, interval) {
  const info = {
    app: trans.config.name,
    eventLoopDelay: trans.load.eventLoopDelay,
    heapUsed: trans.load.heapUsed,
    rss: trans.load.rss,
    nodeEnv: process.env.NODE_ENV,
    uptime: process.uptime(),
    ts: Date.now()
  };

  //debug('processInfo', info);
  trans.act({
    pubsub$: true,
    topic,
    cmd: 'processInfo',
    info
  });

  setTimeout(pubProcessInfo.bind(null, trans, topic, interval), interval);
}

function pubActionsInfo (trans, topic, interval) {
  const info = {
    app: trans.config.name
  };
  const list = trans.list();
  info.ts = Date.now();
  info.actions = list.map(action => {
    const schema = {};
    return {
      pattern: action.pattern,
      plugin: action.plugin.attributes.name
    };
  });

  //debug('actionsInfo', info);
  trans.act({
    pubsub$: true,
    topic,
    cmd: 'actionsInfo',
    info
  });

  setTimeout(pubActionsInfo.bind(null, trans, topic, interval), interval);
}

function plugin (options, next) {
  const trans = this;
  const topic = attributes.name;
  const sampleInterval = options.sampleInterval || 60000;

  pubProcessInfo(trans, topic, sampleInterval);
  pubActionsInfo(trans, topic, sampleInterval);

  next();
}

export default {
  options,
  attributes,
  plugin: checkPlugin(plugin)
};
