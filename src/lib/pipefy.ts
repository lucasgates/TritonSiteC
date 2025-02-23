import { GraphQLClient } from 'graphql-request';

const PIPEFY_API_URL = 'https://api.pipefy.com/graphql';

export const pipefy = new GraphQLClient(PIPEFY_API_URL, {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJQaXBlZnkiLCJpYXQiOjE3NDAyMTcwNTcsImp0aSI6ImE1NTI4ODA5LTdjNWYtNDIxZC04ZjJmLTI0MTFmZmU3MjEyYSIsInN1YiI6MzA0NjUyMTc5LCJ1c2VyIjp7ImlkIjozMDQ2NTIxNzksImVtYWlsIjoiY29udGFjdEB0cml0b25pbmZvc2VjLmNvbSJ9fQ.EVpe6LVdITwxE6Pf3caN-rswmp5-iVAJGnJzchTGa6zXeePxxMsfox039apwZg5d4l5PUMnPMEVabd2MSvrD4Q',
    'Content-Type': 'application/json',
  },
});

export const CREATE_CARD_MUTATION = `
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
      card {
        id
        title
        fields {
          name
          value
        }
      }
      clientMutationId
    }
  }
`;