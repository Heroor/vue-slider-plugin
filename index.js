class Slider {
  constructor(options) {
    if (!options.ele) {
      return
    }
    this.delay = Math.max(options.delay * 1000, 0) || 3000
    this.loop = options.loop
    this.autoplay = options.autoPlay
    this.duration = Math.min(Math.max(options.duration, 0), this.delay / 1000 - .1)
    this.dots = options.dots
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
    this.currentIndex = 0
    this.sliderWidth = this.sliderEle.clientWidth
    this.items = [].slice.call(this.container.children)
    this.itemLength = this.items.length
    this.items.forEach(item => {
      item.style.width = this.sliderWidth + 'px'
    })
    containerWidth = this.sliderWidth * (this.itemLength + 2)
    this.container.style.width = containerWidth + 'px'
    this.paddingBothSides()
    this.dots && this.initDots()
    this.setContainer()
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
    this._timer = null
    this._timer = setInterval(() => {
      this.setContainer()
      if (!this.loop && this.currentIndex === this.itemLength) {
        clearInterval(this._timer)
        return
      }
      if (this.currentIndex > this.itemLength) {
        this.currentIndex = 1
      }
    }, this.delay)
  }

  setContainer() {
    if (this.noTransition) {
      this.setTransition(this.container, this.duration)
      this.noTransition = false
    }
    var position = this.sliderWidth * (++this.currentIndex)
    this.translate(this.container, -position, 'X')
    this.dots && this.setDots()
  }

  setDots() {
    const dotContainer = this.sliderEle.getElementsByClassName('dots')[0]
    const index = (this.currentIndex - 1) % this.itemLength
    const dots = dotContainer.children
    this.items.forEach((v, i) => {
    	if (i === index) {
    		dots[i].classList.add('active')
    	} else {
    		dots[i].classList.remove('active')
    	}
    })
  }

  initDots() {
    var dot = `<span></span>`
    var innerHtmlDot = []
    this.items.forEach(v => {
      innerHtmlDot.push(dot)
    })
    this.dotsConteiner = document.createElement('div')
    this.dotsConteiner.className = 'dots'
    this.dotsConteiner.innerHTML = innerHtmlDot.join('')
    this.sliderEle.appendChild(this.dotsConteiner)
  }
  
  initEvent() {
    document.addEventListener('transitionend', event => {
      if (this.currentIndex === 1) {
        this.noTransition = true
        this.removeTransition(this.container)
        this.translate(this.container, -this.sliderWidth, 'X')
      }
    })
    this.sliderEle.onmouseenter = (e) => {
    	clearInterval(this._timer);
    }
    this.sliderEle.onmouseleave = (e) => {
    	this.onloop()
    }
  }
}

new Slider({
  ele: document.getElementById('slider'),
  delay: 1,
  loop: true,
  autoPlay: true,
  duration: 0.6,
  dots: true,
  // dotColor: '',
  // dotActiveColor: ''
});