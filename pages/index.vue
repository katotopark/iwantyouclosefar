<template>
  <el-row type="flex" justify="center">
    <el-col ref="wrapper" :xs="20" :md="12">
      <h3 :style="{ color: 'white' }">I want you</h3>
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-button>Close</el-button>
        </el-col>
        <el-col :span="12">
          <el-button>Far</el-button>
        </el-col>
      </el-row>
      <vue-p5 v-on="{ setup, draw, windowresized }" />
    </el-col>
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
    // console.log(this.$refs.wrapper)
  },
  methods: {
    setup(sk) {
      sk.createCanvas(
        this.$refs.wrapper.$el.offsetWidth * this.sizeFactor,
        this.$refs.wrapper.$el.offsetWidth * this.sizeFactor
      )
      sk.frameRate()
      this.circleOne = this.createCircle(sk, sk.width * 0.3, sk.height / 2)
      this.circleTwo = this.createCircle(sk, sk.width * 0.7, sk.height / 2)
    },
    draw(sk) {
      this.drawBorders(sk)
      this.drawLimiters(sk, 0.6)

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
      sk.fill(0, 50)
      sk.strokeWeight(1.2)
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
.el-button {
  width: 100%;
  border-radius: 0px;
}
</style>
