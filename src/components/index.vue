<template>
  <div>
    <div class="status" :class="nextCamp > 0 ? 'red': ''">{{nextCamp > 0 ? '红棋' : '黑棋'}}</div>

    <div class="board">
      <div class="board-wrap">
        <div class="pair blank-item"
          :class="handleHighLight(item)"
          :style="handlePosition(item.position)"
          @click="clickPair(item)"
          v-for="(item, index) in blankMap"
          :key="'black' + index">
          <!-- {{item.position}} -->
        </div>

        <div class="pair"
          :class="['black-' + item.name, handleHighLight(item)]"
          :style="handlePosition(item.position)"
          @click="clickPair(item)"
          v-for="item in blackPairs"
          :key="'black' + item.name">
        </div>

        <div class="pair"
          :class="['red-' + item.name, handleHighLight(item)]"
          :style="handlePosition(item.position)"
          @click="clickPair(item)"
          v-for="item in redPairs"
          :key="'red' + item.name">
        </div>
      </div>
    </div>

    <div v-if="over" class="success-panel">
      <div class="success-title">{{winCamp > 0 ? '红棋' : '黑棋'}}赢了！</div>
      <div class="restart" @click="begin">再来一局</div>
      <div class="restart back" @click="moreGame">更多游戏</div>
    </div>
  </div>
</template>

<script>
import Game from '../game'
import Rule from '../game/rule'

export default {
  data () {
    return {
      nextCamp: 1,
      winCamp: 0,
      over: false,
      blankMap: [],
      redPairs: [],
      blackPairs: [],
      needMovePair: null,
      highLightPoint: [] // 可移动的点，需要高亮
    }
  },
  created () {
    this.begin()
  },
  methods: {
    begin () {
      this.nextCamp = this.winCamp ? -this.winCamp : 1
      this.winCamp = 0
      this.over = false
      Game.initGame()
      this.blankMap = Game.getBlankMap()
      this.blackPairs = Game.getBlackPairs()
      this.redPairs = Game.getRedPairs()
    },
    moreGame () {
      window.location.href = '#'
    },
    gameOver (camp) {
      this.winCamp = camp
      this.over = true
    },
    clickPair (pair) {
      if (this.needMovePair && this.needMovePair.camp !== pair.camp) {
        this.moveToAnim(this.needMovePair, pair)
        this.needMovePair = null
        this.highLightPoint = []
      } else if (pair.camp && pair.camp === this.nextCamp) {
        this.needMovePair = pair
        this.highLightPoint = Rule.getMoveLine(this.needMovePair)
        console.log(this.highLightPoint)
      }
    },
    moveToAnim (needMovePair, targetPair) {
      if (Rule.canMove(needMovePair, targetPair, this.highLightPoint)) {
        if (targetPair.camp && targetPair.camp !== needMovePair.camp) {
          this.removePair(targetPair)
        }
        needMovePair.moveTo(targetPair.position)
        this.nextCamp = -this.nextCamp
        // 清除状态
        this.needMovePair = null
        this.highLightPoint = []
      }
    },
    removePair (pair) {
      if (pair.name === 'k') {
        this.gameOver(-pair.camp)
      }
      if (pair.camp === 1) {
        const index = this.getPairIndexByName(this.redPairs, pair)
        this.redPairs.splice(index, 1)
      } else {
        const index = this.getPairIndexByName(this.blackPairs, pair)
        this.blackPairs.splice(index, 1)
      }
    },
    getPairIndexByName (pairs, pair) {
      for (let index in pairs) {
        if (pairs[index].name === pair.name) {
          return index
        }
      }
    },
    handlePosition (position) {
      let pairSize = 0.68
      let x = position[0]
      let y = position[1]
      x = (x - 1) * pairSize - (pairSize / 2)
      y = (y - 1) * pairSize - (pairSize / 2)
      return 'left:' + x + 'rem;bottom:' + y + 'rem;'
    },
    handleHighLight (pair) {
      const positionStr = pair.position.toString()
      for (const point of this.highLightPoint) {
        if (point.toString() === positionStr) {
          if (this.needMovePair && pair.camp === this.needMovePair.camp) {
            console.log()
            this.removeHighLightItem(pair)
            return ''
          } else {
            return 'active'
          }
        }
      }
    },
    removeHighLightItem (pair) {
      const strArr = []
      for (const point of this.highLightPoint) {
        strArr.push(point.toString())
      }
      const index = strArr.indexOf(pair.position.toString())
      if (index > -1) {
        this.highLightPoint.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.status {
  font-size: 0.4rem;
  font-weight: 600;
  text-align: center;
  padding-top: 0.2rem;
}
.status.red {
  color: #b82a2a;
}
.board {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 7rem;
  height: 7.12rem;
  background-image: url('../assets/images/board.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  box-shadow: 0.15rem 0.10rem 0.20rem #888888;
}

.board-wrap {
  position: relative;
  left: 0.84rem;
  top: 0.42rem;
  height: 6.2rem;
  width: 5.4rem;
}

.pair {
  position: absolute;
  width: 0.68rem;
  height: 0.68rem;
  background-position: center;
  background-size: 100% 100%;
  transition: all 0.3s;
}

.blank-item {
  font-size: 0.12rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  /* background-color: rgba(100, 100, 100, 0.5); */
}

/* 黑棋 */
.black-j1,
.black-j2 {
  background-image: url('../assets/pairs/-1/j.png');
}

.black-k {
  background-image: url('../assets/pairs/-1/k.png');
}

.black-m1,
.black-m2 {
  background-image: url('../assets/pairs/-1/m.png');
}

.black-p1,
.black-p2 {
  background-image: url('../assets/pairs/-1/p.png');
}

.black-s1,
.black-s2 {
  background-image: url('../assets/pairs/-1/s.png');
}

.black-x1,
.black-x2 {
  background-image: url('../assets/pairs/-1/x.png');
}

.black-z1,
.black-z2,
.black-z3,
.black-z4,
.black-z5 {
  background-image: url('../assets/pairs/-1/z.png');
}
/* 黑棋 */

/* 红棋 */
.red-j1,
.red-j2 {
  background-image: url('../assets/pairs/1/j.png');
}

.red-k {
  background-image: url('../assets/pairs/1/k.png');
}

.red-m1,
.red-m2 {
  background-image: url('../assets/pairs/1/m.png');
}

.red-p1,
.red-p2 {
  background-image: url('../assets/pairs/1/p.png');
}

.red-s1,
.red-s2 {
  background-image: url('../assets/pairs/1/s.png');
}

.red-x1,
.red-x2 {
  background-image: url('../assets/pairs/1/x.png');
}

.red-z1,
.red-z2,
.red-z3,
.red-z4,
.red-z5 {
  background-image: url('../assets/pairs/1/z.png');
}
/* 红棋 */

.active {
  background-color: rgba(59, 187, 209, 0.5);
  border-radius: 100%;
}
.success-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.success-title {
  font-size: 30px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
}
.restart {
  margin: 20px auto 0;
  width: 120px;
  height: 40px;
  color: #fff;
  font-size: 20px;
  border-radius: 20px;
  background-color: #891e91;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
