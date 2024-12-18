import React from 'react';

const Task = ({ task }) => {
  return (
    <li>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Due Date: {new Date(task.due_date).toLocaleDateString()}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.status}</p>
    </li>
  );
};

export default Task;
