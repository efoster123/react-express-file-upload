import './ImageGallery.css';

const ImageGallery = ({ images }) => {
  return (
    <section className="image-gallery">
      {images.map(image => {
        return (
          <figure className="image" key={image.id}>
            {/* For image src, we're pointing to API static folder */}
            <img
              src={`http://localhost:5050/${image.src}`}
              alt={image.description}
            />
            <h3>{image.title}</h3>
            <figcaption>{image.description}</figcaption>
            {image.tags?.length > 0 && (
              <p className="image-tags">{image.tags.join(', ')}</p>
            )}
          </figure>
        )
      })}
    </section>
    
  );
};

export default ImageGallery;