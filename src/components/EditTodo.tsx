import React, { useState } from 'react';
import '../App.css';
import {
  useQuery,
  useMutation,
} from "@apollo/client";
import { UPDATE_TODO } from '../graphQl/UPDATE_TODO'
import { GET_TODO } from '../graphQl/GET_TODO';
import { useParams } from 'react-router-dom';
import { SingleTodo } from './SingleTodo';

export type EditeTodoProps = {
  title: string,
  id: number,
  handleDelete: (id: number) => void,
}

export type Todo = {
  todo: {
    id: number
    title: string
    completed: boolean
  }
}

export const EditeTodo = () => {
  const { id } = useParams();
  const todoId = Number(id);
  const [text, setText] = useState('');
  const [
    updateTodo
  ] = useMutation(UPDATE_TODO);

  useQuery(GET_TODO, {
    variables: { id: todoId }, onCompleted: ((data: Todo) => setText(data?.todo?.title))
  });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }

  const handleSave = () => {
    updateTodo({
      variables: {
        id: todoId, input: {
          title: text
        }
      }
    });
  }

  return (
    <SingleTodo text={text} handleChange={handleChange} handleSave={handleSave} />
  )
}