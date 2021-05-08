import React from 'react';

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
        onChange={e => {console.log(e.target.value); setSearchQuery(e.target.value)}}
        placeholder="Search"
        value={searchQuery}
      />
      <button onClick={searchTags}>Search</button>
        {
          searchQuery ? searchedPosts.map((post, index) => (
            <div key={index}>
              {
                post.image && <img src={post.image} style={{width: 400}} alt={post.description} />
              }
              <p>{post.tags}</p>
            </div>
          ))
          :
          posts.map(post => (
            <div key={post.id || post.tags}>
              {
                post.image && <img src={post.image} style={{width: 400}} alt={post.description} />
              }
              <p>{post.tags}</p>
            </div>
          ))
        }
    </div>
  )
}

export default HomePage;