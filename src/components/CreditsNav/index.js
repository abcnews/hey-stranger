const { h } = require('preact');
const Button = require('../Button');
const styles = require('./styles.css');

module.exports = ({ creditsHTML, isUnavailable, navigate }) => (
  <nav className={styles.root} aria-hidden={isUnavailable ? 'true' : 'false'}>
    <Button transparent tabindex={isUnavailable ? -1 : 0} onClick={() => navigate(creditsHTML)}>
      Credits
    </Button>
  </nav>
);

module.exports.displayName = 'CreditsNav';
