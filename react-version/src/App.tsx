
import { useState } from 'react';
import './App.css';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  return (
    <li className="task-item">
      <span className={task.completed ? 'completed-task' : ''}>
        {task.title}
      </span>

      <div className="task-buttons">
        <button onClick={() => onComplete(task.id)}>
          {task.completed ? 'Undo' : 'Complete'}
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [apiTasks, setApiTasks] = useState<Task[]>([]);
  const [message, setMessage] = useState('');

  function addTask() {
    if (taskInput.trim() === '') {
      alert('Please enter a task!');
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: taskInput.trim(),
      completed: false,
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
    setTaskInput('');
  }

  function completeTask(id: number) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id: number) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  }

  async function loadSampleTasks() {
    setMessage('Loading sample tasks...');

    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos?_limit=5'
      );

      if (!response.ok) {
        throw new Error('Unable to fetch tasks');
      }

      const data: Task[] = await response.json();

      setApiTasks(data);
      setMessage('Sample tasks loaded successfully!');
    } catch {
      setMessage('Unable to load tasks. Check your internet connection.');
    }
  }

  const pendingCount = tasks.filter(
    (task) => !task.completed
  ).length;

  const completedCount = tasks.reduce(
    (count, task) => count + (task.completed ? 1 : 0),
    0
  );

  return (
    <main className="container">
      <h1>Student Task Manager</h1>
      <p className="subtitle">Organize your study tasks easily!</p>

      <div className="input-area">
        <input
          type="text"
          placeholder="Enter your task"
          value={taskInput}
          onChange={(event) => setTaskInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') addTask();
          }}
        />

        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="stats">
        <p>Total: {tasks.length}</p>
        <p>Pending: {pendingCount}</p>
        <p>Completed: {completedCount}</p>
      </div>

      <h2>My Tasks</h2>

      {tasks.length === 0 ? (
        <p className="empty-message">No tasks added yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      )}

      <h2>Sample Tasks from API</h2>

      <button onClick={loadSampleTasks}>
        Load Sample Tasks
      </button>

      <p className="message">{message}</p>

      <ul className="task-list">
        {apiTasks.map((task) => (
          <li className="task-item" key={task.id}>
            <span>{task.title}</span>
            <span>{task.completed ? 'Completed' : 'Pending'}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;

