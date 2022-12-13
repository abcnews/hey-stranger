const cn = require('classnames');
const { h, Component } = require('preact');
const styles = require('./styles.css').default;

const IS_MOBILE_DEVICE = typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;

class AspectRatioRegulator extends Component {
  constructor(props) {
    super(props);

    this.inferState = this.inferState.bind(this);
    this.update = this.update.bind(this);

    if (IS_MOBILE_DEVICE && this.props.max) {
      this.maxMQL = window.matchMedia(`(max-height: 150mm) and (min-aspect-ratio: ${this.props.max})`);
      this.maxMQL.addListener(this.update);
    }

    if (IS_MOBILE_DEVICE && this.props.min) {
      this.minMQL = window.matchMedia(`(max-width: 150mm) and (max-aspect-ratio: ${this.props.min})`);
      this.minMQL.addListener(this.update);
    }

    this.state = this.inferState();
  }

  inferState() {
    return {
      isCounterClockwise: window.orientation === -90,
      isMaxInvalid: this.maxMQL && this.maxMQL.matches,
      isMinInvalid: this.minMQL && this.minMQL.matches
    };
  }

  update() {
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => {
      this.setState(this.inferState);
    }, 0);
  }

  render() {
    const { children } = this.props;
    const { isCounterClockwise, isMaxInvalid, isMinInvalid } = this.state;
    const isInvalid = isMaxInvalid || isMinInvalid;

    return (
      <div
        className={cn(styles.root, {
          [styles.counterClockwise]: isCounterClockwise,
          [styles.invalid]: isInvalid,
          [styles.maxInvalid]: isMaxInvalid,
          [styles.minInvalid]: isMinInvalid
        })}
      >
        <div className={styles.children}>{children}</div>
        <div
          className={styles.hint}
          role="alert"
          aria-label={
            isInvalid
              ? `Your aspect ratio is too ${isMinInvalid ? 'narrow' : 'wide'}. Please rotate your device.`
              : null
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
            <path
              className={styles.device}
              d="M30 13h36a2 2 0 0 1 2 2v66a2 2 0 0 1-2 2H30a2 2 0 0 1-2-2V15a2 2 0 0 1 2-2zm2 5v53h32V18H32z"
            />
            <path
              className={styles.tick}
              d="M43.822 52.058l-5.509-5.57-2.813 3.027 8.322 7.929L60.5 41.05 57.725 38z"
            />
            <path
              className={styles.cross}
              d="M48 45.074L55.074 38 58 40.926 50.926 48 58 55.074 55.074 58 48 50.926 40.926 58 38 55.074 45.074 48 38 40.926 40.926 38 48 45.074z"
            />
          </svg>
        </div>
      </div>
    );
  }
}

module.exports = AspectRatioRegulator;
