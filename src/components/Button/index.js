const cn = require('classnames');
const { h } = require('preact');
const styles = require('./styles.css');

module.exports = ({ primary, children, className, ...props }) => (
  <button
    className={cn(
      styles.root,
      {
        [styles.isPrimary]: primary
      },
      className
    )}
    {...props}
  >
    {children}
  </button>
);

module.exports.displayName = 'Button';
