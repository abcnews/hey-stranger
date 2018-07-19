const cn = require('classnames');
const debounce = require('debounce');
const { h, Component } = require('preact');
const styles = require('./styles.css');

const SMALLEST_TRANSPARENT_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAADs=';

let nextId = 0;
let viewportHeight;
let viewportWidth;
let viewportRatio;
const mountedComponents = new Map();

const measureViewport = () => {
  viewportHeight = window.innerHeight;
  viewportWidth = window.innerWidth;
  viewportRatio = viewportWidth / viewportHeight;
};

const invalidateViewport = debounce(() => {
  measureViewport();
  mountedComponents.forEach((_, component) => component.forceUpdate());
}, 50);

measureViewport();
window.addEventListener('resize', invalidateViewport);
window.addEventListener('orientationchange', invalidateViewport);

class Scene extends Component {
  constructor(props) {
    super(props);

    this.id = `${styles.root}__${nextId++}`;
    this.actorsBackToFront = props.actors.slice().sort((a, b) => a.body.y + a.body.height - (b.body.y + b.body.height));
    this.actorsFrontToBack = this.actorsBackToFront.slice().reverse();
    this.actorBodiesSceneBoxes = props.actors.map(actor => ({
      x1: actor.body.x - actor.body.width / 2,
      x2: actor.body.x + actor.body.width / 2,
      y1: actor.body.y,
      y2: actor.body.y + actor.body.height
    }));
    this.clickCanvas = document.createElement('canvas');
    this.clickCanvas.width = this.props.width;
    this.clickCanvas.height = this.props.height;
    this.clickCanvasCTX = this.clickCanvas.getContext('2d');
    this.imageRefs = {};

    this.state = {
      shouldAutoPan: true
    };

    this.firstInteraction = this.firstInteraction.bind(this);
    this.pickActor = this.pickActor.bind(this);
    this.saveImageRef = this.saveImageRef.bind(this);
    this.scrollBegin = this.scrollBegin.bind(this);
    this.scrollContinue = this.scrollContinue.bind(this);
    this.scrollFinish = this.scrollFinish.bind(this);
    this.scrollWheel = this.scrollWheel.bind(this);
  }

  clampScrollOffset(scrollOffset) {
    return Math.min(this.scrollMax, Math.max(-this.scrollMax, scrollOffset));
  }

  firstInteraction() {
    this.hasMadeFirstInteraction = true;
    this.setState({ scrollOffset: this.measureScrollOffset(), shouldAutoPan: false });
  }

  measureScrollOffset() {
    const transform = window.getComputedStyle(this.base).transform;

    return transform.indexOf('matrix') === 0 ? Math.round(transform.split(', ')[4]) : 0;
  }

  pickActor(event) {
    if (this.hasRecentlyScrolled) {
      return;
    }

    const sceneBox = this.base.getBoundingClientRect();
    const sceneScale = sceneBox.width / this.props.width;
    const sceneX = (event.pageX - sceneBox.x) / sceneScale;
    const sceneY = (event.pageY - sceneBox.y) / sceneScale;

    const candidateActors = this.actorBodiesSceneBoxes
      .reduce((memo, box, index) => {
        if (sceneX >= box.x1 && sceneX <= box.x2 && sceneY >= box.y1 && sceneY <= box.y2) {
          memo.push(this.props.actors[index]);
        }

        return memo;
      }, [])
      .sort((a, b) => this.actorsFrontToBack.indexOf(a) - this.actorsFrontToBack.indexOf(b));

    const nextFocus = candidateActors.find(actor => {
      const box = this.actorBodiesSceneBoxes[this.props.actors.indexOf(actor)];

      this.clickCanvasCTX.clearRect(0, 0, this.props.width, this.props.height);
      this.clickCanvasCTX.drawImage(
        this.imageRefs[actor.body.image.url],
        box.x1,
        box.y1,
        actor.body.width,
        actor.body.height
      );

      return this.clickCanvasCTX.getImageData(sceneX, sceneY, 1, 1).data[3] >= 128;
    });

    if (!nextFocus && !this.props.focused) {
      return;
    }

    this.props.changeFocus(nextFocus === this.props.focused ? null : nextFocus);
    this.setState({ scrollOffset: null });
  }

  saveImageRef(event) {
    this.imageRefs[event.target.src] = event.target;
  }

  scrollBegin(event) {
    if (!this.hasMadeFirstInteraction) {
      this.firstInteraction();
    }

    if (this.props.focused || this.scrollPreviousX != null) {
      return;
    }

    this.scrollPreviousX = event.touches ? event.touches[0].clientX : event.clientX;
  }

