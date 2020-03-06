const config = require('../config/lazada')
const axios = require('axios');
const crypto = require('crypto');
const _ = require("lodash")
const secret = require('../models/Config')
async function init(isAuth) {

  const userSecret = await secret.getConfig()
  const instance = {}
  if (isAuth){
    instance["URL"] = config.authUrl
  } else {
    instance["URL"] = config.url
  }
  
  instance["APP_ID"] = userSecret[0].appKey
  instance["SECRET_KEY"] = userSecret[0].appSecret
  instance["TOKEN"] = userSecret[0].accessToken
  return instance
}

function initRequest(path, method = "POST") {
  if (path.length < 1) {
    throw new Error('path is empty!');
  }
  const requestInstance = {}
  requestInstance["PATH"] = path
  requestInstance["METHOD"] = method
  return requestInstance
}


function addApiParam(instance, key, value) {
  if (!instance || (Object.keys(instance).length === 0 && instance.constructor === Object)) {
    throw new Error('instance is null');
  }

  if (!key || key.length < 1) {
    throw new Error('key is null');
  }
  if (!value || value.length < 1) {
    throw new Error('value is null');
  }

  let newInstance = JSON.parse(JSON.stringify(instance));
  if (!newInstance["params"] || newInstance["params"].length < 1) {
    newInstance["params"] = []
  }
  newInstance["params"].push({
    key,
    value
  })
  return newInstance
}

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

function generateSign(key, path, params) {
  params = sortByKey(params, "key")
  let strToBeSigned = path
  for (let i = 0; i < params.length; i++) {
    strToBeSigned += params[i].key + params[i].value
  }
  let hash = crypto.createHmac(config.signMethod, key)
    .update(strToBeSigned)
    .digest('hex');

  return hash.toUpperCase()
}

function post(requestURL, params) {
  return new Promise((resolve, reject) => {
    let paramForRequest = {}
    for (let i = 0; i < params.length; i++) {
      paramForRequest[params[i].key] = params[i].value
    }
    axios.post(requestURL, paramForRequest)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });

}

function get(requestURL, params) {
  return new Promise((resolve, reject) => {
    let paramForRequest = {}
    for (let i = 0; i < params.length; i++) {
      paramForRequest[params[i].key] = params[i].value
    }
    axios.get(requestURL, { params:  paramForRequest  })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });

}

function execute(instance, request) {
  return new Promise(function (resolve, reject) {
    let params = request.params
    if (!params) {
      params = []
    }
    params.push({
      "key": "app_key",
      "value": instance["APP_ID"]
    })
    params.push({
      "key": "sign_method",
      "value": config.signMethod
    })
    const timestamp = new Date().getTime()
    params.push({
      "key": "timestamp",
      "value": timestamp
    })

    if (instance["TOKEN"]) {
      params.push({
        "key": "access_token",
        "value": instance["TOKEN"]
      })
    }
    let requestURL = instance["URL"]
    if (_.endsWith(requestURL, "/")) {
      requestURL = requestURL.substring(0, requestURL.length - 1)
    }
    requestURL += request["PATH"]
    let sign = generateSign(instance["SECRET_KEY"], request["PATH"], params)
    params.push({
      "key": "sign",
      "value": sign
    })
    if (request.METHOD.toUpperCase() == "POST") {
      try {
        resolve(post(requestURL, params))
      }catch(error){
        reject(error)
      }
    } else if (request.METHOD.toUpperCase() == "GET") {
      try {
        resolve(get(requestURL, params))
      }catch(error){
        reject(error)
      }
    }
  });
}
async function createToken(code){
  const instance = await init(true)
  delete instance.TOKEN
  
  let request = initRequest("/auth/token/create","POST")
  request = addApiParam(request, "code", req.body.code)
  execute(instance, request, "").then(async (response) => {
      const data = response.data
      if (data.access_token && data.refresh_token) {
          await secret.updateToken(data.access_token, data.refresh_token)
      } 
      return data;
  })
}
async function refreshToken(){
  const userSecret = await secret.getConfig()
  const instance = await init(true)
  delete instance.TOKEN
  
  let request = initRequest("/auth/token/refresh","POST")
  request = addApiParam(request, "refresh_token", userSecret[0].refreshToken)
  const response = await execute(instance, request, "")
  const data = response.data
  if (data.access_token && data.refresh_token) {
      await secret.updateToken(data.access_token, data.refresh_token)
  }
  return data;
}
module.exports = {
  init,
  initRequest,
  addApiParam,
  execute,
  createToken,
  refreshToken
}