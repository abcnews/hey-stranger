const { h } = require('preact');
const { withContext } = require('../AppContext');
const Button = require('../Button');
const Meta = require('../Meta');
const styles = require('./styles.css');

const Curtain = ({ hasStarted, start }) => (
  <div className={styles.root} aria-hidden={hasStarted ? 'true' : 'false'}>
    <Meta />
    <Button primary tabindex={hasStarted ? -1 : 0} onClick={start}>
      Start
    </Button>
  </div>
);

Curtain.displayName = 'Curtain';

module.exports = withContext(Curtain);
