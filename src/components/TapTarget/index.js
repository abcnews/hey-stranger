const { h } = require('preact');
const styles = require('./styles.css').default;

const TapTarget = () => {
  return (
    <svg className={styles.root} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="19" opacity=".33" />
      <circle cx="20" cy="20" r="12.333" opacity=".66" />
      <circle cx="20" cy="20" r="5.667" />
    </svg>
  );
};

TapTarget.displayName = 'TapTarget';

module.exports = TapTarget;
