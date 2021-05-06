/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      description
      tags
      image
      createdAt
      updatedAt
    }
  }
`;

export const getTags = /* GraphQL */ `
  query($searchQuery: String) {
    listPosts(filter: {
      tags: {
        contains: $searchQuery
      }
    }) {
      items {
        tags
        description
        image
      }
    }
  }
  `;

export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
