const {Datastore} = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore();
const kind = 'Config';

module.exports = {

  getConfig : async () =>{ 
    const query = datastore.createQuery(kind);
    const [config] = await datastore.runQuery(query);

    return config;
  }
};