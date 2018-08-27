const { h } = require('preact');
const Arrow = require('../Arrow');
const Button = require('../Button');
const { withContext } = require('../AppContext');
const styles = require('./styles.css');

const BackNav = ({ current, goTo }) => (
  <nav className={styles.root} aria-hidden={current ? 'false' : 'true'}>
    <Button tabindex={current ? 0 : -1} onClick={() => goTo(null)}>
      <Arrow direction="left" />
      <span>Back</span>
    </Button>
  </nav>
);

BackNav.displayName = 'BackNav';

module.exports = withContext(BackNav);
