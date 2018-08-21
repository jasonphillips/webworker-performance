importScripts('../idb.js'); 
importScripts('../indexeddb.js'); 

self.onmessage = function(msg) {
  var key = msg.data

  idbKeyval.get(key).then(val => 
    idbKeyval.delete(msg.data).then(() => 
      idbKeyval.set(
        `${key}-output`, 
        Object.assign({}, {data: val}, {success: true}),
      ).then(() => 
        self.postMessage(key)
      )
    )
  )
};
