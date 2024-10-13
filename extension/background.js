chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({ url: 'popup.html' });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.proxy.settings.set(
      { value: { mode: 'fixed_servers', rules: { singleProxy: { scheme: 'http', host: 'localhost', port: 8080 } } }, scope: 'regular' },
      () => console.log('Proxy set to localhost:8080')
  );
});
