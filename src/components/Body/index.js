const cn = require('classnames');
const { h, Component } = require('preact');
const styles = require('./styles.css').default;

class Body extends Component {
  constructor(props) {
    super(props);

    this.getImageRef = this.getImageRef.bind(this);
  }

  getImageRef(el) {
    this.image = el;
  }

  componentDidMount() {
    if (this.props.onImage) {
      this.props.onImage(this.image);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.isInFocus !== this.props.isInFocus;
  }

  render({ xPct, yPct, widthPct, depthIndex, src, alt, isInFocus }) {
    // Added a no-cache GET parameter to force a request to fix Chromium CORS error
    // Ref: https://www.hacksoft.io/blog/handle-images-cors-error-in-chrome
    // NOTE: No longer doing this. Using Content FTP instead on same domain
    // until Akamai cross-origin issue is resolved.
    // const noCacheSrc = src + '&no-cache=' + Date.now();

    return (
      <div
        className={cn(styles.root, {
          [styles.isInFocus]: isInFocus
        })}
        style={{
          transform: `translateZ(${depthIndex}px)`,
          left: `${xPct * 100}%`,
          top: `${yPct * 100}%`,
          width: `${widthPct * 100}%`
        }}
      >
        <img
          ref={this.getImageRef}
          src={src}
          alt={alt}
          crossOrigin="anonymous"
          draggable={0}
        />
        <img className={styles.silhouette} src={src} draggable={0} role="presentation" />
      </div>
    );
  }
}

module.exports = Body;
