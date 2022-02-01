import {
  gql,
} from "@apollo/client";

export const CREATE_TODO = gql`
mutation createTodo ($input: CreateTodoInput!) {
  createTodo (input: $input) {
    id
    title
    completed
  }
}
`;