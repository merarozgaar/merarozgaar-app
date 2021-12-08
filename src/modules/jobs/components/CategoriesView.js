// @flow
import React, { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';
import { Avatar, List, Paragraph, useTheme } from 'react-native-paper';
import useAppContent from '../../../lib/useAppContent';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../Navigator-v2';

const CategoriesView = () => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const data = useMemo(
    () => [
      {
        title: isHindi ? 'कॉल सेंटर/कॉलिंग' : 'Call Centre/Calling',
        icon: require('../../../assets/images/icons/005-call-center-agent.png'),
        professionID: isHindi ? 758 : 558,
      },
      {
        title: isHindi ? 'लेबर' : 'Construction Labour',
        icon: require('../../../assets/images/icons/004-under-construction.png'),
        professionID: isHindi ? 29 : 524,
      },
      {
        title: isHindi ? 'डिलिव्री व्यक्ति' : 'Delivery Person',
        icon: require('../../../assets/images/icons/006-delivery-man.png'),
        professionID: isHindi ? 696 : 495,
      },
      {
        title: isHindi ? 'ड्राइवर' : 'Driver',
        icon: require('../../../assets/images/icons/007-driver.png'),
        professionID: isHindi ? 700 : 499,
      },
      {
        title: isHindi ? 'फैक्टरी मजदूर' : 'Factory Worker',
        icon: require('../../../assets/images/icons/002-worker.png'),
        professionID: isHindi ? 29 : 524,
      },
      {
        title: isHindi ? 'घरेलू मदद और रसोइया' : 'Househelp & Cook',
        icon: require('../../../assets/images/icons/008-cooking.png'),
        professionID: isHindi ? 718 : 517,
      },
      {
        title: isHindi ? 'रिसेप्शनिस्ट' : 'Receptionist',
        icon: require('../../../assets/images/icons/001-receptionist.png'),
        professionID: isHindi ? 744 : 544,
      },
      {
        title: isHindi ? 'सुरक्षा गार्ड' : 'Security Guard',
        icon: require('../../../assets/images/icons/010-security-guard.png'),
        professionID: isHindi ? 749 : 549,
      },
    ],
    [isHindi],
  );

  const navigate = useCallback(
    (route, params = {}) =>
      () => {
        navigation.navigate(route, params);
      },
    [navigation],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const renderItem = useCallback(
    ({ item: { title, icon, professionID } }) => (
      <List.Item
        title={
          <Paragraph
            style={{ color: theme.colors.placeholder, letterSpacing: 0 }}>
            {title}
          </Paragraph>
        }
        left={(props) => (
          <Avatar.Image
            {...props}
            source={icon}
            style={{ ...props.style, backgroundColor: '#ECE5DD' }}
          />
        )}
        onPress={navigate(RouteNames.searchResults, {
          profession_id: professionID,
        })}
        style={{ paddingHorizontal: 16 }}
      />
    ),
    [navigate, theme.colors.placeholder],
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ paddingVertical: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CategoriesView;
