// Feel free to change the drivers order :)
const setkey = async(key,value)=>{
    await localforage.setDriver([
      localforage.INDEXEDDB,
      localforage.WEBSQL,
      localforage.LOCALSTORAGE
      ])
    setkeyvalue(key,value)
}

const getkey = async(key)=>{
  await localforage.setDriver([
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    localforage.LOCALSTORAGE
    ])
  getkeyvalue(key)
}

const setkeyvalue=async(key,value)=>{
    // var value = undefined;
    localforage.setItem(key, value, function() {
      console.log('Using:' + localforage.driver());
      console.log('Saved: ' + value);
      });
    }
      // Since this key hasn't been set yet, we'll get a null value

const getkeyvalue=async (key)=>{
    localforage.getItem(key).then(function(readValue) {
      console.log('Read: ', readValue);
  }).catch((err)=>{
    console.log(err)
  })
}

setkey('Hi','Harsh').then(()=>{
  getkey('Hi')
})