const { h } = require('preact');
const Richtext = require('../Richtext');
const styles = require('./styles.css');

module.exports = ({ isUnavailable, html }) => (
  <div className={styles.root} aria-hidden={isUnavailable ? 'true' : 'false'}>
    <div className={styles.text}>
      <Richtext html={html} />
    </div>
  </div>
);

module.exports.displayName = 'About';
