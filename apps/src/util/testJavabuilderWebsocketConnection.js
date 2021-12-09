// helper to allow behind the scenes test of javabuilder connection
// on load of high traffic pages. particularly interested
// in collecting data on whether schools often block websockets.
export default function testJavabuilderWebsocketConnection() {
  let token;

  try {
    const csrfContainer = document.querySelector('meta[name="csrf-token"]');
    token = csrfContainer?.content;

    logEvent('started', token);

    const socket = new WebSocket(
      'wss://javabuilderbeta.code.org?Authorization=connectivityTest'
    );

    socket.onopen = function(e) {
      socket.send('connectivityTest');
    };

    socket.onmessage = function(message) {
      if (message.data === 'success') {
        logEvent('success', token);
      } else {
        logEvent('unexpected-message-response', token, message.data);
      }
      socket.close();
    };

    socket.onerror = function(e) {
      logEvent('websocket-error', token);
      socket.close();
    };
  } catch (error) {
    logEvent('other-error', token, error.toString());
  }
}

// We log via our own servers to avoid
// schools potentially blocking API calls to third parties,
// which might affect our results if we were to log to firehose directly.
const logEvent = (event, token, detail) => {
  const payload = {event};
  if (detail) {
    payload.detail = detail;
  }

  if (token) {
    fetch('/javabuilder/connectivity_test_logging', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-CSRF-Token': token
      },
      body: JSON.stringify(payload)
    });
  }
};
