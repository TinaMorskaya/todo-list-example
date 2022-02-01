import React, { useEffect, useState } from 'react';
import {
  useLazyQuery,
} from "@apollo/client";
import {
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import { EditeTodo } from './components/EditTodo';
import { NewTodo } from './components/NewTodo';
import { GET_TODOS } from './graphQl/GET_TODOS';
import type { CheckBoxProps } from './types/commonTypes'
import { TodosList } from './components/TodosList'

function App() {
  const [filterOptions, setFilterOptions] = useState({
    options: {
      operators: {},
      search: {},
    }
  })
  const [getToDos, { loading, error, data }] = useLazyQuery(GET_TODOS);
  const [todos, setTodos] = useState<Array<CheckBoxProps>>([])

console.log('TD', todos)
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
      setTodos(data?.todos?.data)
    }
    setData()
  }, [data])


  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/"
            element={
              <TodosList 
                loading={loading} 
                error={error} 
                filterOptions={filterOptions} 
                setFilterOptions={setFilterOptions} 
                todos={todos} 
              />
            }
          />
          <Route path="/edit/:id"
            element={<EditeTodo />}
          />
          <Route path="/new"
            element={<NewTodo setTodos={setTodos}/>}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
