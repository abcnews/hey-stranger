const cn = require('classnames');
const { h, Component } = require('preact');
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

  render({ xPct, yPct, widthPct, depthIndex, src, isInFocus }) {
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
        <img ref={this.getImageRef} src={src} />
        <img className={styles.silhouette} src={src} />
      </div>
    );
  }
}

module.exports = Body;
