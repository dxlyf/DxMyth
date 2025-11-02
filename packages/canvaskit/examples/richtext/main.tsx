
  // FILE: src/main.ts
  import './styles.css'
  import { CanvasRichTextEditor } from './editor'
  
  const app = document.createElement('div')
  app.className = 'app'
  
  const toolbar = document.createElement('div')
  toolbar.className = 'toolbar'
  toolbar.innerHTML = `
    <button id="btnBold"><b>B</b></button>
    <button id="btnItalic"><i>I</i></button>
    <button id="btnUnderline"><u>U</u></button>
    <select id="fontSize"><option value="14">14</option><option value="16" selected>16</option><option value="18">18</option><option value="24">24</option><option value="32">32</option></select>
    <input id="fontColor" type="color" value="#000000">
    <button id="btnUndo">Undo</button>
    <button id="btnRedo">Redo</button>
  `
  
  const editorWrap = document.createElement('div')
  editorWrap.className = 'editor-wrap'
  
  const canvasWrap = document.createElement('div')
  canvasWrap.className = 'canvas-wrap'
  const canvas = document.createElement('canvas')
  canvas.id = 'editor'
  canvasWrap.appendChild(canvas)
  const ime = document.createElement('textarea')
  ime.id = 'ime'
  ime.autocomplete = 'off'
  canvasWrap.appendChild(ime)
  
  const side = document.createElement('div')
  side.className = 'side'
  side.innerHTML = '<h4>Instructions</h4><ul><li>Click to place caret</li><li>Type (supports IME)</li><li>Select and style text</li><li>Different font sizes supported</li></ul>'
  
  editorWrap.appendChild(canvasWrap)
  editorWrap.appendChild(side)
  app.appendChild(toolbar)
  app.appendChild(editorWrap)
  
  document.body.appendChild(app)
  
  const editor = new CanvasRichTextEditor(canvas, ime, {
    onReady() { console.log('editor ready') }
  })
  
  const btnBold = document.getElementById('btnBold') as HTMLButtonElement
  const btnItalic = document.getElementById('btnItalic') as HTMLButtonElement
  const btnUnderline = document.getElementById('btnUnderline') as HTMLButtonElement
  const fontSize = document.getElementById('fontSize') as HTMLSelectElement
  const fontColor = document.getElementById('fontColor') as HTMLInputElement
  const btnUndo = document.getElementById('btnUndo') as HTMLButtonElement
  const btnRedo = document.getElementById('btnRedo') as HTMLButtonElement
  
  btnBold.onclick = ()=>{ editor.toggleStyle('bold') }
  btnItalic.onclick = ()=>{ editor.toggleStyle('italic') }
  btnUnderline.onclick = ()=>{ editor.toggleStyle('underline') }
  fontSize.onchange = ()=>{ editor.setFontSize(parseInt(fontSize.value,10)) }
  fontColor.onchange = ()=>{ editor.setColor(fontColor.value) }
  btnUndo.onclick = ()=>{ editor.undo() }
  btnRedo.onclick = ()=>{ editor.redo() }
  
  window.addEventListener('resize', ()=>editor.resize())
  
 