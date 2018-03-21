class Slider {
  constructor(options) {
    if (!options.ele) {
      return
    }
    this.delay = Math.max(options.delay * 1000, 200) || 3000
    this.duration = Math.min(Math.max(options.duration, 0), this.delay / 1000 * .6) || 0
    this.loop = options.loop
    this.dots = options.dots
    this.ctrl = options.ctrl
    this.autoPlay = options.autoPlay
    this.sliderEle = options.ele
    this.container = this.sliderEle.children[0]
    this.sliderDisplay = window.getComputedStyle(this.container).display
    this.container.style.display = 'none'
    this._timer = null
    this._isPlay = false
    this.init()
    this.autoPlay && this.play()
    this.ctrl && this.initCtrl()
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

  play() {
    this._isPlay = true
    this._timer = setInterval(() => {
      this.setContainer()
      this.onloop()
    }, this.delay)
  }

  stop() {
    this._isPlay = false
    clearInterval(this._timer)
  }

  onloop() {
    if (!this.loop && this.currentIndex === this.itemLength) {
      this.stop()
      return
    }
    if (this.currentIndex > this.itemLength) {
      this.currentIndex = 1
    } else if (this.currentIndex < 1) {
      this.currentIndex = this.itemLength
    }
  }

  setContainer(direction = 1) {
    if (this.noTransition) {
      this.setTransition(this.container, this.duration)
      this.noTransition = false
    }
    var position = this.sliderWidth * (this.currentIndex += direction)
    this.translate(this.container, -position, 'X')
    this.dots && this.setDots()
  }

  setDots(index) {
    index = typeof index !== 'number' ?
      (this.currentIndex + this.itemLength - 1) % this.itemLength :
      index

    const dots = this.dotsConteiner.children
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

  initCtrl() {
    const leftCtrl = document.createElement('b')
    leftCtrl.className = 'slider__ctrl__left slider__ctrl'
    leftCtrl.innerHTML = `
      <svg t="1520824876225" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M745.8598323 904.817574L352.8396443 511.797385 745.8598323 118.777197c12.258185-12.258185 12.432147-32.892131-0.187265-45.51052-12.707416-12.707416-32.995485-12.703323-45.511543-0.187265L288.5002903 484.739123c-7.120165 7.120165-10.163477 17.065677-8.990768 26.624381-1.500167 9.755178 1.5104 20.010753 8.990768 27.491121l411.660734 411.660734c12.258185 12.258185 32.892131 12.432147 45.511543-0.187265 12.707416-12.707416 12.7023-32.995485 0.187265-45.51052z" fill="#666666" p-id="994"></path>
      </svg>
    `
    const rightCtrl = document.createElement('b')
    rightCtrl.className = 'slider__ctrl__right slider__ctrl'
    rightCtrl.innerHTML = `
      <svg t="1520824854908" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M279.3425527 904.817574L672.3627407 511.797385 279.3425527 118.777197c-12.258185-12.258185-12.432147-32.892131 0.187265-45.51052 12.707416-12.707416 32.995485-12.703323 45.511543-0.187265l411.660734 411.660734c7.120165 7.120165 10.163477 17.065677 8.990768 26.624381 1.500167 9.755178-1.5104 20.010753-8.990768 27.491121L325.0413607 950.515359c-12.258185 12.258185-32.892131 12.432147-45.511543-0.187265-12.707416-12.707416-12.703323-32.995485-0.187265-45.51052z" fill="#666666" p-id="866"></path>
      </svg>
    `
    this.sliderEle.appendChild(leftCtrl)
    this.sliderEle.appendChild(rightCtrl)
  }

  initEvent() {
    this.container.addEventListener('transitionend', event => {
      if (this.currentIndex === 1 || this.currentIndex === this.itemLength) {
        this.noTransition = true
        this.removeTransition(this.container)
        this.translate(this.container, -this.sliderWidth * this.currentIndex, 'X')
      }
      this.disabledCtrl = false
    })

    this.dotsConteiner && this.dotsConteiner.addEventListener('click', event => {
      const dotClickedIndex = [].indexOf.call(this.dotsConteiner.children, event.target)
      this.currentIndex = dotClickedIndex + 1
      this.setDots(dotClickedIndex)
      this.setContainer(0)
      this.onloop()
    })

    const ctrlLeft = document.getElementsByClassName('slider__ctrl__left')[0]
    const ctrlRight = document.getElementsByClassName('slider__ctrl__right')[0]

    const getCtrlClick = direction => event => {
      if (this.duration !== 0 && this.disabledCtrl) return
      const nextCurrentIndex = this.currentIndex + direction
      if (!this.loop && (nextCurrentIndex > this.itemLength || nextCurrentIndex < 1)) {
        return
      }
      this.setContainer(direction)
      this.onloop()
      this.disabledCtrl = true
    }

    if (this.ctrl) {
      ctrlLeft.onclick = getCtrlClick(-1)
      ctrlRight.onclick = getCtrlClick(1)
    }


    this.sliderEle.onmouseenter = (e) => {
      this.stop()
    }
    this.sliderEle.onmouseleave = (e) => {
      this.autoPlay && this.play()
    }

    // window.onfocus = e => {
    //   console.log(1)
    //   this.autoPlay && !this._isPlay && this.play()
    // }

    // window.onblur = e => {
    //   console.log(0)
    //   this.stop()
    // }
  }
}

new Slider({
  ele: document.getElementById('slider'),
  delay: 2,
  loop: true,
  autoPlay: true,
  duration: 3,
  dots: true,
  ctrl: true,

  // dotColor: '',
  // dotActiveColor: ''
})