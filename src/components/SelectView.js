// @flow
import React, { useCallback, useMemo, useState } from 'react';
import { TextInput, TouchableRipple, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import OptionsView from './OptionsView';

type PropTypes = {
  label: string,
  value: string,
  name: string,
  options: Array<Object>,
  onChange: Function,
  containerStyle?: ViewStyleProp,
};

const SelectView = ({
  label,
  value,
  name,
  options,
  onChange,
  containerStyle,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const selected = useMemo(() => {
    const match = options.find(({ value: v }) => v === value);

    if (match) {
      return match?.label ?? '';
    }

    return '';
  }, [options, value]);

  const toggleOpen = useCallback(() => {
    setOpen((state) => !state);
  }, []);

  return (
    <View style={containerStyle}>
      <TouchableRipple onPress={toggleOpen}>
        <View pointerEvents="none" style={{ marginTop: -8 }}>
          <TextInput
            mode="outlined"
            label={label}
            value={selected}
            theme={{
              ...theme,
              colors: {
                ...theme.colors,
                background: selected ? theme.colors.surface : 'transparent',
              },
            }}
            right={
              <TextInput.Icon
                color={theme.colors.placeholder}
                icon="chevron-down"
                forceTextInputFocus={false}
                onPress={toggleOpen}
              />
            }
          />
        </View>
      </TouchableRipple>
      <OptionsView
        isVisible={open}
        name={name}
        value={value}
        options={options}
        onChange={onChange}
        onDismiss={toggleOpen}
      />
    </View>
  );
};

export default SelectView;
