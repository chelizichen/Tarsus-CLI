const TaroError = {
  "int": function (value) {
    throw new Error(`TaroError: int 类型错误 value is ->${value}`)
  },
  "string": function (value) {
    throw new Error(`TaroError: string 类型错误 value is ->${value}`)
  },
  "bool": function (value) {
    throw new Error(`TaroError: bool 类型错误 value is ->${value}`)
  }
}

module.exports = {
  TaroError
}