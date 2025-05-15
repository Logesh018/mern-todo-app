import { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("/api/todos", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (error) {
      console.log("Error updating todo", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
    } catch (error) {
      console.log("Error toggling todo:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* 🎨 Animated Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 animate-gradient blur-2xl opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-300 via-transparent to-transparent" />
      </div>

      {/* 💎 Glassmorphism Card Centered */}
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="bg-black/10 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl w-full max-w-xl p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-200 mb-6 text-center">
            ToDo List
          </h1>

          <form
            onSubmit={addTodo}
            className="flex items-center gap-2 shadow-sm border border-gray-200 p-2 rounded-lg bg-white/30"
          >
            <input
              className="flex-1 outline-none px-4 py-2 text-sm sm:text-base text-gray-100 placeholder-gray-400 rounded-md focus:ring-2 focus:ring-purple-400 transition"
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm sm:text-base font-medium shadow hover:shadow-md transition"
            >
              Add Task
            </button>
          </form>

          <div className="mt-6">
            {todos.length === 0 ? (
              <div className="text-center text-gray-200 py-10 text-sm sm:text-base">
                You have no tasks yet. Start by adding one✌️!
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {todos.map((todo) => (
                  <div key={todo._id}>
                    {editingTodo === todo._id ? (
                      <div className="flex items-center gap-x-3">
                        <input
                          className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-purple-400 text-gray-300 shadow-inner"
                          type="text"
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                        />
                        <div className="flex gap-x-2">
                          <button
                            onClick={() => saveEdit(todo._id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                          >
                            <MdOutlineDone />
                          </button>
                          <button
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer"
                            onClick={() => setEditingTodo(null)}
                          >
                            <IoClose />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between transition-all duration-200 bg-white/5 border border-gray-200 rounded-xl px-4 py-3 hover:shadow-md backdrop-blur-md">
                        <div className="flex items-center gap-x-4 overflow-hidden">
                          <button
                            onClick={() => toggleTodo(todo._id)}
                            className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center transition ${todo.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-purple-400"
                              }`}
                          >
                            {todo.completed && <MdOutlineDone />}
                          </button>
                          <span
                            className={`text-gray-300 truncate font-medium text-sm sm:text-base ${todo.completed ? "line-through text-gray-400" : ""
                              }`}
                          >
                            {todo.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-x-2 sm:gap-x-3">
                          <button
                            className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"
                            onClick={() => startEditing(todo)}
                          >
                            <MdModeEditOutline />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo._id)}
                            className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional Animation Utility */}
      <style>
        {`
          .animate-gradient {
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
          }

          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
}

export default App;

