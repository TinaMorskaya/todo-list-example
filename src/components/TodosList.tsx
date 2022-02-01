import React, { useState } from 'react';
import '../App.css';
import {
  useMutation,
} from "@apollo/client";
import { CheckBox } from './CheckBox'
import {
  Link,
} from "react-router-dom";
import { DELETE_TODO } from '../graphQl/DELETE_TODO';
import type { ApolloError } from '@apollo/client';
import type { CheckBoxProps } from '../types/commonTypes'

export interface TodosListprops {
  todos: Array<CheckBoxProps>;
  error: ApolloError | undefined;
  loading: boolean;
  filterOptions: {
    options: {
      operators: {};
      search: {};
    };
  };
  setFilterOptions: React.Dispatch<React.SetStateAction<{
    options: {
      operators: {};
      search: {};
    };
  }>>
}

export const TodosList = ({ setFilterOptions, filterOptions, loading, error, todos, }: TodosListprops) => {
  const [checked, setChecked] = useState('all')
  const [searchText, setSearchText] = useState('')

  const [deleteTodo] = useMutation(DELETE_TODO);
  const handleDelete = (id: number) => {
    deleteTodo({
      variables: { id: id }
    });
    setDeletedTodos([...deletedTodos, id])
  }
  const [deletedTodos, setDeletedTodos] = useState<Array<number>>([])


  const handleChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.value !== 'all' && event.target.name === 'filter') {
      setChecked(event.target.value)
      setFilterOptions({
        options: {
          ...filterOptions.options,
          operators: {
            kind: "LIKE",
            field: "completed",
            value: event.target.value
          }
        }
      })
    } else {
      setChecked(event.target.value)
      setFilterOptions({
        options: {
          ...filterOptions.options,
          operators: {}
        }
      })
    }
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
    setFilterOptions({
      options: {
        ...filterOptions.options,
        search: {
          q: event.target.value
        }
      }
    })
  }

  const Main = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    if (todos?.length === 0) return <p>Unfortunately I couldn't find anything...</p>
    return (
      <>{todos?.map(({ id, title, completed }: CheckBoxProps) => (
        deletedTodos.includes(id)
          ? null
          : <CheckBox
            handleDelete={handleDelete}
            key={id} id={id}
            title={title}
            completed={completed}
          />
      ))}</>)
  }

  const radioButtons = [{ value: "true", label: "Done" }, { value: "false", label: "To do" }, { value: "all", label: "All" },]

  return (
    <>
      <h2>To-Do list for today 🎯</h2>
      <div className='list'>
        <div className='buttons-container'>
          <Link to='/new'>
            <button className='text-button'>
              Add new task
            </button>
          </Link>
          <div>
            <form className='filters'>
              {radioButtons.map((el) => (
                <label key={el.value} className='radio-label'>
                  <input type="radio" value={el.value} onChange={handleChangeFilter} checked={checked === el.value} name='filter' />
                  {el.label}
                </label>
              ))}
            </form>
          </div>
        </div>
        <input type='text' name='search' onChange={handleChangeInput} className='search' value={searchText} />
        <Main />
      </div>
    </>
  )
}