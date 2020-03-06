const {Datastore} = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore();
const kind = 'Config';

module.exports = {

  getConfig : async () =>{ 
    const query = datastore.createQuery(kind);
    const [config] = await datastore.runQuery(query);

    return config;
  },
  updateToken : async (token, refreshToken) =>{ 
    const query = datastore.createQuery( kind);
    const [config] = await datastore.runQuery(query);
    const taskKey = datastore.key([kind, 'lazada']);
    const task = {
      appKey: config[0].appKey,
      appSecret: config[0].appSecret,
      accessToken: token,
      refreshToken: refreshToken
    };
    const entity = {
      key: taskKey,
      data: task,
    };
    await datastore.save(entity);
  }
};