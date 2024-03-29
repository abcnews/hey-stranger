const cn = require('classnames');
const { h, Component } = require('preact');
const styles = require('./styles.css').default;
const { getCanvasImageUrl } = require('../../utils');

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
          src={getCanvasImageUrl(src)}
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
