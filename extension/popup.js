document.getElementById('startProxy').addEventListener('click', function() {
  chrome.proxy.settings.set(
      { value: { mode: 'fixed_servers', rules: { singleProxy: { scheme: 'http', host: 'localhost', port: 8080 } } }, scope: 'regular' },
      () => {
          document.getElementById('status').innerText = "Status: Active";
          console.log('Proxy started');
      }
  );
});

document.getElementById('stopProxy').addEventListener('click', function() {
  chrome.proxy.settings.clear(
      { scope: 'regular' },
      () => {
          document.getElementById('status').innerText = "Status: Inactive";
          console.log('Proxy stopped');
      }
  );
});
