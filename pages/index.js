import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Trash2 } from 'lucide-react';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (input.trim() === '') return;
    const newTodo = { id: Date.now(), text: input, completed: false };
    setTodos([...todos, newTodo]);
    setInput('');
  };

  const handleToggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="flex flex-col items-center min-h-screen font-sans p-4 bg-gray-900 text-gray-100">
      <Head>
        <title>Todo List App</title>
        <meta name="description" content="A simple and modern todo list app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full max-w-lg mx-auto mt-10">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-extrabold tracking-wider text-purple-400">TODO</h1>
        </header>

        {/* New Todo Input */}
        <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 mb-6 shadow-lg">
          <span className="w-6 h-6 border-2 border-gray-600 rounded-full"></span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Create a new todo..."
            className="w-full bg-transparent text-lg focus:outline-none"
          />
          <button
            onClick={handleAddTodo}
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Todo List */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-4 p-4 border-b border-gray-700 group"
            >
              <div
                onClick={() => handleToggleComplete(todo.id)}
                className={`w-6 h-6 flex-shrink-0 border-2 rounded-full cursor-pointer flex items-center justify-center ${
                  todo.completed ? 'border-purple-500 bg-gradient-to-br from-purple-400 to-pink-500' : 'border-gray-600'
                }`}
              >
                {todo.completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" strokeWidth="2" d="M1 4.304L3.696 7l6-6"/></svg>
                )}
              </div>
              <p className={`flex-grow text-lg ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </p>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {/* Footer / Controls */}
          <div className="flex justify-between items-center p-4 text-gray-500 text-sm">
            <span>{activeCount} items left</span>
            <div className="hidden sm:flex gap-4">
              <button onClick={() => setFilter('all')} className={`${filter === 'all' ? 'text-purple-400' : ''} hover:text-white`}>All</button>
              <button onClick={() => setFilter('active')} className={`${filter === 'active' ? 'text-purple-400' : ''} hover:text-white`}>Active</button>
              <button onClick={() => setFilter('completed')} className={`${filter === 'completed' ? 'text-purple-400' : ''} hover:text-white`}>Completed</button>
            </div>
            <button onClick={handleClearCompleted} className="hover:text-white">Clear Completed</button>
          </div>
        </div>
      </main>
    </div>
  );
}
