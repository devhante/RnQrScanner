import React from 'react';
import {WebView} from 'react-native-webview';

const App = () => {
  const onMessage = (event) => {
    console.log(event.nativeEvent.data);
    this.wv.postMessage(event.nativeEvent.data);
  };

  const nfc = () => {};

  return (
    <WebView
      ref={(wv) => (this.wv = wv)}
      source={{uri: 'http://spacekorea.kr:1049/rn-hardware-api/'}}
      onMessage={onMessage}
    />
  );
};

export default App;
