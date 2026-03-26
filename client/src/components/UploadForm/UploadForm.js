import { useState } from 'react';
import axios from 'axios';
import './UploadForm.css';

const UploadForm = ({ fetchImages }) => {
  // State for keeping track of upload happening, helpful for disabling the button when submitting the form
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e) => {
    // Prevent page reload
    e.preventDefault();

    // We need to gather all the data in FormData, not just a regular object
    const formData = new FormData();

    // Getting values from the text fields inputs
    formData.append('imageTitle', e.target.imageTitle.value);
    formData.append('imageDescription', e.target.imageDescription.value);
    formData.append('imageTags', e.target.imageTags.value);

    // Getting a value from the file input
    formData.append('imageFile', e.target.imageFile.files[0]);

    // Disable the upload button while we are in process of uploading
    setIsUploading(true);

    // Make a POST request with the FormData, need to include multipart/form-data as a header to send the file data
    axios
      .post('http://localhost:5050/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        // Enable the upload button
        setIsUploading(false);
        
        // Refetch the images
        fetchImages();

        // Reset the form values
        e.target.reset();
      })
      .catch((err) => {
        console.log('Error:', err);
        setIsUploading(false);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
        <div className="input-element">
          <label className="input-element__label">
            Image Title
          </label>
          <input
            className="input-element__field"
            name="imageTitle"
            type="text"
            required
          />
        </div>
        <div className="input-element">
          <label className="input-element__label">
            Image Description
          </label>
          <textarea name="imageDescription" required></textarea>
        </div>
        <div className="input-element">
          <label className="input-element__label">
            Tags <span style={{ fontWeight: 'normal', fontSize: '0.85em' }}>(comma-separated)</span>
          </label>
          <input
            className="input-element__field"
            name="imageTags"
            type="text"
            placeholder="e.g. portrait, outdoor"
          />
        </div>
        <div className="input-element">
          <label className="input-element__label">
            Image File
          </label>
          <input
            className="input-element__field"
            name="imageFile"
            type="file"
            required
          />
        </div>
        {/* The button is disabled while we're uploading */}
        <button disabled={isUploading}>
          Upload Image
        </button>
      </form>
  )
}

export default UploadForm;