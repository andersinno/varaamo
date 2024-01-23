import PropTypes from 'prop-types';
import React from 'react';

const LINEAR_GRADIENT = 'linear-gradient(rgba(0.25, 0.25, 0.25, 0.25), rgba(0.25, 0.25, 0.25, 0.25))';
function BackgroundImage({
  children, image, height, width, darken,
}) {
  const dimensions = height && width ? `dim=${width}x${height}` : '';
  const imageUrl = dimensions ? `${image.url}?${dimensions}` : image.url;

  let style = {};

  if (imageUrl) {
    const imageRef = `url(${imageUrl})`;
    style = { backgroundImage: darken ? `${LINEAR_GRADIENT},${imageRef}` : imageRef };
  }
  return (
    <div className="image-container" style={style}>
      {children}
    </div>
  );
}

BackgroundImage.propTypes = {
  children: PropTypes.node,
  image: PropTypes.shape({
    url: PropTypes.string,
  }).isRequired,
  darken: PropTypes.bool,
  height: PropTypes.number,
  width: PropTypes.number,
};

export default BackgroundImage;
