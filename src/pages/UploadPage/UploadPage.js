import React from 'react';

const UploadPage = ({
  formData,
  setFormData,
  onChange,
  isUploading,
  uploadSuccess,
  uploadedPicture,
  createThenFetch,
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
      <button onClick={createThenFetch}>
        Create Post
      </button>
      <br></br>
        { isUploading ? <p>UPLOADING</p> : uploadSuccess && uploadedPicture ? uploadedPicture.image && <img src={uploadedPicture.image} style={{width: 400}} alt={uploadedPicture.description} /> : <p></p>}
    </div>
  )
}

export default UploadPage;
