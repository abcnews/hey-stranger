const { h } = require('preact');
const Arrow = require('../Arrow');
const Button = require('../Button');
const styles = require('./styles.css');

module.exports = ({ isUnavailable, navigate }) => (
  <nav className={styles.root}>
    <Button tabindex={isUnavailable ? -1 : 0} onClick={() => navigate(null)}>
      <Arrow direction="left" />
      <span>Back</span>
    </Button>
  </nav>
);

module.exports.displayName = 'BackNav';
