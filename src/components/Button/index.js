const cn = require('classnames');
const { h } = require('preact');
const styles = require('./styles.css').default;

const Button = ({ primary, children, className, ...props }) => (
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

Button.displayName = 'Button';

module.exports = Button;
