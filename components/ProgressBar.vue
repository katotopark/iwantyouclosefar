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
      sk.createCanvas(402, 30)
      this.lerpFrom = sk.color(79, 18, 40, 100)
      this.lerpTo = sk.color(149, 167, 187, 100)
    },
    draw(sk) {
      const mapRatio = sk.map(this.distance, 0, 350, 0, 1)
      const fillCol = sk.lerpColor(this.lerpFrom, this.lerpTo, mapRatio)
      sk.noStroke()
      sk.fill(fillCol, 50)
      sk.rectMode(sk.CORNER)
      sk.rect(1, 6, sk.map(this.distance, 0, 350, 0, 400), 19)

      sk.stroke(150)
      sk.noFill()
      sk.rectMode(sk.CENTER)
      sk.rect(sk.width / 2, sk.height / 2, 400, 20)
    }
  }
}
</script>
<style scoped>
h3 {
  color: white;
  font-weight: 300;
  font-size: 0.9rem;
}
</style>
