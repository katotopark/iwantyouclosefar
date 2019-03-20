import Victor from 'victor'

class Circle {
  constructor(sk, initLocX, initLocY, size) {
    this.sk = sk
    this.initLocX = initLocX
    this.initLocY = initLocY
    this.size = size
    this.location = new Victor(initLocX, initLocY)
    this.velocity = new Victor()
    this.acceleration = new Victor()
    this.nOff = new Victor(Math.random() * 10, Math.random() * 10)
    this.limit = 3
    this.mass = 2
  }
  display() {
    const sk = this.sk
    sk.stroke(0, 255, 0, 100)
    sk.strokeWeight(0.8)
    sk.noFill()
    sk.ellipseMode(sk.CENTER)
    sk.ellipse(this.location.x, this.location.y, this.size, this.size)
  }
  update() {
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.limit, 2)
    this.location.add(this.velocity)
    this.acceleration.multiply(Victor(0, 0))
  }
  applyForce(force) {
    const f = force.divide(Victor(this.mass, this.mass))
    this.acceleration.add(f)
  }
  seek(target, speed) {
    const maxSpeed = speed
    const maxForce = 1
    const desired = target.subtract(this.location)
    desired.normalize()
    desired.multiply(Victor(maxSpeed, maxSpeed))

    const steer = desired.subtract(this.velocity)
    steer.limit(maxForce, 1)
    return steer
  }
  roam(scale, speed) {
    const sk = this.sk
    const angle =
      sk.noise(this.location.x / scale, this.location.y / scale) *
      sk.TWO_PI *
      scale
    this.acceleration.x = sk.cos(angle)
    this.acceleration.y = sk.sin(angle)

    this.velocity.copy(this.acceleration)
    this.velocity.multiply(Victor(speed, speed))
    this.location.add(this.velocity)
  }
  checkEdges() {
    const sk = this.sk

    if (this.location.x - this.size / 2 <= 0) {
      this.location.x = this.size / 2
      this.velocity.multiply(Victor(-1, 0))
    } else if (this.location.x + this.size / 2 >= sk.width) {
      this.location.x = sk.width - this.size / 2
      this.velocity.multiply(Victor(-1, 0))
    }
    if (this.location.y - this.size / 2 <= 0) {
      this.location.y = this.size / 2
      this.velocity.multiply(Victor(0, -1))
    } else if (this.location.y + this.size / 2 >= sk.height) {
      this.location.y = sk.height - this.size / 2
      this.velocity.multiply(Victor(0, -1))
    }
  }
}

export default Circle
