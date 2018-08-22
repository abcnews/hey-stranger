const { h } = require('preact');
const Richtext = require('../Richtext');
const { withContext } = require('../AppContext');
const styles = require('./styles.css');

const About = ({ isCurrentAbout, scene }) => {
  return (
    <div className={styles.root} aria-hidden={isCurrentAbout ? 'false' : 'true'}>
      <div className={styles.text}>
        <Richtext html={scene.aboutHTML.replace(/(<a )/g, isCurrentAbout ? '$1' : '$1tabindex="-1" ')} />
      </div>
    </div>
  );
};

About.displayName = 'About';

module.exports = withContext(About);
