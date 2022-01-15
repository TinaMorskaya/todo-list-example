import {
  gql,
} from "@apollo/client";

export const DELETE_TODO = gql`
mutation deleteTodo ($id: ID!) {
  deleteTodo (id: $id)
}
`;