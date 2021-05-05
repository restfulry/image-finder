/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getImagePost = /* GraphQL */ `
  query GetImagePost($id: ID!) {
    getImagePost(id: $id) {
      id
      description
      tags
      image
      createdAt
      updatedAt
    }
  }
`;
export const listImagePosts = /* GraphQL */ `
  query ListImagePosts(
    $filter: ModelImagePostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listImagePosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        description
        tags
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
