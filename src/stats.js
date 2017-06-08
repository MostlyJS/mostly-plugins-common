import makeDebug from 'debug';

const debug = makeDebug('mostly:plugins:common:stats');

export let options = {};

export let attributes = {
  name: 'stats',
  description: 'Provide informations about the current MostlyJS microservice instance',
  version: require('../package.json').version
};

export function plugin (options, next) {
  const trans = this;
  const topic = exports.attributes.name;

  trans.add({
    topic,
    cmd: 'processInfo',
    pubsub$: true
  }, function (resp, cb) {
    const info = {
      app: trans.config.name,
      eventLoopDelay: trans.load.eventLoopDelay,
      heapUsed: trans.load.heapUsed,
      rss: trans.load.rss,
      nodeEnv: process.env.NODE_ENV,
      uptime: process.uptime(),
      ts: Date.now()
    };
    debug('processInfo', info);
    cb(null, info);
  });

  trans.add({
    topic,
    cmd: 'registryInfo',
    pubsub$: true
  }, function (resp, cb) {
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

    debug('registryInfo', info);
    cb(null, info);
  });

  next();
}

