/**
 * @author mrdoob / http://mrdoob.com/
 */

export interface StatsPanel {
  dom: HTMLCanvasElement
  update(value: number, maxValue: number): void
}

export interface StatsInstance {
  REVISION: number
  dom: HTMLDivElement
  addPanel(panel: StatsPanel): StatsPanel
  showPanel(id: number): void
  begin(): void
  end(): number
  update(): void
  domElement: HTMLDivElement
  setMode(id: number): void
}

interface StatsConstructor {
  (): StatsInstance
  Panel: (name: string, fg: string, bg: string) => StatsPanel
}

const Stats = function (): StatsInstance {
  let mode = 0

  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000'
  container.addEventListener('click', function (event: MouseEvent) {
    event.preventDefault()
    showPanel(++mode % container.children.length)
  }, false)

  function addPanel(panel: StatsPanel): StatsPanel {
    container.appendChild(panel.dom)
    return panel
  }

  function showPanel(id: number): void {
    for (let i = 0; i < container.children.length; i++) {
      (container.children[i] as HTMLElement).style.display = i === id ? 'block' : 'none'
    }
    mode = id
  }

  let beginTime = (performance || Date).now()
  let prevTime = beginTime
  let frames = 0

  const fpsPanel = addPanel(Stats.Panel('FPS', '#0ff', '#002'))
  const msPanel = addPanel(Stats.Panel('MS', '#0f0', '#020'))

  let memPanel: StatsPanel | undefined
  if (self.performance && (performance as any).memory) {
    memPanel = addPanel(Stats.Panel('MB', '#f08', '#201'))
  }

  showPanel(0)

  return {
    REVISION: 16,

    dom: container,

    addPanel,
    showPanel,

    begin(): void {
      beginTime = (performance || Date).now()
    },

    end(): number {
      frames++

      const time = (performance || Date).now()

      msPanel.update(time - beginTime, 200)

      if (time > prevTime + 1000) {
        fpsPanel.update((frames * 1000) / (time - prevTime), 100)

        prevTime = time
        frames = 0

        if (memPanel) {
          const memory = (performance as any).memory as { usedJSHeapSize: number; jsHeapSizeLimit: number }
          memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576)
        }
      }

      return time
    },

    update(): void {
      beginTime = this.end()
    },

    // Backwards Compatibility
    domElement: container,
    setMode: showPanel,
  }
} as StatsConstructor

Stats.Panel = function (name: string, fg: string, bg: string): StatsPanel {
  let min = Infinity
  let max = 0
  const round = Math.round
  const PR = round(window.devicePixelRatio || 1)

  const WIDTH = 80 * PR
  const HEIGHT = 48 * PR
  const TEXT_X = 3 * PR
  const TEXT_Y = 2 * PR
  const GRAPH_X = 3 * PR
  const GRAPH_Y = 15 * PR
  const GRAPH_WIDTH = 74 * PR
  const GRAPH_HEIGHT = 30 * PR

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  canvas.style.cssText = 'width:80px;height:48px'

  const context = canvas.getContext('2d')!
  context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif'
  context.textBaseline = 'top'

  context.fillStyle = bg
  context.fillRect(0, 0, WIDTH, HEIGHT)

  context.fillStyle = fg
  context.fillText(name, TEXT_X, TEXT_Y)
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT)

  context.fillStyle = bg
  context.globalAlpha = 0.9
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT)

  return {
    dom: canvas,

    update(value: number, maxValue: number): void {
      min = Math.min(min, value)
      max = Math.max(max, value)

      context.fillStyle = bg
      context.globalAlpha = 1
      context.fillRect(0, 0, WIDTH, GRAPH_Y)
      context.fillStyle = fg
      context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y)

      context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT)

      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT)

      context.fillStyle = bg
      context.globalAlpha = 0.9
      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT))
    },
  }
}

export default Stats