import React, { useState } from 'react';
import '../App.css';
import {
  useMutation,
} from "@apollo/client";
import { Link } from 'react-router-dom';
import { UPDATE_TODO } from '../graphQl/UPDATE_TODO'

export type CheckBoxProps = {
  completed: boolean,
  title: string,
  id: number,
  handleDelete: (id: number) => void,
  forwardRef?: (node: any) => void
}

export const CheckBox = ({ completed, title, id, handleDelete, forwardRef }: CheckBoxProps) => {
  const [
    updateTodo
  ] = useMutation(UPDATE_TODO);
  const [check, setCheck] = useState(completed)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setCheck(!check)
    updateTodo({
      variables: {
        id: id, input: {
          completed: !check
        }
      }
    });
  }

  const editLink = `/edit/${id}`;
  return (
    <>
    {forwardRef?
    (<div className='todo' ref={forwardRef}>
      <input
        type="checkbox"
        id={id.toString()}
        checked={completed}
        onChange={handleChange} />
      <label className='checkbox-label' htmlFor={id.toString()}>{title}</label>
      <Link to={editLink}>
        <button className='tools-button'>✏️</button>
      </Link>
      <button className='tools-button' onClick={() => handleDelete(id)} name={id.toString()}>
        🗑
      </button>
    </div>
    )
    :     (<div className='todo'>
    <input
      type="checkbox"
      id={id.toString()}
      checked={completed}
      onChange={handleChange} />
    <label className='checkbox-label' htmlFor={id.toString()}>{title}</label>
    <Link to={editLink}>
      <button className='tools-button'>✏️</button>
    </Link>
    <button className='tools-button' onClick={() => handleDelete(id)} name={id.toString()}>
      🗑
    </button>
  </div>)
}
  </>
  )
}