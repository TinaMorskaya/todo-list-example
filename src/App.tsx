import React, { useEffect, useState,useRef, useCallback } from 'react';
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
      paginate: {
        page: 1,
        limit: 10,
      }
    }
  })
  const [pageNum, setPageNum] = useState(1);
  const [checked, setChecked] = useState('all')
  const [getToDos, { loading, error, data }] = useLazyQuery(GET_TODOS);
  const [searchText, setSearchText] = useState('')
  const [todos, setTodos] = useState<Array<CheckBoxProps>>([]);
  

  const hasMore = data?.todos?.data?.length > 0 ? true : false
  const observer = useRef<any>();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          if(todos?.length < data?.todos?.meta?.totalCount ) {
          setFilterOptions({
            options: {
              ...filterOptions.options,
              paginate: {
                page: pageNum + 1,
                limit: 10,
              },
            }
          })
          setPageNum((prev) => prev + 1);
        }
      }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  
  useEffect(() => {
    const getData = async () => {
      await getToDos({
        variables: filterOptions
      });
    }
    getData()
  }, [filterOptions, getToDos])

  useEffect(() => {
    const setData = () => {
      if (data?.todos?.data) {
        setTodos((prev) => {
        return [...prev, ...data?.todos?.data];
        })
      }
    }
    setData()
  }, [data])

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
          paginate: {
            page: 1,
            limit: 10,
          }, 
          operators: {
            kind: "LIKE",
            field: "completed",
            value: event.target.value
          }
        }
      })
      setTodos([])
    } else {
      setChecked(event.target.value)
      setFilterOptions({
        options: {
          ...filterOptions.options,
          paginate: {
            page: 1,
            limit: 10,
          },
          operators: {}
        }
      })
      setTodos([])
    }
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
    setFilterOptions({
      options: {
        ...filterOptions.options,
        paginate: {
          page: 1,
          limit: 10,
        },
        search: {
          q: event.target.value
        }
      }
    })
    setTodos([])
  }

  const Main = () => {
    if (error) return <p>Error :(</p>;
    if (data?.todos?.data?.length === 0 && todos?.length === 0) return <p>Unfortunately I couldn't find anything...</p>
    return (
      <>
        {todos?.map(({ id, title, completed }: CheckBoxProps, idx: number) => (
          deletedTodos.includes(id)
            ? null
            : 
            ((todos.length === idx + 1) ?
            <CheckBox forwardRef={lastBookElementRef} handleDelete={handleDelete} key={id} id={id} title={title} completed={completed} />
            :  <CheckBox handleDelete={handleDelete} key={id} id={id} title={title} completed={completed} />
            )
        ))}
        {loading && <p>Loading...</p>}
      </>
    )
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
