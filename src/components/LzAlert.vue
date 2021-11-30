<template>
  <div class="wrapper" @click="cancelable && dismiss()" v-if="visiable">
    <div class="lz-dialog" ref="box" @click.stop="">
      <div v-if="msgData.title != null" class="lz-title">
        {{ msgData.title }}
      </div>
      <div v-if="msgData.msg != null" class="lz-msg">{{ msgData.msg }}</div>
      <div class="lz-btns">
        <div v-if="msgData.left != null" class="btn" v-bind:style="styleLeft" @click="leftAction">{{ msgData.left }}</div>
        <div v-if="msgData.right != null" class="btn" v-bind:style="styleRight" @click="rightAction">{{ msgData.right }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import index from './index.vue'
export default {
  name: 'lz-alert',
  props: {
    title: null,
    msg: null,
    left: null,
    right: null,
    cancelable: {
      type: Boolean,
      default: true
    },
    visiable: false,
    leftColor: {
      type: String,
      default: '#999999'
    },
    rightColor: {
      type: String,
      default: '#ff00ff'
    }
  },
  data () {
    return {
      msgData: {
        title: this.title,
        msg: this.msg,
        left: this.left,
        right: this.right
      },
      styleLeft: {
        color: this.leftColor
      },
      styleRight: {
        color: this.rightColor
      }
    }
  },
  methods: {
    dismiss () {
      console.log('消失')
      this.$emit('update:visiable', false)
      this.$parent.continuePlay()
    },
    leftAction () {
      this.dismiss()
      this.$emit('leftAction')
    },
    rightAction () {
      this.dismiss()
      this.$emit('rightAction')
    }
  }
}
</script>

<style >
.wrapper {
  background: #000000ff;
  opacity: 0.8;
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
}
.lz-dialog {
  display: block;
  background-color: #ffffff;
  border-radius: 5px;
  margin: auto 5.7% auto 8.9%;
  overflow: hidden;
  padding: 10px;
  max-width: 240px;
  min-width: 240px;
}

.lz-title {
  color: #333;
  font-weight: bolder;
}
.lz-msg {
  color: forestgreen;
  margin-left: 18.5%;
  font-size: 25%;
}
.lz-btns {
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.btn {
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: red;
  font-size: 28px;
}
</style>
