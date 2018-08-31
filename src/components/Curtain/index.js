const { h, Component } = require('preact');
const { withContext } = require('../AppContext');
const Button = require('../Button');
const Meta = require('../Meta');
const styles = require('./styles.css');

class Curtain extends Component {
  constructor(props) {
    super(props);

    this.onTap = this.onTap.bind(this);
  }

  onTap(event) {
    var node = (function traverse(node) {
      if (node == null) {
        return;
      }

      if (!node.tagName || node.tagName !== 'A') {
        return traverse(node.parentNode);
      }

      return node;
    })(event.target);

    if (node != null) {
      return;
    }

    this.props.start();
  }

  render({ hasStarted }) {
    return (
      <div
        className={styles.root}
        aria-hidden={hasStarted ? 'true' : 'false'}
        onMouseDown={this.onTap}
        onTouchStart={this.onTap}
      >
        <Meta />
        <Button primary tabindex={hasStarted ? -1 : 0}>
          Let me see
        </Button>
      </div>
    );
  }
}

module.exports = withContext(Curtain);
