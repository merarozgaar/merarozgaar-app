// @flow
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Paragraph, useTheme } from 'react-native-paper';

type PropTypes = {
  icon: string,
  message: string,
};

const NoContent = ({ icon, message }: PropTypes): React$Node => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Avatar.Icon
        icon={icon}
        style={{ backgroundColor: theme.colors.placeholder }}
      />
      <View style={styles.separator} />
      <Paragraph style={{ color: theme.colors.placeholder }}>
        {message}
      </Paragraph>
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 16,
  },
});

export default NoContent;
