const kebabCase = require('lodash/kebabCase');
const capitalize = require('lodash/capitalize');

// Regex-pattern to check URLs against.
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
const SPOTIFY_URL_REGEX = /^https?:\/\/(?:[^./?#]+\.)?spotify\.com/;

// When the browser-action button is clicked...
browser.browserAction.onClicked.addListener(function (tab) {
  // TODO: support any open spotify tab, not just active tab right now.
  if (isSpotifyWebPlayer(tab.url)) {
    browser.tabs.sendMessage(tab.id, { text: 'request_nowplaying_track_info' }, openGeniusLyric);
  }
});

function isSpotifyWebPlayer(url) {
  return SPOTIFY_URL_REGEX.test(url);
}

function getGeniusUrl(name, artists) {
  // FIXME: improve santizing logic, or search in genius.com as a fallback.
  const [artist] = artists.split(', ');
  const [title] = name.split(' (feat.');
  const pathname = capitalize(`${kebabCase(artist)}-${kebabCase(title)}-lyrics`);
  return `https://genius.com/${pathname}`;
}

function getGeniusSearchUrl(name, artists) {
  // FIXME: improve santizing logic, or search in genius.com as a fallback.
  const [artist] = artists.split(', ');
  const [title] = name.split(' (feat.');
  return encodeURI(`https://genius.com/search?q=${artist} ${title}`);
}

// A function to use as callback
async function openGeniusLyric({name, artists}) {
  const geniusUrl = getGeniusUrl(name, artists);
  const res = await fetch(geniusUrl);
  if (res.ok) {
    await browser.tabs.create({ url: geniusUrl });
  } else {
    const searchUrl = getGeniusSearchUrl(name, artists);
    await browser.tabs.create({ url: searchUrl });
  }
}
