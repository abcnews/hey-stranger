const { h } = require('preact');
const styles = require('./styles.css');

module.exports = ({ isUnavailable, children }) => (
  <div className={styles.root} aria-hidden={isUnavailable ? 'true' : 'false'}>
    {children}
  </div>
);

module.exports.displayName = 'Curtain';
