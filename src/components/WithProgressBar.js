// @flow
import React from 'react';
import { StyleSheet } from 'react-native';
import { ProgressBar, Surface } from 'react-native-paper';

type PropTypes = {
  loading: boolean,
  children: React$Node,
};

const WithProgressBar = ({ loading, children }: PropTypes): React$Node => {
  if (loading) {
    return (
      <Surface style={styles.container}>
        <ProgressBar indeterminate />
      </Surface>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WithProgressBar;
