// @flow
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../navigation/Navigator';
import NoContent from '../../../components/NoContent';

const CoursesView = (): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const navigate = useCallback(
    (route) => () => {
      navigation.navigate(route);
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <NoContent
        icon="book-open-page-variant"
        message="Interviews you've completed will appear here."
      />
      <FAB
        icon="magnify"
        label="Browse courses"
        style={{ backgroundColor: theme.colors.primary, elevation: 0 }}
        uppercase={false}
        onPress={navigate(RouteNames.courses)}
      />
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 128,
  },
  separator: {
    height: 16,
  },
});

export default CoursesView;
