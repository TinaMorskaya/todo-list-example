import '../App.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export type SingleTodoProps = {
  text: string,
  handleSave: () => void,
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const SingleTodo = ({ text, handleChange, handleSave }: SingleTodoProps) => {
  const [valid, setValid] = useState(true);
  let navigate = useNavigate();

  const handleClick = () => {
    if (text.length < 3) {
      setValid(false)
    } else {
      setValid(true);
      navigate('/');
    }
  }
  
  const saveButtonClass = valid? 'text-button' : 'text-button disable-button'
  return (
    <>
      <h2>Task 🕯</h2>
      <div className='small-list'>
        <textarea placeholder='Enter task description' value={text} required maxLength={200} minLength={3} onChange={handleChange} />
        <div className='main-buttons-container'>
          {!valid && <p className='invalid-text'>Please, enter more than 2 characters.</p>}
          <button className={saveButtonClass} onClick={handleClick}>Save</button>
          <Link to='/'>
            <button className='text-button'>
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}