class Pair {
  constructor (name, position, camp) {
    this.name = name
    this.position = position
    this.camp = camp || 0
    this.died = 0
  }
}

Pair.prototype.moveTo = function (newPos) {
  this.position = newPos
}

export default Pair
