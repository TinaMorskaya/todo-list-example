import React, { useState } from 'react';
import '../App.css';
import {
  useMutation,
} from "@apollo/client";
import { CREATE_TODO } from '../graphQl/CREATE_TODO'
import { SingleTodo } from './SingleTodo'

export type EditeTodoProps = {
  title: string,
  id: number,
  handleDelete: (id: number) => void,
}

export const NewTodo = () => {
  const [text, setText] = useState('');
  const [
    createTodo
  ] = useMutation(CREATE_TODO);
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }


  const handleSave = () => {
    createTodo({
      variables: {
        input: {
          title: text,
          completed: false,
        }
      }
    });
  }

  return (
    <SingleTodo text={text} handleChange={handleChange} handleSave={handleSave}/>
  )
}