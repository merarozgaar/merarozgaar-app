// @flow
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/createStore';
import theme from './styles/theme';
import Navigator from './Navigator-v2';

const App = (): React$Node => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <PaperProvider theme={theme}>
        <Navigator />
      </PaperProvider>
    </PersistGate>
  </Provider>
);

export default App;
