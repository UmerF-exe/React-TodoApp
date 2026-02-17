import './App.css';
import { use, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([
    {value: "Do workout", disabled: true},
    {value: "Breakfast time", disabled: true}
  ]);
  const [value, setValue] = useState("");

  const addTask = () => {
    setTasks([...tasks, {value, disabled: true}]);
    setValue("");
  }
  
  const deleteTask = (i) => {
    const newTasks = [...tasks];
    newTasks.splice(i,1);
    setTasks(newTasks);
  }

  const editTask = (i) => {
    tasks.splice(i,1,{value: tasks[i].value, disabled: !tasks[i].disabled});
    setTasks([...tasks]);
  }

  const updateTask = (v, i) => {
    v.disabled = true;
    setTasks([...tasks]);
  }

  return (
    <div>
      <h1>Tasks List</h1>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => addTask()}>Add Task</button>
      <button onClick={() => setTasks([])}>Delete All</button>
      <br />
      <ul>
        {tasks.map((v, i) => 
        <li key={i}>
        <input type="text" defaultValue={v.value} disabled = {v.disabled} onChange={(e) => v.value = e.target.value}/>
        {
          v.disabled ? <button onClick={() => editTask(i)}>Edit</button> : <button onClick={() => updateTask(v,isNaN)}>Update</button>
        }
        <button onClick={() => deleteTask(i)}>Delete</button>
        </li>)}
      </ul>
    </div>
  );
}

export default App;
