const cn = require('classnames');
const { h, Component } = require('preact');
const Arrow = require('../Arrow');
const Button = require('../Button');
const styles = require('./styles.css');

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
        <img ref={this.getImageRef} src={src} alt={alt} draggable="false" />
        <img className={styles.silhouette} src={src} role="presentation" />
      </div>
    );
  }
}

module.exports = Body;
