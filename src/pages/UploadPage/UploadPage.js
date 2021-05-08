import React from 'react';

import { API, Storage } from 'aws-amplify';
import { createPost as createPostMutation} from '../../graphql/mutations';

const UploadPage = ({
  initialFormState,
  formData,
  posts,
  setPosts,
  setFormData,
  onChange,
}) => {

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

  return (
    <div>
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
    </div>
  )
}

export default UploadPage;
