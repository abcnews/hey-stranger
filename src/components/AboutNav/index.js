const { h } = require('preact');
const Button = require('../Button');
const styles = require('./styles.css');

module.exports = ({ aboutHTML, isUnavailable, navigate }) => (
  <nav className={styles.root} aria-hidden={isUnavailable ? 'true' : 'false'}>
    <Button tabindex={isUnavailable ? -1 : 0} onClick={() => navigate(aboutHTML)}>
      About
    </Button>
  </nav>
);

module.exports.displayName = 'AboutNav';
