import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listImages } from './graphql/queries';
import { createImage as createImageMutation, deleteImage as deleteImageMutation } from './graphql/mutations';


const initialFormState = { tags: '', description: '' }

function App() {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const apiData = await API.graphql({ query: listImages });
    const imagesFromAPI = apiData.data.listImages.items;
    await Promise.all(imagesFromAPI.map(async image => {
      if (image.image) {
        const image = await Storage.get(image.image);
        image.image = image;
      }
      return image;
    }))
    setImages(apiData.data.listImages.items);
  }

  async function createImage() {
    if (!formData.tags || !formData.description) return;
    await API.graphql({ query: createImageMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setImages([ ...images, formData ]);
    setFormData(initialFormState);
  }

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.tags });
    await Storage.put(file.tags, file);
    fetchImages();
  }

  async function deleteImage({ id }) {
    const newImagesArray = images.filter(image => image.id !== id);
    setImages(newImagesArray);
    await API.graphql({ query: deleteImageMutation, variables: { input: { id } }});
  }

  return (
    <div classtags="App">
      <h1>My Images App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'tags': e.target.value})}
        placeholder="Image tags"
        value={formData.tags}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Image description"
        value={formData.description}
      />
      <input
        type="file"
        onChange={onChange}
      />
      <button onClick={createImage}>Create Image</button>
      <div style={{marginBottom: 30}}>
      {
        images.map(image => (
          <div key={image.id || image.tags}>
            <h2>{image.tags}</h2>
            <p>{image.description}</p>
            {
              image.image && <img src={image.image} style={{width: 400}} alt="imageimage" />
            }
            <button onClick={() => deleteImage(image)}>Delete image</button>
          </div>
        ))
      }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);