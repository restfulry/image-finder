import React, { useState, useEffect } from 'react';
import { Switch, Route, Router } from "react-router-dom";

import './App.css';

import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listPosts, getTags } from '../../graphql/queries';
import { createPost as createPostMutation, deletePost as deletePostMutation } from '../../graphql/mutations';

import UploadPage from "../UploadPage/UploadPage";

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
      <h1>Image Repo</h1>
      <Switch>
        <Route exact path="/" render={() => (
            <>
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
              </>
          )}
          />
        <Route exact path="/upload" render={() => (
          <UploadPage 
            initialFormState={initialFormState} 
            formData={formData} 
            posts={posts} 
            setPosts={setPosts} 
            setFormData={setFormData} 
            onChange={onChange}/>
        )}/>
        
        <Route exact path="/delete" render={() => (
                <div style={{marginBottom: 30}}>
                {
                  posts.map(post => (
                    <div key={post.id || post.tags}>
                      {
                        post.image && <img src={post.image} style={{width: 400}} alt={post.description} />
                      }
                      <p>{post.tags}</p>
                      <button onClick={() => deletePost(post)}>Delete post</button>
                    </div>
                  ))
                }
                </div>
        )}/>

      </Switch>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);