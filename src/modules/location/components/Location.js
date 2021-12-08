// @flow
import React, { Fragment, useCallback, useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {
  Appbar,
  Divider,
  List,
  Searchbar,
  Surface,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import useAppContent from '../../../lib/useAppContent';
import powered_by_google from '../../../assets/images/powered_by_google.png'; 
type PropTypes = {
  query: string,
  data: Array<Object>,
  onChange: Function,
  onSelect: Function,
  onGetCurrentLocation: Function,
};

const Location = ({
  query,
  data,
  onChange,
  onSelect,
  onGetCurrentLocation,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderItem = useCallback(
    ({ item: { description, place_id, structured_formatting } }) => (
      <List.Item
        title={structured_formatting?.main_text ?? description}
        description={description}
        descriptionNumberOfLines={1}
        left={(props) => <List.Icon {...props} icon="map-marker-outline" />}
        onPress={onSelect({
          formatted_address: description,
          name: structured_formatting?.main_text ?? description,
          place_id,
        })}
      />
    ),
    [onSelect],
  );

  const renderFooter = useCallback(
    () => (
      <Surface style={styles.colophon}>
        <Image
          source={powered_by_google}
          style={{
            width: Dimensions.get('window').width / 3,
            aspectRatio: 216 / 27,
            resizeMode: 'contain',
          }}
        />
      </Surface>
    ),
    [],
  );

  const renderEmptyComponent = useCallback(
    () => (
      <Fragment>
        <List.Item
          title={
            isHindi ? 'वर्तमान स्थान का उपयोग करें' : 'Use current location'
          }
          description={isHindi ? 'जीपीएस का उपयोग करके' : 'Using GPS'}
          left={(props) => <List.Icon {...props} icon="crosshairs-gps" />}
          onPress={onGetCurrentLocation}
        />
      </Fragment>
    ),
    [isHindi, onGetCurrentLocation],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        <Searchbar
          autoFocus
          icon="arrow-left"
          placeholder={
            isHindi
              ? 'आप कहाँ काम करना चाहते हैं?'
              : 'Where do you want to work?'
          }
          value={query}
          onIconPress={goBack}
          onChangeText={onChange}
          style={{ elevation: 0 }}
        />
      </Appbar>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={Divider}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    justifyContent: 'space-between',
  },
  notificationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colophon: {
    alignItems: 'flex-end',
    padding: 16,
  },
});

export default Location;
