import {
  gql,
} from "@apollo/client";

export const UPDATE_TODO = gql`
mutation updateTodo ($id: ID!, $input: UpdateTodoInput!) {
  updateTodo (id: $id, input: $input) {
    id,
    completed,
    user {
      id,
      name,
    }
  }
}
`;