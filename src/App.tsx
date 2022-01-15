import React, { useEffect, useState } from 'react';
import './App.css';
import {
  useMutation,
  useLazyQuery,
} from "@apollo/client";
import { CheckBox, CheckBoxProps } from './components/CheckBox'
import {
  Route,
  Routes,
  BrowserRouter,
  Link,
} from "react-router-dom";
import { EditeTodo } from './components/EditTodo';
import { NewTodo } from './components/NewTodo';
import { GET_TODOS } from './graphQl/GET_TODOS';
import { DELETE_TODO } from './graphQl/DELETE_TODO';

function TodosList() {
  const [filterOptions, setFilterOptions] = useState({
    options: {
      operators: {},
      search: {},
    }
  })
  const [checked, setChecked] = useState('all')
  const [getToDos, { loading, error, data }] = useLazyQuery(GET_TODOS);
  const [searchText, setSearchText] = useState('')
  console.log(data)
  useEffect(() => {
    const getData = async () => {
      await getToDos({
        variables: filterOptions
      });
    }
    getData()
  }, [filterOptions, getToDos])

  const [deleteTodo] = useMutation(DELETE_TODO);
  const handleDelete = (id: number) => {
    console.log(id)
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
    if (data?.todos?.data?.length === 0) return <p>Unfortunately I couldn't find anything...</p>
    return (
      <>{data?.todos?.data?.map(({ id, title, completed }: CheckBoxProps) => (
        deletedTodos.includes(id)
          ? null
          : <CheckBox handleDelete={handleDelete} key={id} id={id} title={title} completed={completed} />
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

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/"
            element={<TodosList />}
          />
          <Route path="/edit/:id"
            element={<EditeTodo />}
          />
          <Route path="/new"
            element={<NewTodo />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
