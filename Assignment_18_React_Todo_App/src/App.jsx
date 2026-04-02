import { useState, useEffect } from 'react';
import TodoItem from './components/TodoItem';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  }

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="app-container">
      <div className="todo-card">
        <div className="header">
          <h1 className="title">Tasks</h1>
          <span className="task-count">{todos.length} {todos.length === 1 ? 'task' : 'tasks'}</span>
        </div>

        <form onSubmit={handleAddTodo} className="input-group">
          <input 
            type="text" 
            className="todo-input"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="add-btn">
            Add
          </button>
        </form>

        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">
               <p>No tasks yet. Add one above!</p>
            </div>
          ) : (
            todos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                toggleComplete={toggleComplete} 
                deleteTodo={deleteTodo} 
              />
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="footer">
            <span className="stats">{completedCount} completed</span>
            {completedCount > 0 && (
              <button 
                className="clear-btn"
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
