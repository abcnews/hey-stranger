const { h } = require('preact');
const styles = require('./styles.css');

module.exports = ({ direction, hasTail }) => {
  const isVertical = ['up', 'down'].includes(direction);
  const isFlipped = ['down', 'right'].includes(direction);

  const width = isVertical ? 13 : 8 + (hasTail ? 10 : 0);
  const height = isVertical ? 8 + (hasTail ? 10 : 0) : 13;

  return (
    <svg
      className={styles.root}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g transform={isFlipped ? `scale(${isVertical ? '1 -1' : '-1 1'})` : ''} transform-origin="50% 50%">
        <line
          x1={isVertical ? 6.5 : 1.5}
          y1={isVertical ? 1.5 : 6.5}
          x2={isVertical ? 1.5 : 6.5}
          y2={isVertical ? 6.5 : 1.5}
        />
        <line
          x1={isVertical ? 6.5 : 1.5}
          y1={isVertical ? 1.5 : 6.5}
          x2={isVertical ? 11.5 : 6.5}
          y2={isVertical ? 6.5 : 11.5}
        />
        {hasTail && (
          <line
            x1={isVertical ? 6.5 : 2.5}
            y1={isVertical ? 2.5 : 6.5}
            x2={isVertical ? 6.5 : 18}
            y2={isVertical ? 18 : 6.5}
          />
        )}
      </g>
    </svg>
  );
};

module.exports.displayName = 'Arrow';
