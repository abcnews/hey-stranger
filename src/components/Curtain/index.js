const { h, Component } = require('preact');
const styles = require('./styles.css');

class Curtain extends Component {
  render({ isUnavailable, children }) {
    return (
      <div className={styles.root} aria-hidden={isUnavailable ? 'true' : 'false'}>
        {children}
      </div>
    );
  }
}

module.exports = Curtain;
