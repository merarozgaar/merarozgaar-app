// @flow
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  HelperText,
  Subheading,
  Surface,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../navigation/Navigator';
import type { FormProps } from '../../../lib/useForm';

type PropTypes = {
  ...FormProps,
  jobLocation: Object,
};

const BusinessAddressView = ({
  values: { address },
  getErrors,
  jobLocation,
}: PropTypes) => {
  const theme = useTheme();

  const navigation = useNavigation();

  const navigate = useCallback(
    (route) => () => {
      navigation.navigate(route);
    },
    [navigation],
  );

  const onGotoLocation = useCallback(() => {
    navigation.navigate(RouteNames.location, {
      withCallback: true,
      prevRoute: RouteNames.editJob,
    });
  }, [navigation]);

  const renderErrorMessages = useCallback(
    (key) => (
      <React.Fragment>
        {getErrors(key).map(({ message }, i) => (
          <HelperText
            key={i}
            visible
            type="error"
            style={{ paddingHorizontal: 0 }}>
            {message}
          </HelperText>
        ))}
      </React.Fragment>
    ),
    [getErrors],
  );

  return (
    <Surface style={styles.container}>
      <Subheading style={{ letterSpacing: 0 }}>Address Details</Subheading>
      <View style={{ height: 16 }} />
      <TouchableRipple onPress={onGotoLocation}>
        <View pointerEvents="none" style={{ marginTop: -8 }}>
          <TextInput
            mode="outlined"
            label="Job Location"
            value={address?.formatted_address}
            theme={{
              ...theme,
              colors: {
                ...theme.colors,
                background: address?.formatted_address
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
      {renderErrorMessages('address')}
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
