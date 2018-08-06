const { h } = require('preact');
const BackNav = require('../BackNav');
const Richtext = require('../Richtext');
const styles = require('./styles.css');

module.exports = ({ isUnavailable, html, navigate }) => (
  <div className={styles.root} aria-hidden={isUnavailable ? 'true' : 'false'}>
    <div className={styles.text}>
      <Richtext html={`<h2>Credits</h2>${html}`} />
    </div>
    {navigate && <BackNav isUnavailable={isUnavailable} navigate={navigate} />}
  </div>
);

module.exports.displayName = 'Credits';
