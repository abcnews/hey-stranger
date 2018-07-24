const { h, Component } = require('preact');
const ABCNewsNav = require('../ABCNewsNav');
const AspectRatioRegulator = require('../AspectRatioRegulator');
const Button = require('../Button');
const Curtain = require('../Curtain');
const Loader = require('../Loader');
const Meta = require('../Meta');
const Scene = require('../Scene');
const Stage = require('../Stage');
const styles = require('./styles.css');

class App extends Component {
  constructor(props) {
    super(props);

    this.changeFocus = this.changeFocus.bind(this);
    this.start = this.start.bind(this);

    this.state = {
      focused: null,
      hasStarted: false,
      isInteractive: false
    };
  }

  changeFocus(focused) {
    this.setState({ focused });
  }

  start() {
    this.setState({ hasStarted: true });
    setTimeout(() => {
      this.setState({ isInteractive: true });
    }, 1500);
  }

  render({ meta, scene }, { focused, hasStarted, isInteractive }) {
    return (
      <main role="main" className={styles.root}>
        <Loader />
        {meta &&
          scene && (
            <AspectRatioRegulator min="4/9" max="3/2">
              <Curtain isRaised={hasStarted}>
                <Meta {...meta} />
                <Button primary onClick={this.start}>
                  Start
                </Button>
              </Curtain>
              <div style={{ position: 'absolute', top: 0, left: 0 }}>
                {focused && <img src={focused.phone.image.url} />}
              </div>
              <Stage isUnveiled={hasStarted}>
                <Scene isInteractive={isInteractive} focused={focused} changeFocus={this.changeFocus} {...scene} />
              </Stage>
              <ABCNewsNav isUnavailable={!!focused} />
            </AspectRatioRegulator>
          )}
      </main>
    );
  }
}

module.exports = App;
