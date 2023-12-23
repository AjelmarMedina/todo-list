import { useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import axios from 'axios'
import useSWR from 'swr'
// import { ACTIONS } from '../lib/api'

const fetcher = url => axios.get(url)
  .then((res) => {
    // console.log(res.data);
    return res.data;
  })
  .catch((e) => {
    console.error('Something went wrong with fetching your Todo List');
    console.error(e);
    return [];
  })

function App() {
  const [count, setCount] = useState(0)

  function Todos () {
    const { data, error, isLoading } = useSWR('http://localhost:5000/todos', fetcher)
    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>
    // render data
    return (
      <>
        {data.map((todo, i) => (
          <h3 key={i}>{todo.content}</h3>
        ))}
      </>
    )
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <Todos />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
