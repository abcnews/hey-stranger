const { h, Component } = require('preact');
const { withContext } = require('../AppContext');
const Button = require('../Button');
const Meta = require('../Meta');
const styles = require('./styles.css');

const BUTTON_TEXT_OPTIONS = ['Show me the phones!', 'Let me see', 'Take a peek'];

class Curtain extends Component {
  constructor(props) {
    super(props);

    this.onTap = this.onTap.bind(this);

    this.startButtonText = BUTTON_TEXT_OPTIONS[Math.floor(Math.random() * BUTTON_TEXT_OPTIONS.length)];
  }
  componentDidMount() {
    this.props.increment('start-button-shown', this.startButtonText);
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

    this.props.increment('start-button-pressed', this.startButtonText);

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
          {this.startButtonText}
        </Button>
      </div>
    );
  }
}

module.exports = withContext(Curtain);
