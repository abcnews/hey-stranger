const { h } = require('preact');
const Arrow = require('../Arrow');
const Button = require('../Button');
const { withContext } = require('../AppContext');
const styles = require('./styles.css');

const RingNav = ({ isCurrentActor, next, prev, goTo }) => (
  <nav className={styles.root} aria-hidden={isCurrentActor ? 'false' : 'true'}>
    <Button tabindex={isCurrentActor ? 0 : -1} aria-controls="reader-stories" onClick={() => goTo(prev)}>
      <Arrow direction="left" hasTail />
      <span>{prev ? prev.name : ''}</span>
    </Button>
    <Button tabindex={isCurrentActor ? 0 : -1} aria-controls="reader-stories" onClick={() => goTo(next)}>
      <span>{next ? next.name : ''}</span>
      <Arrow direction="right" hasTail />
    </Button>
  </nav>
);

RingNav.displayName = 'RingNav';

module.exports = withContext(RingNav);
