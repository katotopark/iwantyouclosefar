<template>
  <el-row type="flex" justify="center">
    <div ref="wrapper" class="container">
      <el-col :xs="24" :md="24">
        <span v-if="!true">
          <el-row justify="center" type="flex">
            <el-col :sm="12">
              <el-button
                id="hello"
                style="display: inline-block; height: auto; white-space: normal; line-height: 30px"
                @click="showGame = !showGame"
              >
                {{ hello }}
              </el-button>
            </el-col>
          </el-row>
        </span>
        <span v-else>
          <h3>I WANT YOU</h3>
          <el-row :gutter="10" class="button-container">
            <span
              v-for="(button, index) in ['CLOSE', 'YET', 'FAR']"
              :key="button.key"
            >
              <div v-if="index == 1">
                <el-col :span="6">
                  <el-button id="naber" disabled>{{ button }}</el-button>
                </el-col>
              </div>
              <div v-else>
                <el-col :xs="9" :sm="9" :md="9">
                  <div @mouseover="handleMouseOver">
                    <el-button @click="() => handleClick(index)">{{
                      button
                    }}</el-button>
                  </div>
                </el-col>
              </div>
            </span>
          </el-row>
          <el-row class="p5-container">
            <vue-p5 v-on="{ setup, draw }" />
          </el-row>
          <el-row class="progress-bar">
            <progress-bar :distance="distance" />
          </el-row>
        </span>
      </el-col>
    </div>
  </el-row>
</template>

<script>
import VueP5 from 'vue-p5'
import ProgressBar from '../components/ProgressBar.vue'
import Circle from '../components/Circle'

export default {
  components: {
    VueP5,
    ProgressBar
  },
  data() {
    return {
      cirk1: null,
      cirk2: null,
      distance: 0,
      sizeFactor: 0.85,
      circleSize: 130,
      seekSpeed: 0.025,
      showGame: false,
      hello: `Two separate entities just roam about in an orthogonal world. But they have yet to discover their dynamics, the frictions, and the collisions, the overlaps, and the confusions.`
    }
  },
  methods: {
    handleMouseOver() {
      console.log('mouse hovering')
    },
    handleClick(e) {
      if (e === 0) this.seekSpeed += 0.25
      else if (e === 2) this.seekSpeed -= 0.25
    },
    setup(sk) {
      sk.createCanvas(400, 400)
      this.cirk1 = new Circle(
        sk,
        sk.width * 0.3,
        sk.height / 2,
        this.circleSize
      )
      this.cirk2 = new Circle(
        sk,
        sk.width * 0.7,
        sk.height / 2,
        this.circleSize
      )

      this.drawLimiters(sk, 0.6)
    },
    draw(sk) {
      if (sk.frameCount % 50 === 0) this.drawBorders(sk)

      this.cirk1.applyForce(
        this.cirk1.seek(this.cirk2.location, this.seekSpeed / 2)
      )
      this.cirk1.applyForce(this.cirk1.roam(0.8))
      this.cirk1.checkEdges()
      this.cirk1.update()
      this.cirk1.display()

      this.cirk2.applyForce(this.cirk2.roam(0.7))
      this.cirk2.checkEdges()
      this.cirk2.update()
      this.cirk2.display()

      this.drawConnector(sk, this.cirk1.location, this.cirk2.location)
      this.distance = this.cirk1.location.distance(this.cirk2.location)
      // sk.noLoop()
    },
    drawBorders(sk) {
      // sk.noFill()
      sk.fill(17, 2, 19, 10)
      sk.strokeWeight(2)
      sk.stroke(255, 5)
      sk.rectMode(sk.CENTER)
      sk.rect(sk.width / 2, sk.height / 2, sk.width, sk.height)
    },
    drawLimiters(sk, multiplier) {
      sk.stroke(255, 50)
      sk.strokeWeight(1)
      sk.line(sk.width * multiplier, 0, sk.width * multiplier, sk.height)
      sk.line(
        sk.width * (1 - multiplier),
        0,
        sk.width * (1 - multiplier),
        sk.height
      )
    },
    drawConnector(sk, vec1, vec2) {
      sk.stroke(255)
      sk.strokeWeight(0.8)
      sk.line(vec1.x, vec1.y, vec2.x, vec2.y)
    }
  }
}
</script>

<style scoped>
.el-col .el-button:not([id='naber']) {
  width: 100%;
  border-radius: 0px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background-color: transparent;
  font-family: inherit;
  font-size: 1.6rem;
  font-weight: 300;
  height: 3rem;
}
.el-button#naber {
  width: 100%;
  border-radius: 0px;
  color: white;
  border: 0px;
  background-color: transparent;
  font-family: inherit;
  font-style: italic;
  font-size: 2rem;
  font-weight: 300;
  height: 3rem;
}
.el-button#hello:hover {
  background-color: white;
  color: #110213;
  border: 0px;
}
.el-col .el-button:hover:not([id='naber']):not([id='hello']) {
  background-color: white;
  color: #110213;
  font-style: italic;
  border: 0px;
}

.el-row.button-container {
  margin: 13px 0px 35px 0px;
}

h3 {
  font-family: Josefin Sans;
  font-style: italic;
  font-weight: 300;
  font-size: 2rem;
  text-align: center;
  color: white;
}

div.container {
  margin-top: 50px;
  min-height: 100vh;
}
.el-row.progress-bar {
  margin-top: 20px;
}
</style>
