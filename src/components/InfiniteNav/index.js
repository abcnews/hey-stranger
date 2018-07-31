const cn = require('classnames');
const { h, Component } = require('preact');
const Arrow = require('../Arrow');
const Button = require('../Button');
const styles = require('./styles.css');

class InfiniteNav extends Component {
  constructor(props) {
    super(props);

    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
  }

  prev() {
    if (this.props.navigate && this.props.prev) {
      this.props.navigate(this.props.prev);
    }
  }

  next() {
    if (this.props.navigate && this.props.next) {
      this.props.navigate(this.props.next);
    }
  }

  render({ isUnavailable }) {
    return (
      <nav
        className={cn(styles.root, {
          [styles.isUnavailable]: isUnavailable
        })}
        aria-hidden={isUnavailable ? '' : null}
      >
        <Button tabindex={isUnavailable ? -1 : 0} aria-controls="reader-stories" onClick={this.prev}>
          <Arrow direction="left" hasTail />
          <span>Previous</span>
        </Button>
        <Button tabindex={isUnavailable ? -1 : 0} aria-controls="reader-stories" onClick={this.next}>
          <span>Next</span>
          <Arrow direction="right" hasTail />
        </Button>
      </nav>
    );
  }
}

module.exports = InfiniteNav;
