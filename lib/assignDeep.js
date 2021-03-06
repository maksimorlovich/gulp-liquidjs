const assignDeep = (...objects) => {
  let firstObject = objects[0];

  if (objects[1]) {
    for (let i = 1; i < objects.length; i++) {
      for(let name in objects[i]){
        if(objects[i].hasOwnProperty(name)){
          if (!firstObject.hasOwnProperty(name) || Object.prototype.toString.call(objects[i][name]) !== '[object Object]'){
            firstObject[name] = objects[i][name];
          }
          else {
            firstObject[name] = assignDeep(firstObject[name], objects[i][name]);
          }
        }
      }
    }
  }

  return firstObject;
};

module.exports = assignDeep;