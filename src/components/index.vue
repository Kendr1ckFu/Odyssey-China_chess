<template>
  <div id="all">
    <vue-canvas-nest
      :config="config"
      :el="'#all'"></vue-canvas-nest>
    <!-- 使用state变量控制加载界面的出现和消失 -->
    <div v-if="!state" class="loader">
      <div class="loading">
        <div class="circle"></div>
      </div>
      <div class="progress" v-html="this.value+'%'">0%</div>
    <!-- 使用loading变量控制"开始游戏"的出现 -->
      <p class="load" v-if="loading">loading……</p>
      <p class="load start" v-if="!loading" @click="run">开始游戏</p>
    </div>
    <div v-if="state" class="left">
      <div class="board">
        <div class="board-wrap">
          <div class="pair blank-item"
            :class="handleHighLight(item)"
            :style="handlePosition(item.position)"
            @click="clickPair(item)"
            v-for="(item, index) in blankMap"
            :key="'black' + index">
          </div>

          <div class="pair"
            :class="['black-' + item.name, handleHighLight(item)]"
            :style="handlePosition(item.position)"
            @click="clickPair(item)"
            v-for="item in blackPairs"
            :key="'black' + item.name">
          </div>
          <div v-if="state" class="status" :class="nextCamp > 0 ? 'red': ''">{{nextCamp > 0 ? '红棋' : '黑棋'}}</div>
          <div class="pair"
            :class="['red-' + item.name, handleHighLight(item)]"
            :style="handlePosition(item.position)"
            @click="clickPair(item)"
            v-for="item in redPairs"
            :key="'red' + item.name">
          </div>
        </div>
      </div>
    </div>
    <div v-if="state" class="right" >
      <div class="refresh" @click="begin">重新开始</div>
      <div class="refresh" @click="showAlert1">暂停</div>
      <div class="refresh" @click="Switch">音乐切换</div>
      <lz-alert :visiable.sync="iShow1" :msg="iMsg" :left="iLeft" />
    </div>
    <div v-if="over" class="success-panel">
      <div class="success-title">{{winCamp > 0 ? '红棋' : '黑棋'}}赢了！</div>
      <div class="restart" @click="begin();playAudio()">再来一局</div>
      <div class="restart back" @click="moreGame">更多游戏</div>
    </div>
  </div>
</template>
<script>
import Game from '../game'
import Rule from '../game/rule'
import LzAlert from './LzAlert.vue'
import vueCanvasNest from 'vue-canvas-nest'

