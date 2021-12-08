import { Colors, configureFonts, DefaultTheme } from 'react-native-paper';

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
  ios: {
    regular: {
      fontFamily: 'Aeonik-Medium',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Aeonik-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Aeonik-Medium',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Aeonik-Medium',
      fontWeight: 'normal',
    },
  },
  android: {
    regular: {
      fontFamily: 'Aeonik-Medium',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Aeonik-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Aeonik-Medium',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Aeonik-Medium',
      fontWeight: 'normal',
    },
  },
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#128C7E',
    // placeholder: Colors.grey700,
    accent: '#DCF8C6',
  },
  fonts: configureFonts(fontConfig),
  roundness: 0,
};

export default theme;
