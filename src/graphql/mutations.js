/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createImagePost = /* GraphQL */ `
  mutation CreateImagePost(
    $input: CreateImagePostInput!
    $condition: ModelImagePostConditionInput
  ) {
    createImagePost(input: $input, condition: $condition) {
      id
      description
      tags
      image
      createdAt
      updatedAt
    }
  }
`;
export const updateImagePost = /* GraphQL */ `
  mutation UpdateImagePost(
    $input: UpdateImagePostInput!
    $condition: ModelImagePostConditionInput
  ) {
    updateImagePost(input: $input, condition: $condition) {
      id
      description
      tags
      image
      createdAt
      updatedAt
    }
  }
`;
export const deleteImagePost = /* GraphQL */ `
  mutation DeleteImagePost(
    $input: DeleteImagePostInput!
    $condition: ModelImagePostConditionInput
  ) {
    deleteImagePost(input: $input, condition: $condition) {
      id
      description
      tags
      image
      createdAt
      updatedAt
    }
  }
`;
