const { h } = require('preact');
const Arrow = require('../Arrow');
const Button = require('../Button');
const styles = require('./styles.css');

module.exports = ({ prev, next, isUnavailable, navigate }) => (
  <nav className={styles.root} aria-hidden={isUnavailable ? 'true' : 'false'}>
    <Button tabindex={isUnavailable ? -1 : 0} aria-controls="reader-stories" onClick={() => navigate(prev)}>
      <Arrow direction="left" hasTail />
      <span>Previous</span>
    </Button>
    <Button tabindex={isUnavailable ? -1 : 0} aria-controls="reader-stories" onClick={() => navigate(next)}>
      <span>Next</span>
      <Arrow direction="right" hasTail />
    </Button>
  </nav>
);

module.exports.displayName = 'RingNav';
