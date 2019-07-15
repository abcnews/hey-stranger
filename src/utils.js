const alternatingCaseToObject = require('@abcnews/alternating-case-to-object');
const terminusFetch = require('@abcnews/terminus-fetch').default;

const SUPPLEMENTARY_CMID_META_SELECTOR = 'meta[name="supplementary"]';

module.exports.getSupplementaryCMID = () => {
  const metaEl = document.querySelector(SUPPLEMENTARY_CMID_META_SELECTOR);

  if (!metaEl) {
    throw new Error(`${SUPPLEMENTARY_CMID_META_SELECTOR} does not exist`);
  }

  let cmid = metaEl.getAttribute('content');

  if (cmid.indexOf('CMArticle') > -1) {
    cmid = cmid.match(/id=(\d+)/)[1];
  }

  if (cmid != +cmid) {
    throw new Error(`"${cmid}" does not look like a CMID`);
  }

  return cmid;
};

class ImagesPreloader {
  constructor() {
    this.assets = new Set();
  }

  static loadURL(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = resolve;
      image.onerror = reject;
      image.src = url;
    });
  }

  add(url) {
    this.assets.add(url);
  }

  load() {
    const done = Promise.all(Array.from(this.assets).map(ImagesPreloader.loadURL));

    this.assets.clear();

    return done;
  }
}

function isMediaEmbedLink(x) {
  return x.docType === 'CustomImage' || x.docType === 'Video';
}

function isEmbed(x) {
  return x.tagname === 'a' && x.parameters.ref;
}

const DEFAULT_MEDIA_DOMAIN = 'www.abc.net.au';

const uncrossDomain = url => url.replace(DEFAULT_MEDIA_DOMAIN, window.location.hostname);

function childAttributes(child) {
  if (!child.parameters) {
    return '';
  }

  return Object.keys(child.parameters).reduce((memo, key) => `${memo} ${key}="${child.parameters[key]}"`, '');
}

function childToHTML(child) {
  return child.type === 'text'
    ? child.content
    : child.children
    ? `<${child.tagname}${childAttributes(child)}>${child.children.reduce(
        (memo, child) => `${memo}${childToHTML(child)}`,
        ''
      )}</${child.tagname}>`
    : `<${child.tagname}${childAttributes(child)} />`;
}

function childToText(child) {
  return child.type === 'text'
    ? child.content
    : child.children
    ? `${child.children.reduce((memo, child) => `${memo}${childToText(child)}`, '')}`
    : '';
}

module.exports.getProps = async articleCMID => {
  const article = await terminusFetch(articleCMID);
  const [standfirst, ...misc] = article.synopsis.split(/\n+/);
  const meta = {
    title: article.title,
    bylineHTML: article.byline ? article.byline.slice(3, -4) : null,
    infoSource: article.infoSource,
    infoSourceURL: article.infosourceUrl,
    standfirst,
    misc
  };
  const nodes = article.text.children;
  const blockingImages = new ImagesPreloader();
  const nonBlockingImages = new ImagesPreloader();
  const scene = {
    actors: [],
    aboutHTML: ''
  };
  let actor;

  const cmEmbedsById = (await Promise.all(
    article.embeddedMedia.filter(isMediaEmbedLink).map(x => terminusFetch({ id: x.id, type: x.docType.toLowerCase() }))
  )).reduce((memo, embed) => ((memo[embed.id] = embed), memo), {});

  const nodesLength = nodes.length;
  let nodeIndex = 0;

  for (; nodeIndex < nodesLength; nodeIndex++) {
    let node = nodes[nodeIndex];

    if (!node.children) {
      // Skip empty elements
      continue;
    }

    if (childToText(node).indexOf('#scene') === 0) {
      const config = alternatingCaseToObject(childToText(node));

      scene.width = config.w;
      scene.height = config.h;
    } else if (childToText(node).indexOf('#actor') === 0) {
      const config = alternatingCaseToObject(childToText(node));

      actor = {
        body: {
          x: config.x,
          y: config.y,
          width: config.w,
          height: config.h,
          focus: {
            x: config.fx || config.w / 2,
            y: config.fy || 0,
            scale: config.fs || 100
          }
        },
        phone: {
          screen: {
            x: config.sx || 0,
            y: config.sy || 0,
            hand: config.sh || 'right'
          }
        },
        storyHTML: ''
      };

      scene.actors.push(actor);
    } else if (isEmbed(node)) {
      const embed = cmEmbedsById[node.parameters.ref];

      switch (embed.docType) {
        case 'Video':
          scene.video = { ...embed.media.video.renditions.files.slice().sort((a, b) => b.width - a.width)[0] };
          scene.video.url = uncrossDomain(scene.video.url);
          break;
        case 'CustomImage':
        case 'Image':
          const image = { ...embed.media.image.primary.complete.slice().sort((a, b) => b.width - a.width)[0] };

          image.url = uncrossDomain(image.url);
          image.description = embed.alt;

          if (!actor) {
            scene.image = image;
            blockingImages.add(image.url);
          } else if (!actor.body.image) {
            actor.body.image = image;
            blockingImages.add(image.url);
          } else {
            actor.phone.image = image;
            nonBlockingImages.add(image.url);
          }
          break;
        default:
          break;
      }
    } else if (actor) {
      if (node.tagname === 'h1') {
        actor.name = node.children[0].content;
      } else {
        actor.storyHTML += childToHTML(node);
      }
    } else {
      scene.aboutHTML += childToHTML(node);
    }
  }

  scene.actors.sort((a, b) => a.body.x + a.body.focus.x - (b.body.x + b.body.focus.x));

  await blockingImages.load();
  nonBlockingImages.load();

  return {
    meta,
    scene
  };
};

module.exports.reset = () => {
  // Set viewport
  (
    document.querySelector('meta[name="viewport"]') ||
    (x => (x.setAttribute('name', 'viewport'), document.head.appendChild(x), x))(document.createElement('meta'))
  ).setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');

  // Remove existing global styles
  [...document.querySelectorAll('link[rel="stylesheet"]')].forEach(x => x.parentElement.removeChild(x));

  // Add new global styles
  require('./global.css');
};
