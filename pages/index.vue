<template>
  <el-row type="flex" justify="center">
    <div ref="wrapper" class="container">
      <el-col :xs="24" :md="24">
        <span v-if="!showGame">
          <el-row justify="center" type="flex">
            <el-col :sm="10">
              <el-button
                id="introMsg"
                style="display: inline-block; height: auto; white-space: normal; line-height: 30px"
                @click="showGame = !showGame"
              >
                {{ introMsg }}
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
          <el-row id="bday-msg">
            <h5>*happy 29th, dudak.</h5>
          </el-row>
        </span>
      </el-col>
    </div>
  </el-row>
</template>

<script>
import VueP5 from 'vue-p5'
import Victor from 'victor'
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
      seekSpeed: 0.0,
      frictionConstant: 0.0005,
      multiplier: 0.7,
      showGame: false,
      introMsg: `Two entities just roam about in an orthogonal world. But they have yet to discover their dynamics, the frictions, and the collisions, the borders, the overlaps, and the confusions.`
    }
  },
  methods: {
    handleMouseOver() {},
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

      this.drawLimiters(sk, this.multiplier)
    },
    draw(sk) {
      sk.drawingContext.setLineDash([0, 0])

      if (sk.frameCount % 50 === 0)
        this.drawBorders(sk) && this.drawLimiters(sk, this.multiplier)

      this.cirk1.applyForce(
        this.cirk1.seek(Victor(sk.pmouseX, sk.pmouseY), 0.75)
      )
      this.cirk1.applyForce(
        this.cirk1.seek(
          Victor(this.cirk2.location.x, this.cirk2.location.y),
          this.seekSpeed / 2
        )
      )
      this.cirk1.applyForce(this.cirk1.roam(2.2))
      this.cirk1.run()

      if (this.cirk1.location.x >= sk.width * this.multiplier)
        this.cirk1.applyForce(this.cirk1.doFriction(this.frictionConstant))

      this.cirk2.applyForce(this.cirk2.roam(1.2))
      if (this.cirk2.location.x <= sk.width * (1 - this.multiplier))
        this.cirk2.applyForce(this.cirk2.doFriction(this.frictionConstant))

      this.cirk2.run()

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
      sk.stroke(17 * 2, 2 * 2, 19 * 2, 100)
      sk.strokeWeight(0.75)
      sk.drawingContext.setLineDash([1, 2])
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
  font-size: 1.3rem;
  font-weight: 300;
  height: 2.6rem;
}
.el-button#naber {
  width: 100%;
  border-radius: 0px;
  color: white;
  border: 0px;
  background-color: transparent;
  font-family: inherit;
  font-style: italic;
  font-size: 1.8rem;
  font-weight: 300;
  height: 2.6rem;
}
.el-button#introMsg:hover {
  background-color: white;
  color: #110213;
  border: 0px;
}
.el-col .el-button:hover:not([id='naber']):not([id='introMsg']) {
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
#bday-msg h5 {
  color: white;
  font-weight: 300;
  font-size: 0.9rem;
  bottom: 10px;
  right: 10px;
  position: fixed;
}
</style>
