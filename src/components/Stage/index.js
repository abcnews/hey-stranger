const cn = require('classnames');
const { h } = require('preact');
const { withContext } = require('../AppContext');
const Scene = require('../Scene');
const styles = require('./styles.css').default;

const Stage = ({ hasStarted, isCurrentActor }) => (
  <div
    className={cn(styles.root, {
      [styles.hasFocus]: isCurrentActor
    })}
    aria-hidden={hasStarted ? 'false' : 'true'}
  >
    <Scene />
  </div>
);

Stage.displayName = 'Stage';

module.exports = withContext(Stage);