export default {
  data () {
    return {
      nextCamp: 1,
      winCamp: 0,
      state: false,
      loading: true,
      over: false,
      blankMap: [],
      redPairs: [],
      blackPairs: [],
      needMovePair: null,
      highLightPoint: [], // 可移动的点，需要高亮
      iMsg: '游戏已经暂停！',
      iLeft: 'OK!',
      iShow1: false,
      isplay: false,
      index: null,
      musics: [],
      value: 0,
      config: {
        color: '255, 0, 0',
        opacity: 1,
        zIndex: 5,
        count: 128
      }
    }
  },
  mounted: function () {
    this.setTimer()
  },
  created: function () {
    this.begin()
    this.setMusic()
  },
  destroyed: function () {
    this.stopAudio()
  },
  components: {
    LzAlert,
    vueCanvasNest
  },
  methods: {
    continuePlay () {
      this.isplay = true
      this.audio.play()
    },
    // 执行函数递归，通过生成随机数并记录上一次的随机数，
    // 以便在点击"开始游戏"后，做到随机播放音乐并在切换时与上一首不重合
    playAudio () {
      this.isplay = true
      this.audio = new Audio()
      var index = Math.round(Math.random() * (this.musics.length - 1))
      if (this.index !== index) {
        this.audio.src = this.musics[index]
        console.log('Playing music:', this.musics[index])
        this.audio.play()
        this.index = index
      } else {
        this.playAudio()
      }
    },
    // 使用this.audio.pause()，以便在恢复暂停后，能够保持暂停前的音乐播放状态
    stopAudio () {
      this.isplay = false
      this.audio.pause()
    },
    // 清除之前的定时器，并生成一个新的定时器，
    // 以控制在切换歌曲时，stopAudio ()与playAudio ()的执行有间隔，
    // 避免播放时有多段音乐
    Switch () {
      clearTimeout(this.timer)
      this.timer = null
      if (this.isplay) {
        this.stopAudio()
        if (this.timer == null) {
          this.timer = setTimeout(() => {
            console.log('Changing the music.')
            this.playAudio()
          }, 1000)
        }
      }
    },
    // 读取"/static/music/"文件夹内存储的所有MP3格式的音频文件存入musics数组
    setMusic () {
      this.musics = require.context('../../static/music/', false, /.mp3$/).keys()
      for (var i in this.musics) {
        this.musics[i] = '../../static/music/' + this.musics[i]
      }
      console.log(this.musics)
    },
    // 使用定时器和随机数控制加载进度以完成伪加载，并提供"开始游戏"的入口
    setTimer () {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          this.value += Math.round(Math.random() * (10 - 1) + 1)
          if (this.value >= 100) {
            this.value = 100
          }
          if (this.value === 100) {
            clearInterval(this.timer)
            this.timer = null
            console.log('loading=' + this.loading)
            this.loading = false
          }
        }, 200)
      }
    },
    run () {
      this.state = true
      clearTimeout(this.timer)
      this.timer = null
      this.playAudio()
    },
    showAlert1 () {
      this.iShow1 = true
      this.stopAudio()
    },
    //回溯初始状态
    begin () {
      this.nextCamp = this.winCamp ? -this.winCamp : 1
      this.winCamp = 0
      this.over = false
      Game.initGame()
      this.blankMap = Game.getBlankMap()
      this.blackPairs = Game.getBlackPairs()
      this.redPairs = Game.getRedPairs()
      this.highLightPoint = []
    },
    moreGame () {
      window.location.href = '#'
    },
    gameOver (camp) {
      this.winCamp = camp
      this.over = true
      this.stopAudio()
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
#all{
  padding-top: 1%;
  position:absolute;
  width: 100%;
  min-height: 713px;
}
.loader{
  width:100%;
}

.loading {
  width:180px;
  height:180px;
  background-image: linear-gradient(#c0c0c0, rgb(0, 0, 0)) ;
  border-radius:50%;
  text-align:center;
  padding:20px;
  font-size:28px;
  border-radius: 50%;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
  margin:10% auto 10%;
  box-sizing:border-box;
}
.loading .circle{
  width:100%;
  height:100%;
  background:rgb(204, 201, 201);
  border-radius:50%;
}
.load{
  width: 15%;
  margin-top: 1%;
  margin-left: 42.4%;
}
.start{
  cursor:pointer;
}
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.load,.status {
  font-size: 0.4rem;
  font-weight: 600;
  text-align: center;
}
.status{
  width: 20%;
  position:relative;
  top: 45%;
  left: 39.5%;
  z-index:0;
}
.status.red {
  color: #b82a2a;
}
.board {
  z-index:-2;
  width: 7rem;
  min-width: 7rem;
  max-width: 7rem;
  height: 7rem;
  background-image: url('../assets/images/board.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  box-shadow: 0.15rem 0.10rem 0.20rem #888888;
  float: right;
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
  z-index:1;
  margin-left: 0.01rem;
  margin-bottom: 0.04rem;
}
.blank-item {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  margin-left: -0.01rem;
  margin-bottom: 0.07rem;
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
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, .5);
  z-index: 1000;
  margin-top:-1%;
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
  padding-left: 20px;
  margin-left: 46px;
}
.restart {
  margin-left: 45px;
  margin-top: 15px;
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
.refresh {
  width: 29%;
  height: 30%;
  color: #fff;
  font-size: 18px;
  border-radius: 20px;
  background-color: #891e91;
  float: left;
  text-align: center;
  cursor: pointer;
  margin-top: 1%;
  margin-left: 4%;
}
.left{
  width: 74%;
  float: left;
  min-height: 7rem;
  position: relative;
}
.right{
  min-height: 7rem;
  width: 25%;
  float: right;
}
.progress {
  font-weight: 700;
  font-size: 0.4rem;
  text-align: center;
  width: 8%;
  margin-left: 46%;
  margin-top: -8%;
}
</style>
