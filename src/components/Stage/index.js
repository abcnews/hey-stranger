const cn = require('classnames');
const { h } = require('preact');
const styles = require('./styles.css');

module.exports = ({ hasFocus, isUnveiled, children }) => (
  <div
    className={cn(styles.root, {
      [styles.hasFocus]: hasFocus,
      [styles.isUnveiled]: isUnveiled
    })}
    aria-hidden={isUnveiled ? '' : null}
  >
    {children}
  </div>
);

module.exports.displayName = 'Stage';
