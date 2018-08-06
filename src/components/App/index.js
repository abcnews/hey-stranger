const { h, Component } = require('preact');
const ABCNewsNav = require('../ABCNewsNav');
const AspectRatioRegulator = require('../AspectRatioRegulator');
const AudioPlayer = require('../AudioPlayer');
const Button = require('../Button');
const Credits = require('../Credits');
const CreditsNav = require('../CreditsNav');
const Curtain = require('../Curtain');
const Dropdown = require('../Dropdown');
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
    this.saveAudioRef = this.saveAudioRef.bind(this);
    this.start = this.start.bind(this);

    this.updateRing(props.scene);

    this.state = {
      current: null,
      prev: null,
      next: null,
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

  updateRing({ actors, creditsHTML } = {}) {
    this.ring = actors ? [...actors] : [];

    if (creditsHTML) {
      this.ring.push(creditsHTML);
    }
  }

  componentDidUpdate() {
    this.updateRing(this.props.scene);
  }

  render({ meta, scene }, { current, prev, next, hasStarted, isInteractive }) {
    const currentActor = scene && scene.actors.indexOf(current) !== -1 ? current : null;
    const currentCreditsHTML = scene && scene.creditsHTML === current ? current : null;

    return (
      <main role="main" className={styles.root}>
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
              <Reader focused={currentActor} navigate={this.navigate} />
              <Stage hasFocus={!!currentActor} isUnavailable={!hasStarted}>
                <Scene isUnavailable={!isInteractive} focused={currentActor} navigate={this.navigate} {...scene} />
              </Stage>
              <Credits html={scene.creditsHTML} isUnavailable={!currentCreditsHTML} navigate={this.navigate} />
              <Dropdown
                actors={scene.actors}
                current={currentActor}
                isUnavailable={!hasStarted}
                navigate={this.navigate}
              />
              <RingNav prev={prev} next={next} isUnavailable={!currentActor} navigate={this.navigate} />
              <CreditsNav
                creditsHTML={scene.creditsHTML}
                isUnavailable={!hasStarted || currentCreditsHTML}
                navigate={this.navigate}
              />
              <AudioPlayer audio={scene.audio} isUnavailable={!hasStarted} onAudio={this.saveAudioRef} />
              <ABCNewsNav isUnavailable={current} />
            </AspectRatioRegulator>
          )}
      </main>
    );
  }
}

module.exports = App;
