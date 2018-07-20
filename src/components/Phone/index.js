const { h } = require('preact');
const styles = require('./styles.css');

module.exports = ({ image, center }) => (
  <div
    className={styles.root}
    style={{
      transform: `translate${-center}%, 0)`
    }}
  >
    <img src={image.url} />
  </div>
);

module.exports.displayName = 'Phone';
