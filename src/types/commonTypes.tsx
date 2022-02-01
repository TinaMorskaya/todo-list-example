export type Todo = {
  todo: {
    id: number
    title: string
    completed: boolean
  }
}

export type CheckBoxProps = {
  completed: boolean,
  title: string,
  id: number,
  handleDelete: (id: number) => void,
}

export interface SetTodoProps  {
  setTodos: React.Dispatch<React.SetStateAction<CheckBoxProps[]>>
}