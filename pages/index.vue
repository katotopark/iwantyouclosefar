<template>
  <el-row type="flex" justify="center">
    <div ref="wrapper" class="container">
      <el-col :xs="24" :md="24">
        <h3>I WANT YOU</h3>
        <el-row :gutter="10" class="button-container">
          <span v-for="(button, index) in ['CLOSE', 'FAR']" :key="button.key">
            <el-col :xs="12" :sm="12" :md="12">
              <div @mouseover="handleMouseOver">
                <el-button @click="() => handleClick(index)">{{
                  button
                }}</el-button>
              </div>
            </el-col>
          </span>
        </el-row>
        <el-row class="p5-container">
          <vue-p5 v-on="{ setup, draw, windowresized }" />
        </el-row>
        <!-- <el-row>
          <el-col
            :span="24"
            :style="{
              border: '1px solid white',
              height: '1.5rem',
              margin: '10px 0px 5px 0px'
            }"
          >
          </el-col>
          <h5 style="color: white; font-weight: 300">Proximity Indicator</h5>
        </el-row> -->
      </el-col>
    </div>
  </el-row>
</template>

<script>
import VueP5 from 'vue-p5'
import Victor from 'victor'

export default {
  components: {
    VueP5
  },
  data() {
    return {
      sizeFactor: 0.85,
      circleSize: 150,
      circleOne: null,
      circleTwo: null
    }
  },
  mounted() {
    // console.log(this.$refs.wrapper.offsetWidth)
  },
  methods: {
    handleMouseOver() {
      console.log('mouse hovering')
    },
    handleClick(e) {
      console.log('button clicked', e)
    },
    setup(sk) {
      sk.createCanvas(400, 400)
      // sk.frameRate()
      this.circleOne = this.createCircle(sk, sk.width * 0.3, sk.height / 2)
      this.circleTwo = this.createCircle(sk, sk.width * 0.7, sk.height / 2)
      // this.drawBorders(sk)
      this.drawLimiters(sk, 0.6)
    },
    draw(sk) {
      this.drawBorders(sk)
      // this.drawLimiters(sk, 0.6)
      // this.circleOne.addNoise(sk, 0.001)
      // this.circleOne.update(sk)
      this.circleOne.checkEdges(sk)
      // this.circleOne.roam(sk, 0.5, 8)
      this.circleOne.display(sk)
      // this.circleTwo.addNoise(sk, 0.001)
      // this.circleTwo.update(sk)
      // this.circleTwo.checkEdges(sk)
      this.circleTwo.display(sk)
      this.drawConnector(sk, this.circleOne.location, this.circleTwo.location)
      // sk.noLoop()
    },
    drawBorders(sk) {
      // sk.noFill()
      sk.fill(17, 2, 19, 10)
      sk.strokeWeight(2)
      sk.stroke(255)
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
    },
    createCircle(sk, initialLocX, initialLocY) {
      const circle = {
        location: new Victor(initialLocX, initialLocY),
        velocity: new Victor(),
        acceleration: new Victor(),
        nOff: new Victor(Math.random() * 10, Math.random() * 10),
        limit: 3,
        display: sk => {
          sk.stroke(255)
          sk.strokeWeight(0.8)
          sk.noFill()
          sk.ellipseMode(sk.CENTER)
          sk.ellipse(
            circle.location.x,
            circle.location.y,
            this.circleSize,
            this.circleSize
          )
        },
        update: sk => {
          circle.velocity.add(circle.acceleration)
          circle.velocity.limit(circle.limit, 0.4)
          circle.location.add(circle.velocity)
          circle.acceleration.multiply(0)
        },
        addNoise: (sk, val) => {
          circle.acceleration.x = sk.map(sk.noise(circle.nOff.x), 0, 1, -10, 10)
          circle.acceleration.y = sk.map(sk.noise(circle.nOff.y), 0, 1, -10, 10)
          circle.nOff.add(Victor(val, val))
        },
        roam: (sk, speed, scale) => {
          const angle =
            sk.noise(circle.location.x / scale, circle.location.y / scale) *
            sk.TWO_PI *
            scale
          console.log(circle.location.y)
          console.log(sk.sin(angle))
          circle.acceleration.x = sk.cos(angle)
          circle.acceleration.y = sk.sin(angle)
          circle.velocity.copy(circle.acceleration)
          circle.velocity.multiply(speed)
          circle.location.add(circle.velocity)
        },
        checkEdges: sk => {
          if (circle.location.x - this.circleSize <= 0) {
            circle.location.x = this.circleSize
            circle.velocity.multiply(Victor(-1, -1))
          } else if (circle.location.x + this.circleSize >= sk.width) {
            circle.location.x = sk.width - this.circleSize
            circle.velocity.multiply(Victor(-1, -1))
          }
          if (circle.location.y - this.circleSize <= 0) {
            circle.location.y = this.circleSize
            circle.velocity.multiply(Victor(-1, -1))
          } else if (circle.location.y + this.circleSize >= sk.height) {
            circle.location.y = sk.height - this.circleSize
            circle.velocity.multiply(Victor(-1, -1))
          }
        }
      }
      return circle
    },
    windowresized(sk) {
      console.log('resizing')
      sk.resizeCanvas(
        this.$refs.wrapper.$el.offsetWidth * this.sizeFactor,
        this.$refs.wrapper.$el.offsetWidth * this.sizeFactor
      )
    }
  }
}
</script>

<style scoped>
.el-col .el-button {
  width: 100%;
  border-radius: 0px;
  color: white;
  border: 1px solid white;
  background-color: transparent;
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: 300;
  height: 3rem;
}
.el-col .el-button:hover {
  background-color: white;
  color: #110213;
  font-style: italic;
  border: 0px;
}

.el-row.button-container {
  margin: 18px 0px 30px 0px;
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
</style>
