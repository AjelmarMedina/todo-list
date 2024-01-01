import { useState } from 'react';
import { ACTIONS } from '../lib/api';
import './App.css';

import useSWR, { useSWRConfig } from 'swr';

const SERVER = 'http://localhost:5000';

function App() {
  return (
    <>
      <h1>Todo List</h1>
      <NewTodoItem />
      <div className="card">
        <TodoList />
      </div>
    </>
  )
}

function NewTodoItem() {
  const { mutate } = useSWRConfig();
  const [newTodoContent, setNewTodoContent] = useState('');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        ACTIONS.addTodo(newTodoContent).then(() => {
          setNewTodoContent('');
          mutate(`${SERVER}/todos`);
        })
      }}
    >
      <input
        type="text"
        minLength={4}
        value={newTodoContent}
        onChange={e => setNewTodoContent(e.target.value)}
      />
      <button type="submit">
        Add Todo
      </button>
    </form>
  )
}

function TodoList() {
  const { data, error, isLoading } = useSWR(`${SERVER}/todos`, ACTIONS.getTodos)
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  // render data

  function TodoItem({ todo }) {
    const { mutate } = useSWRConfig()
    const [isBeingEdited, setIsBeingEdited] = useState(false);
    
    function EditTodoContent() {
      const [newTodoContent, setNewTodoContent] = useState(todo.content);
      return (
        <form
          onSubmit={e => {
            e.preventDefault();
            if (newTodoContent === todo.content) return setIsBeingEdited(false);
            ACTIONS.updateTodo(todo, newTodoContent, todo.is_checked).then(() => {
              mutate(`${SERVER}/todos`);
              setIsBeingEdited(false);
            })
          }}
        >
          <input
            autoFocus
            id='content'
            name='content'
            value={newTodoContent}
            onChange={e => setNewTodoContent(e.target.value)}
          />
          <br />
        </form>
      )
    }
  
    return (
      <div>
        <hr />
        {isBeingEdited
          ? <EditTodoContent />
          : (
            <h3
              style={todo.is_checked
                ? {textDecoration: 'line-through'}
                : {textDecoration: 'none'}
              }
            >
              {todo.content}
            </h3>
          )
        }
        <button
          onClick={e => {
            e.preventDefault();
            ACTIONS.updateTodo(todo, todo.content, !todo.is_checked).then(() => {
              mutate(`${SERVER}/todos`)
            });
          }}
        >
          Toggle
        </button>
        <button
          style={{
            color: 'green'
          }}
          onClick={e => {
            e.preventDefault();
            setIsBeingEdited(!isBeingEdited);
          }}
        >
          Edit
        </button>
        <button
          style={{
            color: 'red'
          }}
          onClick={e => {
            e.preventDefault();
            ACTIONS.deleteTodo(todo).then(() => {
              mutate(`${SERVER}/todos`);
            })
          }}
        >
          Delete
        </button>
      </div>
    )
  }
  
  return (
    <>
      {data.map((todo, i) => (
        <TodoItem key={i} todo={todo}/>
      ))}
    </>
  )
}



export default App
