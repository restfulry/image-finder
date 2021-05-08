import React, { useState, useEffect } from 'react';
import { Switch, Route } from "react-router-dom";

import './App.css';

import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listPosts, getTags } from '../../graphql/queries';
import { createPost as createPostMutation, deletePost as deletePostMutation } from '../../graphql/mutations';

import HomePage from "../HomePage/HomePage";
import UploadPage from "../UploadPage/UploadPage";

const initialFormState = { tags: '', description: '' }

function App() {
  const [posts, setPosts] = useState([]);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  const [uploadedPicture, setUploadedPicture] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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
      setIsUploading(true);
      const image = await Storage.get(formData.image);
      formData.image = image;
      setIsUploading(false);
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
      <h1>Image Repo</h1>
      <Switch>
        <Route exact path="/" render={() => (
            <HomePage 
              searchQuery={searchQuery}
              searchTags={searchTags}
              searchedPosts={searchedPosts}
              posts={posts}
            
              setSearchQuery={setSearchQuery}

            />
          )}
          />
        <Route exact path="/upload" render={() => (
          <UploadPage 
            initialFormState={initialFormState} 
            formData={formData} 
            posts={posts} 
            setPosts={setPosts} 
            setFormData={setFormData} 
            createPost={createPost}
            onChange={onChange}
            isUploading={isUploading}
            />
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