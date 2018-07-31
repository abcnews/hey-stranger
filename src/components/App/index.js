const { h, Component } = require('preact');
const ABCNewsNav = require('../ABCNewsNav');
const AspectRatioRegulator = require('../AspectRatioRegulator');
const AudioPlayer = require('../AudioPlayer');
const Button = require('../Button');
const Curtain = require('../Curtain');
const Dropdown = require('../Dropdown');
const Loader = require('../Loader');
const InfiniteNav = require('../InfiniteNav');
const Meta = require('../Meta');
const Reader = require('../Reader');
const Scene = require('../Scene');
const Stage = require('../Stage');
const styles = require('./styles.css');

class App extends Component {
  constructor(props) {
    super(props);

    this.navigate = this.navigate.bind(this);
    this.saveAudioRef = this.saveAudioRef.bind(this);
    this.start = this.start.bind(this);

    this.state = {
      current: null,
      prev: null,
      next: null,
      hasStarted: false,
      isInteractive: false
    };
  }

  navigate(target) {
    const { actors } = this.props.scene;
    const current = target;
    const currentIndex = actors.indexOf(current);
    let prev = null;
    let next = null;

    if (currentIndex !== -1) {
      prev = actors[(actors.length + currentIndex - 1) % actors.length];
      next = actors[(actors.length + currentIndex + 1) % actors.length];
    }

    this.setState({ current, prev, next });
  }

  saveAudioRef(el) {
    this.audio = el;
  }

  start() {
    this.setState({ hasStarted: true });

    if (this.audio) {
      this.audio.play();
    }
    setTimeout(() => {
      this.setState({ isInteractive: true });
    }, 1500);
  }

  render({ meta, scene }, { current, prev, next, hasStarted, isInteractive }) {
    const actor = scene && scene.actors.indexOf(current) !== -1 ? current : null;

    return (
      <main role="main" className={styles.root}>
        <Loader />
        {meta &&
          scene && (
            <AspectRatioRegulator min="4/9" max="3/2">
              <Curtain isRaised={hasStarted}>
                <Meta isUnavailable={hasStarted} {...meta} />
                <Button primary tabindex={hasStarted ? -1 : 0} onClick={this.start}>
                  Start
                </Button>
              </Curtain>
              <Reader focused={actor} navigate={this.navigate} />
              <Stage hasFocus={!!actor} isUnveiled={hasStarted}>
                <Scene isInteractive={isInteractive} focused={actor} navigate={this.navigate} {...scene} />
              </Stage>
              <Dropdown actors={scene.actors} current={current} isUnavailable={!hasStarted} navigate={this.navigate} />
              <ABCNewsNav isUnavailable={!!current} />
              <InfiniteNav prev={prev} next={next} isUnavailable={!actor} navigate={this.navigate} />
              <AudioPlayer audio={scene.audio} isUnavailable={!hasStarted} onAudio={this.saveAudioRef} />
            </AspectRatioRegulator>
          )}
      </main>
    );
  }
}

module.exports = App;
