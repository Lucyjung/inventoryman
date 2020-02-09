const {Datastore} = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore();
const kind = 'Product';

module.exports = {
  addProduct : async (id, prodInfo) => {
  
    // The Cloud Datastore key for the new entity
    const idKey = datastore.key([kind, id]);
  
    // Prepares the new entity
    const prod = {
      key: idKey,
      data: prodInfo,
    };
  
    // Saves the entity
    await datastore.save(prod);
    console.log(`Saved ${prod.key.name}`);
  },
  listProduct : async () =>{ 
    const query = datastore.createQuery(kind);
    const [prods] = await datastore.runQuery(query);

    return prods;
  }
};