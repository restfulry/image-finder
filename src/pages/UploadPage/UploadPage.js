import React from 'react';

const UploadPage = ({
  formData,
  setFormData,
  onChange,
  createPost,
  isUploading,
}) => {

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
      { isUploading ? <p>UPLOADING</p> : <p>Uploaded!</p>}
    </div>
  )
}

export default UploadPage;
