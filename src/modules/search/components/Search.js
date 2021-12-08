// @flow
import React, { Fragment, useCallback, useMemo, useState } from 'react';
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
  session: Object,
  query: string,
  data: Array<Object>,
  professions: Array<Object>,
  onChange: Function,
  onSelect: Function,
  onGetCurrentSearch: Function,
};

const Search = ({
  session,
  // query,
  data,
  professions,
  // onChange,
  onSelect,
  onGetCurrentSearch,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appContent, appLanguage } = useAppContent();

  const [query, onChange] = useState('');

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const matching = useMemo(
    () =>
      query.length
        ? professions.filter(({ label }) =>
            new RegExp(`^${query}`, 'i').test(label),
          )
        : [],
    [professions, query],
  );

  console.log(professions, matching, query);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderItem = useCallback(
    ({ item: { label, value } }) => (
      <List.Item title={label} onPress={onSelect({ profession_id: value })} />
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
          title={isHindi ? 'वर्तमान स्थान का उपयोग करें' : 'Use current Search'}
          description={isHindi ? 'जीपीएस का उपयोग करके' : 'Using GPS'}
          left={(props) => <List.Icon {...props} icon="crosshairs-gps" />}
          onPress={onGetCurrentSearch}
        />
      </Fragment>
    ),
    [isHindi, onGetCurrentSearch],
  );

  const getSearchPlaceholder = useCallback(() => {
    if (session.role === 'EMPLOYER') {
      return isHindi ? 'उम्मीदवारों के लिए खोजें' : 'Search for candidates';
    } else {
      return isHindi ? 'जॉब के लिए खोजें' : 'Search for jobs';
    }
  }, [isHindi, session.role]);

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        <Searchbar
          autoFocus
          icon="arrow-left"
          placeholder={getSearchPlaceholder()}
          value={query}
          onIconPress={goBack}
          onChangeText={onChange}
          style={{ elevation: 0 }}
        />
      </Appbar>
      <FlatList
        data={matching}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={Divider}
        // ListFooterComponent={renderFooter}
        // ListEmptyComponent={renderEmptyComponent}
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

export default Search;
