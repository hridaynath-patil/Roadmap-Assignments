import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <div className="counter-card">
        <h1 className="title">Counter App</h1>
        <div className="count-display">
          <span className={`count-value ${count > 0 ? 'positive' : count < 0 ? 'negative' : ''}`}>
            {count}
          </span>
        </div>
        <div className="button-group">
          <button className="btn btn-decrement" onClick={() => setCount(count - 1)}>
            -
          </button>
          <button className="btn btn-reset" onClick={() => setCount(0)}>
            Reset
          </button>
          <button className="btn btn-increment" onClick={() => setCount(count + 1)}>
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
