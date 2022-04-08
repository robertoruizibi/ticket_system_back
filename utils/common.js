const isObjEmpty = (obj = {}) => Object.keys(obj).length === 0
const isArrayEmpty = (array = []) => Array.isArray(array) && array.length === 0


module.exports = { isObjEmpty, isArrayEmpty}