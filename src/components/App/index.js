const { Client } = require('@abcnews/poll-counters-client');
const { h, Component } = require('preact');
const ABCNewsNav = require('../ABCNewsNav');
const AspectRatioRegulator = require('../AspectRatioRegulator');
const About = require('../About');
const AboutNav = require('../AboutNav');
const BackNav = require('../BackNav');
const Curtain = require('../Curtain');
const Dropdown = require('../Dropdown');
const HUDFilter = require('../HUDFilter');
const Hints = require('../Hints');
const Loader = require('../Loader');
const RingNav = require('../RingNav');
const { Consumer, Provider } = require('../AppContext');
const Reader = require('../Reader');
const Stage = require('../Stage');
const styles = require('./styles.css').default;

const LOGGER = new Client(`hey-stranger_${String(window.location.hostname).split('.')[0]}`);
const NO_OP = () => {};

const increment = (question, answer) => LOGGER.increment({ question, answer }, NO_OP);

class App extends Component {
  constructor(props) {
    super(props);

    this.ending = this.ending.bind(this);
    this.explore = this.explore.bind(this);
    this.goTo = this.goTo.bind(this);
    this.reveal = this.reveal.bind(this);
    this.start = this.start.bind(this);

    this.swipeBegin = this.swipeBegin.bind(this);
    this.swipeContinue = this.swipeContinue.bind(this);
    this.swipeFinish = this.swipeFinish.bind(this);

    this.updateRing(props.scene);

    this.numActorsViewed = 0;
    this.uniqueActorsViewed = {};

    this.state = {
      current: null,
      hasExplored: false,
      hasRevealed: false,
      hasStarted: false,
      isInteractive: false,
      next: null,
      prev: null
    };
  }

  ending() {
    increment('num-actors-viewed', this.numActorsViewed || '0');

    if (this.numActorsViewed > 0) {
      increment('num-unique-actors-viewed', Object.keys(this.uniqueActorsViewed).length);
    }
  }

  explore() {
    this.setState({ hasExplored: true });
  }

  goTo(current) {
    let next = null;
    let prev = null;
    const ringIndex = this.ring.indexOf(current);

    if (ringIndex !== -1) {
      const ringLength = this.ring.length;

      next = this.ring[(ringLength + ringIndex + 1) % ringLength];
      prev = this.ring[(ringLength + ringIndex - 1) % ringLength];

      this.numActorsViewed++;
      this.uniqueActorsViewed[current.name] = true;

      if (this.numActorsViewed === 1) {
        increment('action', 'first-actor');
        increment('first-actor', current.name);
      }

      increment('actor', current.name);
    }

    this.setState({ current, hasExplored: false, hasRevealed: false, next, prev });

    if (this.props.scene && this.props.scene.aboutHTML === current) {
      increment('action', 'about');
    }
  }

  reveal() {
    this.setState({ hasRevealed: true });
  }

  start() {
    this.setState({ hasStarted: true });

    setTimeout(() => {
      this.setState({ isInteractive: true });
    }, 1500);

    increment('action', 'started');
  }

  swipeBegin(event) {
    if (this.swipe != null) {
      return;
    }

    const { clientX, clientY } = event.touches ? event.touches[0] : event;

    this.swipe = { x: clientX, y: clientY };
  }

  swipeContinue(event) {
    if (typeof event.scale !== 'undefined' && event.scale !== 1) {
      // Attempt to stop pinch-zoom
      return event.preventDefault();
    }

    if (this.swipe == null) {
      return;
    }

    const { clientX, clientY } = event.touches ? event.touches[0] : event;

    this.swipe.dX = clientX - this.swipe.x;
    this.swipe.dY = clientY - this.swipe.y;

    if (Math.abs(this.swipe.dX) > 40 || Math.abs(this.swipe.dY) > 20) {
      this.swipeFinish();
    }
  }

  swipeFinish() {
    if (this.swipe == null) {
      return;
    }

    const { dX } = this.swipe;

    this.swipe = null;

    if (dX == null || Math.abs(dX) <= 40) {
      return;
    }

    if (this.state.current === this.props.scene.aboutHTML) {
      this.goTo(null);
    } else if (dX < 0) {
      this.goTo(this.state.next);
    } else {
      this.goTo(this.state.prev);
    }
  }

  updateRing({ actors } = {}) {
    this.ring = actors ? [...actors] : [];
  }

  componentDidMount() {
    increment('action', 'rendered');
    window.addEventListener('beforeunload', this.ending);
  }

  componentDidUpdate() {
    this.updateRing(this.props.scene);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.ending);
  }

  render({ meta, scene }, { current, hasExplored, hasRevealed, hasStarted, isInteractive, next, prev }) {
    return (
      <Provider
        value={{
          current,
          hasExplored,
          hasRevealed,
          hasStarted,
          isCurrentAbout: scene && scene.aboutHTML === current,
          isCurrentActor: scene && scene.actors.indexOf(current) !== -1,
          isInteractive,
          meta,
          next,
          prev,
          scene,
          explore: this.explore,
          goTo: this.goTo,
          reveal: this.reveal,
          start: this.start
        }}
      >
        <main
          role="main"
          className={styles.root}
          onMouseDown={current ? this.swipeBegin : null}
          onTouchStart={current ? this.swipeBegin : null}
          onMouseMove={current ? this.swipeContinue : null}
          onTouchMove={current ? this.swipeContinue : null}
          onMouseUp={current ? this.swipeFinish : null}
          onTouchEnd={current ? this.swipeFinish : null}
          onMouseLeave={current ? this.swipeFinish : null}
          onTouchCancel={current ? this.swipeFinish : null}
        >
          <Loader />
          <Consumer>
            {({ meta, scene }) =>
              meta &&
              scene && (
                <AspectRatioRegulator min="4/9" max="3/2">
                  <Curtain />
                  <Reader />
                  <Stage />
                  <About />
                  <HUDFilter />
                  <Dropdown />
                  <BackNav />
                  <RingNav />
                  <AboutNav />
                  <ABCNewsNav />
                  <Hints />
                </AspectRatioRegulator>
              )
            }
          </Consumer>
        </main>
      </Provider>
    );
  }
}

module.exports = App;
