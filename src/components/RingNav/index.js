const { h } = require('preact');
const Arrow = require('../Arrow');
const Button = require('../Button');
const { withContext } = require('../AppContext');
const styles = require('./styles.css').default;

let formerNames = null;

const RingNav = ({ isCurrentActor, next, prev, goTo }) => {
  if (prev && next) {
    formerNames = [prev.name, next.name];
  }

  return (
    <nav className={styles.root} aria-hidden={isCurrentActor ? 'false' : 'true'}>
      <Button tabindex={isCurrentActor ? 0 : -1} aria-controls="reader-stories" onClick={() => goTo(prev)}>
        <Arrow direction="left" hasTail />
        <span>{prev ? prev.name : formerNames ? formerNames[0] : ''}</span>
      </Button>
      <Button tabindex={isCurrentActor ? 0 : -1} aria-controls="reader-stories" onClick={() => goTo(next)}>
        <span>{next ? next.name : formerNames ? formerNames[1] : ''}</span>
        <Arrow direction="right" hasTail />
      </Button>
    </nav>
  );
};

RingNav.displayName = 'RingNav';

module.exports = withContext(RingNav);
