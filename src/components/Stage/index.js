const cn = require('classnames');
const { h } = require('preact');
const styles = require('./styles.css');

module.exports = ({ hasFocus, isUnavailable, children }) => (
  <div
    className={cn(styles.root, {
      [styles.hasFocus]: hasFocus
    })}
    aria-hidden={isUnavailable ? 'true' : 'false'}
  >
    {children}
  </div>
);

module.exports.displayName = 'Stage';
