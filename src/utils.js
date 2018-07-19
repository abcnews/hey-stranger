const alternatingCaseToObject = require('@abcnews/alternating-case-to-object');
const xhr = require('xhr');

const CAPI_ENDPOINT =
  window.location.hostname.indexOf('nucwed') === -1 || window.location.search.indexOf('prod') > -1
    ? 'https://content-gateway.abc-prod.net.au'
    : 'http://nucwed.aus.aunty.abc.net.au';

const fetchCAPI = cmid =>
  new Promise((resolve, reject) => {
    if (!cmid.length && cmid != +cmid) {
      return reject(new Error(`Invalid CMID: ${cmid}`));
    }

    xhr(
      {
        responseType: 'json',
        uri: `${CAPI_ENDPOINT}/api/v2/content/id/${cmid}`
      },
      (error, response, content) => {
        if (error || response.statusCode !== 200) {
          return reject(error || new Error(response.statusCode));
        }

        resolve(content);
      }
    );
  });

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

const isEmbed = node =>
  node.firstElementChild && node.firstElementChild === node.lastElementChild && node.firstElementChild.tagName === 'A';

const getEmbedCMID = node => node.getAttribute('xlink:href').split(':')[1];

const DEFAULT_MEDIA_DOMAIN = 'www.abc.net.au';

const uncrossDomain = url => url.replace(DEFAULT_MEDIA_DOMAIN, window.location.hostname);

module.exports.getProps = async articleCMID => {
  const article = await fetchCAPI(articleCMID);
  const meta = {
    title: article.title,
    bylineHTML: article.byline ? article.byline.slice(3, -4) : null,
    infoSource: article.infoSource,
    infoSourceURL: article.infosourceUrl,
    standfirst: article.teaserTextPlain
  };
  const doc = new DOMParser().parseFromString(article.textXML.text, 'text/html');
  const nodes = [...doc.body.firstChild.children];
  const blockingImages = new ImagesPreloader();
  const nonBlockingImages = new ImagesPreloader();
  const scene = {
    cmDocuments: [article],
    actors: []
  };
  let actor;

  const cmEmbedsById = (await Promise.all(
    nodes.filter(isEmbed).map(node => fetchCAPI(getEmbedCMID(node.firstElementChild)))
  )).reduce((memo, embed) => ((memo[embed.id] = embed), memo), {});

  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i];

    if (!node.tagName || node.textContent.trim().length === 0) {
      // Skip non-elements & empty elements
      continue;
    }

    if (node.textContent.indexOf('#scene') === 0) {
      const config = alternatingCaseToObject(node.textContent);

      scene.width = config.w;
      scene.height = config.h;
    } else if (node.textContent.indexOf('#actor') === 0) {
      const config = alternatingCaseToObject(node.textContent);

      actor = {
        body: {
          width: config.w,
          height: config.h,
          x: config.x,
          y: config.y,
          scale: config.s
        },
        phone: {},
        html: ''
      };

      scene.actors.push(actor);
    } else if (isEmbed(node)) {
      const embed = cmEmbedsById[getEmbedCMID(node.firstElementChild)];

      scene.cmDocuments.push(embed);

      switch (embed.docType) {
        case 'Video':
          scene.video = embed.renditions.slice().sort((a, b) => b.width - a.width)[0];
          scene.video.url = uncrossDomain(scene.video.url);
          break;
        case 'CustomImage':
        case 'Image':
          const image = embed.media.slice().sort((a, b) => b.width - a.width)[0];

          image.url = uncrossDomain(image.url);

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
      actor.html += node.outerHTML;
    }
  }

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

  // Load polyfills
  require('./polyfills.js');
};
