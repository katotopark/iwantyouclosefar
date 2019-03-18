<template>
  <el-row type="flex" justify="center">
    <div ref="wrapper" class="container">
      <el-col :xs="24" :md="24">
        <span v-if="!showGame">
          <el-row justify="center" type="flex">
            <el-col :sm="12">
              <el-button
                @click="showGame = !showGame"
                style="display: inline-block; height: auto; white-space: normal; line-height: 30px"
                id="hello"
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
            <vue-p5 v-on="{ setup, draw, windowresized }" />
          </el-row>
        </span>

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
      circleTwo: null,
      showGame: false,
      hello: `Two entities roam about in an orthogonal world. But they have yet to discover their dynamics, the frictions, and the collisions, the overlaps, and the confusions.`
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
      // sk.frameRate(10)
      this.circleOne = this.createCircle(sk, sk.width * 0.3, sk.height / 2)
      this.circleTwo = this.createCircle(sk, sk.width * 0.7, sk.height / 2)
      // this.drawBorders(sk)
      this.drawLimiters(sk, 0.6)
    },
    draw(sk) {
      if (sk.frameCount % 5 === 0) this.drawBorders(sk)

      // this.circleOne.applyForce(sk, this.circleOne.separate(sk, this.circleTwo))
      // const seek = this.circleOne.seek(sk, Victor(0, 0))
      // this.circleOne.applyForce(sk, seek)
      this.circleOne.roam(sk, 0.001, 200)
      this.circleOne.update(sk)
      this.circleOne.checkEdges(sk)
      this.circleOne.display(sk)
      this.circleTwo.roam(sk, 0.001, 200)
      this.circleTwo.update(sk)
      this.circleTwo.checkEdges(sk)
      this.circleTwo.display(sk)

      const loc = this.circleTwo.location
      console.log(loc)

      this.drawConnector(sk, this.circleOne.location, this.circleTwo.location)
      sk.noLoop()
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
    },
    createCircle(sk, initialLocX, initialLocY) {
      const circle = {
        location: new Victor(initialLocX, initialLocY),
        velocity: new Victor(),
        acceleration: new Victor(),
        nOff: new Victor(Math.random() * 10, Math.random() * 10),
        limit: 3,
        mass: 2,
        display: sk => {
          sk.stroke(255, 100)
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
          circle.velocity.limit(circle.limit, 2)
          circle.location.add(circle.velocity)
          circle.acceleration.multiply(0)
        },
        applyForce: (sk, force) => {
          const f = force.divide(Victor(circle.mass, circle.mass))
          circle.acceleration.add(f)
        },
        seek: (sk, target) => {
          const maxSpeed = 2
          const maxForce = 1
          const desired = target.subtract(circle.location)
          desired.normalize()
          desired.multiply(Victor(maxSpeed, maxSpeed))

          const steer = desired.subtract(circle.velocity)
          steer.limit(maxForce, 1)
          return steer
        },
        separate: (sk, _circle) => {
          const maxSpeed = 100
          const maxForce = 50
          const desiredSeparation = 100
          const steer = new Victor()
          let count = 0

          const d = circle.location.distance(_circle.location)
          console.log(d)
          if (d > 0 && d < desiredSeparation) {
            const diff = circle.location.subtract(_circle.location)
            console.log('diff is', diff)
            diff.normalize()
            diff.divide(d)
            steer.add(diff)
            count++
          }
          if (count > 0) steer.divide(Victor(count, count))
          if (steer.length() > 0) {
            steer.normalize()
            steer.multiply(Victor(maxSpeed, maxSpeed))
            steer.subtract(circle.velocity)
            steer.limit(maxForce, 20)
          }
          console.log(steer)
          return steer
        },
        roam: (sk, speed, scale) => {
          const angle =
            sk.noise(circle.nOff.x / scale, circle.nOff.y / scale) *
            sk.TWO_PI *
            scale
          circle.acceleration.copy(Victor(sk.cos(angle), sk.sin(angle)))
          circle.velocity.copy(circle.acceleration)
          circle.velocity.multiply(Victor(speed, speed))
          circle.location.add(circle.velocity)
          circle.nOff.add(Victor(50, 50))
        },
        checkEdges: sk => {
          if (circle.location.x - this.circleSize / 2 <= 0) {
            circle.location.x = this.circleSize / 2
            circle.velocity.multiply(Victor(-1, -1))
          } else if (circle.location.x + this.circleSize / 2 >= sk.width) {
            circle.location.x = sk.width - this.circleSize / 2
            circle.velocity.multiply(Victor(-1, -1))
          }
          if (circle.location.y - this.circleSize / 2 <= 0) {
            circle.location.y = this.circleSize / 2
            circle.velocity.multiply(Victor(-1, -1))
          } else if (circle.location.y + this.circleSize / 2 >= sk.height) {
            circle.location.y = sk.height - this.circleSize / 2
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
</style>
