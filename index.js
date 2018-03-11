class Slider {
  constructor(options) {
    if (!options.ele) {
      return
    }
    this.delay = options.delay || 500
    this.loop = options.loop || true
    this.autoplay = options.autoPlay || true
    this.duration = Math.min(Math.max(options.duration, 0), 1)
    this.sliderEle = options.ele
    this.container = this.sliderEle.children[0]
    this.sliderDisplay = window.getComputedStyle(this.container).display
    this.container.style.display = 'none'
    this.init()
    this.autoplay && this.onloop()
    this.initEvent()
  }

  init() {
    let containerWidth = 0
    this.sliderWidth = this.sliderEle.clientWidth
    this.items = [].slice.call(this.container.children)
    this.itemLength = this.items.length
    this.items.forEach(item => {
      item.style.width = this.sliderWidth + 'px'
    })
    containerWidth = this.sliderWidth * (this.itemLength + 2)
    this.container.style.width = containerWidth + 'px'
    this.paddingBothSides()
    this.translate(this.container, -this.sliderWidth, 'X')
    this.setTransition(this.container, this.duration)
    this.container.style.display = this.sliderDisplay
  }

  paddingBothSides() {
    var firstChild = this.items[0].cloneNode(true)
    var lastChild = this.items[this.itemLength - 1].cloneNode(true)
    this.container.appendChild(firstChild)
    this.container.children[0].before(lastChild)
  }

  translate(ele, distance, direction = 'X') {
    typeof direction === 'number' && (direction = direction === 1 ? 'Y' : 'X')
    ele.style.transform =
      `translate${direction.toUpperCase()}(${distance}px)`
  }

  setTransition(ele, second) {
    ele.style.transition = `all ${second}s`
  }

  removeTransition(ele) {
    this.setTransition(ele, 0)
  }

  onloop() {
    this.currentIndex = 1
    this._timer = null
    this.isTransition = true
    this._timer = window[this.loop ? 'setInterval' : 'setTimeout'](() => {
      if (!this.isTransition) {
        this.setTransition(this.container, this.duration)
        this.isTransition = true
      }
      var position = this.sliderWidth * (++this.currentIndex)
      this.translate(this.container, -position, 'X')
      if (this.currentIndex === this.itemLength + 1) {
        this.currentIndex = 1
      }
    }, this.delay)
  }

  initEvent() {
    document.addEventListener('transitionend', event => {
      if (this.currentIndex === 1) {
        this.isTransition = false
        this.removeTransition(this.container)
        this.translate(this.container, -this.sliderWidth, 'X')
      }
    })
  }
}

new Slider({
  ele: document.getElementById('slider'),
  delay: 1000,
  loop: true,
  autoPlay: true,
  duration: .4,
});