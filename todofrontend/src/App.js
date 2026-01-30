import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({ title: "", completed: false });
  const [editId, setEditId] = useState(null);
  const API_URL = "http://127.0.0.1:8000/api/todos/";

  useEffect(() => {
    fetchTodos();
  }, []);


  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Could not connect to the server", err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {

        await axios.put(`${API_URL}${editId}/`, formData);
        setEditId(null);
      } else {
     
        await axios.post(API_URL, formData);
      }
      setFormData({ title: "", completed: false });
      fetchTodos(); 
    } catch (err) {
      console.error("Cannot save the data!", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchTodos();
    } catch (err) {
      console.error("Could not delete the todo!", err);
    }
  };


  const startEdit = (todo) => {
    setEditId(todo.id);
    setFormData({ title: todo.title, completed: todo.completed });
  };

  return (
    <div className="App">
      <div className="todo-container">
        <h1> Todo </h1>
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <button type="submit" className="add-btn">
            {editId ? "Update Task" : "Add Task"}
          </button>
        </form>
        <div className="todo-list">
          {todos.map((todo) => (
            <div key={todo.id} className="todo-item">
              <span className={todo.completed ? "completed" : ""}>
                {todo.title}
              </span>
              <div className="actions">
                <button onClick={() => startEdit(todo)} className="edit-btn">Edit</button>
                <button onClick={() => deleteTodo(todo.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;