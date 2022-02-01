import {
  gql,
} from "@apollo/client";

export const GET_TODOS = gql`
  query GetTodos ($options: PageQueryOptions) {
    todos(options: $options) {
      meta {
        totalCount
      }
      data {
        id
        title
        completed
        user {
          id
          name
        }
      }
    }
  }
`;