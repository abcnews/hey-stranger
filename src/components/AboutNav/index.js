const { h } = require('preact');
const Button = require('../Button');
const { withContext } = require('../AppContext');
const styles = require('./styles.css');

const AboutNav = ({ hasStarted, current, scene, goTo }) => (
  <nav className={styles.root} aria-hidden={!hasStarted || current ? 'true' : 'false'}>
    <Button tabindex={!hasStarted || current ? -1 : 0} onClick={() => goTo(scene.aboutHTML)}>
      About
    </Button>
  </nav>
);

AboutNav.displayName = 'AboutNav';

module.exports = withContext(AboutNav);
