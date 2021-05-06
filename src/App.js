import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listPosts, getTags } from './graphql/queries';
import { createPost as createPostMutation, deletePost as deletePostMutation } from './graphql/mutations';

const initialFormState = { tags: '', description: '' }

function App() {
  const [posts, setPosts] = useState([]);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const apiData = await API.graphql({ query: listPosts });
    const postsFromAPI = apiData.data.listPosts.items;
    await Promise.all(postsFromAPI.map(async post => {
      if (post.image) {
        const image = await Storage.get(post.image);
        post.image = image;
      }
      return post;
    }))
    setPosts(apiData.data.listPosts.items);
  }

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchPosts();
  }

  async function createPost() {
    if (!formData.tags || !formData.description) return;
    await API.graphql({ query: createPostMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setPosts([ ...posts, formData ]);
    setFormData(initialFormState);
  }

  async function deletePost({ id }) {
    const newPostsArray = posts.filter(post => post.id !== id);
    setPosts(newPostsArray);
    await API.graphql({ query: deletePostMutation, variables: { input: { id } }});
  }

  async function searchTags() {
    const apiData = await API.graphql({ 
      query: getTags, 
      variables: {
          searchQuery
      },
    });

    const postsFromAPI = apiData.data.listPosts.items;

    await Promise.all(postsFromAPI.map(async post => {
      if (post.image) {
        const image = await Storage.get(post.image);
        post.image = image;
        console.log(image, "IMAGE FOUND")
      }
      return post;
    }));

    setSearchedPosts(apiData.data.listPosts.items);
  };

  return (
    <div className="App">
      <h1>My Posts App</h1>
      <input
        onChange={e => {console.log(e.target.value); setSearchQuery(e.target.value)}}
        placeholder="Search"
        value={searchQuery}
      />
      <button onClick={searchTags}>Search</button>
        {
          searchedPosts.map((post, index) => (
            <div key={index}>
              {
                post.image && <img src={post.image} style={{width: 400}} alt={post.description} />
              }
              <p>{post.description}</p>
            </div>
          ))
        }
        <br></br>
      <input
        onChange={e => setFormData({ ...formData, 'tags': e.target.value})}
        placeholder="Post tags"
        value={formData.tags}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Post description"
        value={formData.description}
      />
      <input
        type="file"
        onChange={onChange}
      />
      <button onClick={createPost}>Create Post</button>
      <div style={{marginBottom: 30}}>
      {
        posts.map(post => (
          <div key={post.id || post.tags}>
            <h2>{post.tags}</h2>
            <p>{post.description}</p>
            <button onClick={() => deletePost(post)}>Delete post</button>
            {
              post.image && <img src={post.image} style={{width: 400}} alt={post.description} />
            }
          </div>
        ))
      }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);