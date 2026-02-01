const fs = require('fs');

function getGlobalVar(key) {
  const data = fs.readFileSync('data.json');
  const parsed = JSON.parse(data)
  const result = parsed[key]
  if (typeof result === 'undefined') {return null}
  return result;
}

function setGlobalVar(key, value) {
  const data = fs.readFileSync('data.json');
  let globalVariableObject = JSON.parse(data);
  globalVariableObject[key] = value;
  fs.writeFileSync('data.json', JSON.stringify(globalVariableObject));
}


module.exports = {
  getGlobalVar, setGlobalVar
}