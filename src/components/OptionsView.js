// @flow
import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { List, Paragraph, Surface, Title, useTheme } from 'react-native-paper';
import useAppContent from '../lib/useAppContent';

type PropTypes = {
  isVisible: boolean,
  options: Array<Object>,
  name: string,
  placeholder?: string,
  value: string,
  onChange: Function,
  onDismiss: Function,
};

const OptionsView = ({
  isVisible,
  options,
  name,
  placeholder,
  value,
  onChange,
  onDismiss,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const [scrolling, setScrolling] = useState(false);

  const { appContent } = useAppContent();

  const onSelect = useCallback(
    (v) => () => {
      onChange(name, v);

      onDismiss();
    },
    [name, onChange, onDismiss],
  );

  const handleScroll = useCallback(
    ({
      nativeEvent: {
        contentOffset: { y },
      },
    }) => {
      setScrolling(y > 0);
    },
    [],
  );

  const renderItem = useCallback(
    ({ item: { label, value: v } }) => (
      <List.Item
        title={
          <Paragraph
            style={{
              color:
                value === v ? theme.colors.primary : theme.colors.placeholder,
            }}>
            {label}
          </Paragraph>
        }
        right={(props) =>
          value === v ? (
            <List.Icon {...props} color={theme.colors.primary} icon="check" />
          ) : null
        }
        onPress={onSelect(v)}
        style={styles.listItemContainer}
      />
    ),
    [value, onSelect, theme.colors.placeholder, theme.colors.primary],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const renderFooter = useCallback(() => <View style={{ height: 16 }} />, []);

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onDismiss}
      onBackdropPress={onDismiss}
      style={styles.modalContainer}>
      <Surface style={styles.container}>
        <Surface
          elevation={scrolling ? 2 : 0}
          style={{ paddingTop: 16, paddingBottom: 8 }}>
          <List.Item
            title={<Title>{placeholder ?? appContent.dropdown}</Title>}
            style={{ paddingHorizontal: 24 }}
          />
        </Surface>
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListFooterComponent={renderFooter}
          onScroll={handleScroll}
          showsVerticalScrollIndicator={false}
        />
      </Surface>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    maxHeight: (Dimensions.get('window').height / 3) * 2,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
  },
  listItemContainer: {
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 24,
  },
});

export default OptionsView;
