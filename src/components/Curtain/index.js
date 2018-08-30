const { h, Component } = require('preact');
const { withContext } = require('../AppContext');
const Button = require('../Button');
const Meta = require('../Meta');
const styles = require('./styles.css');

const BUTTON_TEXT_OPTIONS = ['Start', 'Show me the phones!', 'Let me see', 'Take a peek'];

class Curtain extends Component {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);

    this.startButtonText = BUTTON_TEXT_OPTIONS[Math.floor(Math.random() * BUTTON_TEXT_OPTIONS.length)];
  }
  componentDidMount() {
    this.props.increment('start-button-shown', this.startButtonText);
  }

  start() {
    this.props.increment('start-button-pressed', this.startButtonText);

    this.props.start();
  }

  render({ hasStarted }) {
    return (
      <div
        className={styles.root}
        aria-hidden={hasStarted ? 'true' : 'false'}
        onMouseDown={this.start}
        onTouchStart={this.start}
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
