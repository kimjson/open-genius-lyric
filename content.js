const selectors = {
  widget: getSelectorByTestId('now-playing-widget'),
  name: getSelectorByTestId('track-info-name'),
  artists: getSelectorByTestId('track-info-artists'),
};

browser.runtime.onMessage.addListener(function (msg, _, sendResponse) {
  // If the received message has the expected format...
  if (msg.text === 'request_nowplaying_track_info') {
    const widget = document.querySelector(selectors.widget);
    const [name, artists] = [selectors.name, selectors.artists]
      .map(s => widget.querySelector(s).textContent);

    sendResponse({artists, name});
  }
});

function getSelectorByTestId(testId) {
  return `div[data-testid='${testId}']`;
}
