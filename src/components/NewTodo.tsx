import React, { useState } from 'react';
import '../App.css';
import {
  useMutation,
} from "@apollo/client";
import { CREATE_TODO } from '../graphQl/CREATE_TODO'
import { SingleTodo } from './SingleTodo'
import { useNavigate } from 'react-router-dom';
import type { SetTodoProps } from '../types/commonTypes';

export const NewTodo = ({setTodos}: SetTodoProps) => {
  const [text, setText] = useState('');
  const [
    createTodo
  ] = useMutation(CREATE_TODO);
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }

  let navigate = useNavigate();

  const handleSave = async () => {
    const newTask = await createTodo({
      variables: {
        input: {
          title: text,
          completed: false,
        }
      }
    });
    setTodos((prev)=> [{...newTask?.data?.createTodo}, ...prev])
    navigate('/');
  }

  return (
    <SingleTodo 
      text={text} 
      handleChange={handleChange} 
      handleSave={handleSave}
    />
  )
}