import React from 'react';
import {WebView} from 'react-native-webview';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';

const App = () => {
  const onMessage = (event) => {
    console.log(event.nativeEvent.data);
    this.webView.postMessage(event.nativeEvent.data);
  };

  const nfc = () => {
    const onRead = (id, techTypes) => {
      this.webView.postMessage(id + ' ' + techTypes);
    };

    NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
      console.warn('tag', tag);
      onRead(tag.id.toString(), tag.techTypes.toString());
      NfcManager.setAlertMessageIOS('I got your tag!');
      NfcManager.unregisterTagEvent().catch(() => 0);
    });
  };

  const patchPostMessageJsCode = `(${String(() => {
    const originalPostMessage = window.postMessage;
    const patchedPostMessage = (message, targetOrigin, transfer) => {
      originalPostMessage(message, targetOrigin, transfer);
    };
    patchedPostMessage.toString = () => {
      return String(Object.hasOwnProperty).replace(
        'hasOwnProperty',
        'postMessage',
      );
    };
    window.postMessage = patchedPostMessage;
  })})();`;

  const disableZoomJsCode = `const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
  meta.setAttribute('name', 'viewport');
  document.getElementsByTagName('head')[0].appendChild(meta); `;

  return (
    <WebView
      ref={(webView) => (this.webView = webView)}
      injectedJavaScript={patchPostMessageJsCode + disableZoomJsCode}
      source={{uri: 'http://spacekorea.kr:1049/rn-hardware-api/'}}
      onMessage={onMessage}
    />
  );
};

export default App;
