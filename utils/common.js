const isObjEmpty = (obj = {}) => Object.keys(obj).length === 0
const isArrayEmpty = (array = []) => Array.isArray(array) && array.length === 0
const getFirstQueryValue = (value) => { return Object.values(value[0])[0] }
const queryResultToObject = (value) => { return Object.assign({}, value[0])}

module.exports = { isObjEmpty, isArrayEmpty, getFirstQueryValue, queryResultToObject }