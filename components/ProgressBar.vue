<template>
  <div>
    <h3>
      PROXIMITY<span> - {{ Math.trunc(distance) }}x </span
      ><span v-if="proximityMessage.length !== 0">
        - [ {{ proximityMessage }} ]</span
      >
    </h3>
    <vue-p5 v-on="{ setup, draw }" />
  </div>
</template>
<script>
import VueP5 from 'vue-p5'

export default {
  components: {
    VueP5
  },
  props: {
    distance: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      lerpFrom: null,
      lerpTo: null
    }
  },
  computed: {
    proximityMessage() {
      let msg = ''
      if (this.distance <= 50) msg = 'OH NO! TOO CLOSE.'
      else if (this.distance >= 300) msg = 'OH NO! TOO FAR.'
      return msg
    }
  },
  methods: {
    setup(sk) {
      sk.createCanvas(400, 20)
      this.lerpFrom = sk.color(79, 18, 40, 255)
      this.lerpTo = sk.color(149, 167, 187, 255)
    },
    draw(sk) {
      const mapRatio = sk.map(this.distance, 0, 370, 0, 1)
      const fillCol = sk.lerpColor(this.lerpFrom, this.lerpTo, mapRatio)
      sk.background(fillCol, 200)
      sk.stroke(200, 150)
      sk.line(
        sk.map(this.distance, 0, 370, 0, 400),
        0,
        sk.map(this.distance, 0, 370, 0, 400),
        20
      )

      sk.noStroke()
      sk.noFill()
      sk.rectMode(sk.CENTER)
      sk.rect(sk.width / 2, sk.height / 2, 400, 20)

      // this.drawLines(sk, 20)
    },
    drawLines(sk, gap) {
      sk.stroke(200, 50)
      // for (let i = 1; i < 20; i++) {
      //   sk.line(i * gap, 0, i * gap, 5)
      //   sk.line(i * gap, 15, i * gap, 20)
      // }
      for (let i = 1; i < 40; i++) {
        sk.line((i * gap) / 2, 0, (i * gap) / 2, 2)
        sk.line((i * gap) / 2, 18, (i * gap) / 2, 20)
      }
    }
  }
}
</script>
<style scoped>
div h3 {
  color: white;
  font-weight: 300;
  font-size: 0.9rem;
  margin-bottom: 5px;
}
</style>
