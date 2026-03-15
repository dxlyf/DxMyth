const {render}=ReactDOM
const createElement =React.createElement
const Fragment = React.Fragment
const {useState,useEffect,useRef,useCallback}=React

function App(){
const ref=useRef<HTMLDivElement>(null)
const [count,setCount]=useState(0)
useEffect(()=>{
  console.log('mounted',ref.current)
},[])
const handleAdd=useCallback(()=>{
  setCount(count+1)
},[count])
return <div ref={ref}>
    Hello World
    {count}
    <button onClick={handleAdd}>add</button>
  </div>
}

render(<App></App>,document.getElementById('app'))