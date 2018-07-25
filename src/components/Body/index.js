const cn = require('classnames');
const { h } = require('preact');
const styles = require('./styles.css');

module.exports = ({ xPct, yPct, widthPct, depthIndex, src, isInFocus, onLoadImage }) => (
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
    <img src={src} onLoad={onLoadImage} />
    <img className={styles.silhouette} src={src} />
  </div>
);

module.exports.displayName = 'Body';
