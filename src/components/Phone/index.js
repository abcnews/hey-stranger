const { h } = require('preact');
const styles = require('./styles.css');

module.exports = ({ image, screen }) => (
  <div
    className={styles.root}
    style={{
      transform: `translate(${-screen.x}px, ${-screen.y}px)`
    }}
  >
    <img
      src={image.url}
      style={{
        transformOrigin: `${screen.x}px ${screen.y}px`
      }}
    />
  </div>
);

module.exports.displayName = 'Phone';