  scrollContinue(event) {
    if (typeof event.scale !== 'undefined' && event.scale !== 1) {
      // Attempt to stop pinch-zoom
      return event.preventDefault();
    }

    if (this.scrollPreviousX == null) {
      return;
    }

    this.hasRecentlyScrolled = true;
    this.scrollCurrentX = event.touches ? event.touches[0].clientX : event.clientX;

    this.setState({
      scrollOffset: this.clampScrollOffset(
        (this.state.scrollOffset || this.measureScrollOffset()) - this.scrollPreviousX + this.scrollCurrentX
      )
    });

    this.scrollPreviousX = this.scrollCurrentX;
  }

  scrollFinish() {
    if (this.hasRecentlyScrolled) {
      setTimeout(() => (this.hasRecentlyScrolled = false), 250);
    }

    this.scrollPreviousX = null;
    this.scrollCurrentX = null;
  }

  scrollWheel(event) {
    if (!this.hasMadeFirstInteraction) {
      this.firstInteraction();
    }

    if (this.props.focused || this.scrollPreviousX != null || !event.deltaX) {
      return;
    }

    this.setState({
      scrollOffset: this.clampScrollOffset((this.state.scrollOffset || this.measureScrollOffset()) - event.deltaX)
    });
  }

  // Component lifecycle

  componentDidMount() {
    mountedComponents.set(this, true);
    invalidateViewport();

    this.lastBaseOffsetWidth;
  }

  componentWillUnmount() {
    mountedComponents.delete(this, true);
  }

  render({ isInteractive, width, height, image, video, focused }, { scrollOffset, shouldAutoPan }) {
    const ratio = width / height;
    const ratioDiff = ratio - viewportRatio;
    const scaledWidth = ratioDiff > 0 ? (viewportHeight / height) * width : viewportWidth;
    const scaledHeight = ratioDiff > 0 ? viewportHeight : (viewportWidth / width) * height;

    this.scrollMax = Math.max(0, Math.round((scaledWidth - viewportWidth) / 2));

    return (
      <div
        id={this.id}
        className={cn(styles.root, {
          [styles.hasFocused]: focused
        })}
        onMouseDown={isInteractive ? this.scrollBegin : null}
        onTouchStart={isInteractive ? this.scrollBegin : null}
        onMouseMoveCapture={isInteractive ? this.scrollContinue : null}
        onTouchMoveCapture={isInteractive ? this.scrollContinue : null}
        onMouseUp={isInteractive ? this.scrollFinish : null}
        onTouchEnd={isInteractive ? this.scrollFinish : null}
        onMouseLeave={isInteractive ? this.scrollFinish : null}
        onTouchCancel={isInteractive ? this.scrollFinish : null}
        onWheel={isInteractive ? this.scrollWheel : null}
        onClick={isInteractive ? this.pickActor : null}
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          transformOrigin: focused ? `${(focused.body.x / width) * 100}% ${(focused.body.y / height) * 100}%` : '',
          transform: focused
            ? `translate3d(${50 - (focused.body.x / width) * 100}% , ${66 -
                (focused.body.y / height) * 100}%, 0) scale(${focused.body.scale / 100})`
            : scrollOffset !== null
              ? `translate3d(${scrollOffset}px, 0, 0)`
              : '',
          transitionDuration: scrollOffset ? '0s' : ''
        }}
      >
        {shouldAutoPan && isInteractive && <style>{animationCSS(this.id, this.scrollMax)}</style>}
        <div className={styles.base}>
          {video ? (
            <video
              src={video.url}
              poster={SMALLEST_TRANSPARENT_IMAGE}
              autoplay
              loop
              muted
              playsinline
              webkit-playsinline
            />
          ) : image ? (
            <img src={image.url} />
          ) : null}
        </div>
        <div className={styles.bodies}>
          {this.actorsBackToFront.map(actor => (
            <div
              className={cn(styles.body, {
                [styles.isFocused]: focused === actor
              })}
              style={{
                left: `${(actor.body.x / width) * 100}%`,
                top: `${(actor.body.y / height) * 100}%`,
                width: `${(actor.body.width / width) * 100}%`
              }}
            >
              <img src={actor.body.image.url} onLoad={this.saveImageRef} />
            </div>
          ))}
        </div>
        {/* <div className={styles.content} dangerouslySetInnerHTML={{ __html: cmDocuments[0].textXML.text }} /> */}
      </div>
    );
  }
}

const animationCSS = (id, scrollMax = 0) => {
  const name = `${id}__scrollMax${String(scrollMax).split('.')[0]}`;

  return `
@keyframes ${name} {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  25% {
    transform: translate3d(${-scrollMax}px, 0, 0);
  }
  75% {
    transform: translate3d(${scrollMax}px, 0, 0);
  }
}
#${id} {
  animation: ${name} ${Math.round(scrollMax / 5)}s linear 0s infinite alternate both;
}
  `;
};

module.exports = Scene;
