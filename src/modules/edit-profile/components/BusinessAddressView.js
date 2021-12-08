// @flow
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Subheading,
  Surface,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import type { FormProps } from '../../../lib/useForm';
import { RouteNames } from '../../../navigation/Navigator';
import { useNavigation } from '@react-navigation/native';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  location: Object,
};

const BusinessAddressView = ({ location }: PropTypes) => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const navigate = useCallback(
    (route) => () => {
      navigation.navigate(route);
    },
    [navigation],
  );

  return (
    <Surface style={styles.container}>
      <TouchableRipple onPress={navigate(RouteNames.location)}>
        <View pointerEvents="none" style={{ marginTop: -8 }}>
          <TextInput
            mode="outlined"
            label={isHindi ? 'पता' : 'Address'}
            value={location?.formatted_address}
            theme={{
              ...theme,
              colors: {
                ...theme.colors,
                background: location?.formatted_address
                  ? theme.colors.surface
                  : 'transparent',
              },
            }}
            right={
              <TextInput.Icon
                color={theme.colors.placeholder}
                icon="map-marker-outline"
                forceTextInputFocus={false}
                onPress={navigate(RouteNames.location)}
              />
            }
          />
        </View>
      </TouchableRipple>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  separator: {
    height: 8,
  },
  dropdownContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
});

export default BusinessAddressView;
