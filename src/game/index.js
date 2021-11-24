import Pair from './pair'

class Game {
  constructor () {
    console.log('constructor')
    this.blankMap = []
    this.redPairs = []
    this.blackPairs = []
  }

  initGame () {
    console.log('init')
    this.blankMap = this.initBlankMap()
    this.redPairs = this.initRedPairs()
    this.blackPairs = this.initBlackPairs()
  }

  getBlankMap () {
    return this.blankMap
  }

  getRedPairs () {
    return this.redPairs
  }

  getBlackPairs () {
    return this.blackPairs
  }

  getAllPairs () {
    return [...this.redPairs, ...this.blackPairs]
  }

  initBlankMap = function () {
    const map = []

    for (let x = 1; x <= 9; x++) {
      for (let y = 10; y > 0; y--) {
        // 生成空白棋盘
        map.push(new Pair('', [x, y], 0))
      }
    }
    return map
  }

  initRedPairs = function () {
    return [
      new Pair('j1', [1, 1], 1), // 车
      new Pair('j2', [9, 1], 1), // 车
      new Pair('p1', [2, 3], 1), // 炮
      new Pair('p2', [8, 3], 1), // 炮
      new Pair('m1', [2, 1], 1), // 马
      new Pair('m2', [8, 1], 1), // 马
      new Pair('x1', [3, 1], 1), // 相
      new Pair('x2', [7, 1], 1), // 相
      new Pair('s1', [4, 1], 1), // 士
      new Pair('s2', [6, 1], 1), // 士
      new Pair('z1', [1, 4], 1), // 兵
      new Pair('z2', [3, 4], 1), // 兵
      new Pair('z3', [5, 4], 1), // 兵
      new Pair('z4', [7, 4], 1), // 兵
      new Pair('z5', [9, 4], 1), // 兵
      new Pair('k', [5, 1], 1) // 帅
    ]
  }

  initBlackPairs = function () {
    return [
      new Pair('j1', [1, 10], -1),
      new Pair('j2', [9, 10], -1),
      new Pair('p1', [2, 8], -1),
      new Pair('p2', [8, 8], -1),
      new Pair('m1', [2, 10], -1),
      new Pair('m2', [8, 10], -1),
      new Pair('x1', [3, 10], -1),
      new Pair('x2', [7, 10], -1),
      new Pair('s1', [4, 10], -1),
      new Pair('s2', [6, 10], -1),
      new Pair('z1', [1, 7], -1),
      new Pair('z2', [3, 7], -1),
      new Pair('z3', [5, 7], -1),
      new Pair('z4', [7, 7], -1),
      new Pair('z5', [9, 7], -1),
      new Pair('k', [5, 10], -1)
    ]
  }
}

export default new Game()
