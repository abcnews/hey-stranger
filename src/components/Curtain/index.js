const cn = require('classnames');
const { h, Component } = require('preact');
const styles = require('./styles.css');

class Curtain extends Component {
  render({ isRaised, children }) {
    return (
      <div
        className={cn(styles.root, {
          [styles.isRaised]: isRaised
        })}
        aria-hidden={isRaised ? '' : null}
      >
        {children}
      </div>
    );
  }
}

module.exports = Curtain;
