const { h, Component } = require('preact');
const ABCNewsNav = require('../ABCNewsNav');
const AspectRatioRegulator = require('../AspectRatioRegulator');
const Button = require('../Button');
const About = require('../About');
const AboutNav = require('../AboutNav');
const BackNav = require('../BackNav');
const Curtain = require('../Curtain');
const Dropdown = require('../Dropdown');
const HUDFilter = require('../HUDFilter');
const Hints = require('../Hints');
const Loader = require('../Loader');
const RingNav = require('../RingNav');
const Meta = require('../Meta');
const Reader = require('../Reader');
const Scene = require('../Scene');
const Stage = require('../Stage');
const styles = require('./styles.css');

class App extends Component {
  constructor(props) {
    super(props);

    this.navigate = this.navigate.bind(this);
    this.onExplore = this.onExplore.bind(this);
    this.onReveal = this.onReveal.bind(this);
    this.swipeBegin = this.swipeBegin.bind(this);
    this.swipeContinue = this.swipeContinue.bind(this);
    this.swipeFinish = this.swipeFinish.bind(this);
    this.start = this.start.bind(this);

    this.updateRing(props.scene);

    this.navigationCount = 0;

    this.state = {
      current: null,
      prev: null,
      next: null,
      hasExplored: false,
      hasRevealed: false,
      hasStarted: false,
      isInteractive: false
    };
  }

  navigate(target) {
    const current = target;
    const ringLength = this.ring.length;
    const ringIndex = this.ring.indexOf(current);
    let prev = null;
    let next = null;

    if (ringIndex !== -1) {
      prev = this.ring[(ringLength + ringIndex - 1) % ringLength];
      next = this.ring[(ringLength + ringIndex + 1) % ringLength];
    }

    this.setState({ current, prev, next, hasExplored: false, hasRevealed: false });
  }

  onExplore() {
    this.setState({ hasExplored: true });
  }

  onReveal() {
    this.setState({ hasRevealed: true });
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
      this.navigate(null);
    } else if (this.state.next && dX < 0) {
      this.navigate(this.state.next);
    } else if (this.state.prev) {
      this.navigate(this.state.prev);
    }
  }

  start() {
    this.setState({ hasStarted: true });

    setTimeout(() => {
      this.setState({ isInteractive: true });
    }, 1500);
  }

  updateRing({ actors } = {}) {
    this.ring = actors ? [...actors] : [];
  }

  componentDidUpdate() {
    this.updateRing(this.props.scene);
  }

  render({ meta, scene }, { current, prev, next, hasExplored, hasRevealed, hasStarted, isInteractive }) {
    const currentActor = scene && scene.actors.indexOf(current) !== -1 ? current : null;
    const currentAboutHTML = scene && scene.aboutHTML === current ? current : null;

    return (
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
        {meta &&
          scene && (
            <AspectRatioRegulator min="4/9" max="3/2">
              <Curtain isUnavailable={hasStarted}>
                <Meta isUnavailable={hasStarted} {...meta} />
                <Button primary tabindex={hasStarted ? -1 : 0} onClick={this.start}>
                  Start
                </Button>
              </Curtain>
              <Reader focused={currentActor} onReveal={this.onReveal} />
              <Stage hasFocus={!!currentActor} isUnavailable={!hasStarted}>
                <Scene
                  isUnavailable={!isInteractive}
                  focused={currentActor}
                  navigate={this.navigate}
                  onExplore={this.onExplore}
                  {...scene}
                />
              </Stage>
              <About
                html={scene.aboutHTML.replace(/(<a )/g, !currentAboutHTML ? '$1tabindex="-1" ' : '$1')}
                isUnavailable={!currentAboutHTML}
              />
              <HUDFilter />
              <Dropdown
                actors={scene.actors}
                current={currentActor}
                isUnavailable={!hasStarted}
                navigate={this.navigate}
              />
              <BackNav isUnavailable={!current} navigate={this.navigate} />
              <RingNav prev={prev} next={next} isUnavailable={!currentActor} navigate={this.navigate} />
              <AboutNav aboutHTML={scene.aboutHTML} isUnavailable={!hasStarted || current} navigate={this.navigate} />
              <ABCNewsNav isUnavailable={current} />
              <Hints
                initialExplore={isInteractive && !current && !hasExplored}
                initialChoice={isInteractive && !current}
                revealScreen={isInteractive && currentActor && !hasRevealed}
                othersExplore={isInteractive && currentActor && hasRevealed}
              />
            </AspectRatioRegulator>
          )}
      </main>
    );
  }
}

module.exports = App;
