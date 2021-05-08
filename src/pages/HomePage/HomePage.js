import React from 'react';

import "./HomePage.css"

const HomePage = ({
  searchQuery,
  searchTags,
  searchedPosts,
  posts,
  setSearchQuery
}) => {

  return (
    <div>
      <input
        onChange={e => {setSearchQuery(e.target.value)}}
        placeholder="Search tags (i.e. sunset, mountain, etc...)"
        value={searchQuery}
      />
      <button onClick={searchTags}>Search</button>
      <div>
        {
          searchQuery ? searchedPosts.map((post, index) => (
            <div key={index} className="image-gallery">
              {
                post.image && <img src={post.image} style={{width: 400}} alt={post.description} />
              }
              <p>Tags: {post.tags}</p>
            </div>
          ))
          :
          posts.map(post => (
            <div key={post.id || post.tags} className="image-gallery">
              {
                post.image && <img src={post.image} style={{width: 400}} alt={post.description} />
              }
              <p>Tags: {post.tags}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default HomePage;