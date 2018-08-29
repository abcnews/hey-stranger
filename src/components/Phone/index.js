const { h } = require('preact');
const styles = require('./styles.css');

const Phone = ({ name, screen, image }) => (
  <div
    className={styles.root}
    style={{
      transform: `translate(${-screen.x}px, ${-screen.y}px)`
    }}
  >
    <img
      src={image.url}
      alt={image.description || `${name}'s screen`}
      draggable={0}
      style={{
        transformOrigin: `${screen.x}px ${screen.y}px`
      }}
    />
  </div>
);

Phone.displayName = 'Phone';

module.exports = Phone;
