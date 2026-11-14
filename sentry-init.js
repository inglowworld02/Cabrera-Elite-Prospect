/* Error monitoring (Sentry). Lightweight: no third-party script, no cookies, no personal data.
   Sends only: error message, file/line, page path and language. Form contents are NEVER sent. */
(function(){
  var KEY = 'de64b7ccb84a4346139ca5cacb495a00', ORG = 'o4512429115179008', PROJ = '4512430903197696';
  var URL = 'https://' + ORG + '.ingest.us.sentry.io/api/' + PROJ + '/envelope/?sentry_key=' + KEY + '&sentry_version=7';
  var sent = 0, seen = {};
  function id(){ var s=''; for(var i=0;i<32;i++) s += Math.floor(Math.random()*16).toString(16); return s; }
  function send(type, value, extra){
    try{
      var key = type + value; if(seen[key] || sent >= 10) return; seen[key] = 1; sent++;
      var ev = { event_id: id(), timestamp: Date.now()/1000, platform: 'javascript', level: 'error',
        environment: location.hostname === 'cabreraelite.com' ? 'production' : 'other',
        exception: { values: [{ type: type, value: String(value).slice(0, 300) }] },
        tags: { page: location.pathname, lang: (localStorage.getItem('ce_lang') || 'en') },
        extra: extra || {} };
      var body = JSON.stringify({ event_id: ev.event_id, sent_at: new Date().toISOString() }) + '\n' +
                 JSON.stringify({ type: 'event' }) + '\n' + JSON.stringify(ev);
      fetch(URL, { method: 'POST', body: body, mode: 'no-cors', keepalive: true });
    }catch(e){}
  }
  window.addEventListener('error', function(e){ send('Error', e.message, { file: e.filename, line: e.lineno }); });
  window.addEventListener('unhandledrejection', function(e){ send('UnhandledRejection', (e.reason && e.reason.message) || e.reason || 'rejection'); });
  window.ceReport = function(name, msg){ send(name, msg); };
})();
