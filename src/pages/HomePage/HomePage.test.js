import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

import { assert, expect, should } from 'chai';

const searchedPosts = [
  {
    id: "ID_1",
    image: "IMAGE_1",
    tags: "TAGS_1",
    description: "DESC_1",
  },
  {
    id: "ID_2",
    image: "IMAGE_2",
    tags: "TAGS_2",
    description: "DESC_2",
  },
  {
    id: "ID_3",
    image: "IMAGE_3",
    tags: "TAGS_3",
    description: "DESC_3",
  }
];

const searchQuery = "TAGS";

const posts = searchedPosts;

const searchTags = () => {};
const setSearchQuery = () => {};

test('renders learn react link', () => {
  render(
    <HomePage            
      searchQuery={searchQuery}
      searchTags={searchTags}
      searchedPosts={searchedPosts}
      posts={posts}
      setSearchQuery={setSearchQuery} 
    />);
  const linkElements = screen.getAllByText("TAGS", { exact: false });
  expect(linkElements).to.have.lengthOf(3);
});
