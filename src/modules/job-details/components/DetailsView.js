// @flow
import React, { Fragment, useCallback, useMemo } from 'react';
import {
  Card,
  FAB,
  IconButton,
  List,
  Paragraph,
  Subheading,
  useTheme,
} from 'react-native-paper';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApplyView from './ApplyView';
import useAppContent from '../../../lib/useAppContent';
import { RouteNames } from '../../../navigation/Navigator';

type PropTypes = {
  loading: boolean,
  job: Object,
  session: Object,
  visible: boolean,
  applying: boolean,
  onApply: Function,
  onDismiss: Function,
  onConfirmApply: Function,
};

const DetailsView = ({
  job,
  visible,
  applying,
  session,
  onDismiss,
  onConfirmApply,
}: PropTypes) => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const jobDescription = useMemo(
    () =>
      [
        {
          label: isHindi ? 'लाभ' : 'Benefits',
          value: job.benefits,
        },
        {
          label: isHindi ? 'कार्य दिवस' : 'Working Days',
          value: job.working_days,
        },
        {
          label: isHindi ? 'समय' : 'Timings',
          value: job.timings,
        },
        {
          label: isHindi ? 'नौकरी का स्थान' : 'Address',
          value: job?.street_address,
        },
        {
          label: 'Website',
          value: job.website,
          right: (props) => (
            <IconButton
              {...props}
              color={theme.colors.placeholder}
              icon="link-variant"
              onPress={() => Linking.openURL(job.website)}
            />
          ),
        },
      ].filter(({ value }) => value),
    [
      isHindi,
      job.benefits,
      job?.street_address,
      job.timings,
      job.website,
      job.working_days,
      theme.colors.placeholder,
    ],
  );

  const jobRequirements = useMemo(
    () =>
      [
        {
          label: isHindi ? 'रिक्ति की संख्या' : 'Vacancies',
          value: job.vacancies,
          icon: 'account-multiple-outline',
        },
        {
          label: 'Education',
          value: job.education,
          icon: 'certificate-outline',
        },
        {
          label: 'Age',
          value: job.min_age,
          icon: 'calendar-outline',
        },
        {
          label: isHindi
            ? 'न्यूनतम अनुभव (वर्षों में)'
            : 'Minimum Experience (in Years)',
          value: job.min_experience,
          icon: 'briefcase-outline',
        },
        {
          label: isHindi ? 'लिंग प्राथमिकता' : 'Gender Preferences',
          value: job.gender,
          icon: 'gender-male-female',
        },
      ]
        .filter(({ value }) => value)
        .map(({ icon, ...rest }) => ({
          ...rest,
          props: {
            left: (props) => <List.Icon {...props} icon={icon} />,
          },
        })),
    [
      isHindi,
      job.education,
      job.gender,
      job.min_age,
      job.min_experience,
      job.vacancies,
    ],
  );

  const navigate = useCallback(
    (route, params = {}) =>
      () => {
        navigation.navigate(route, params);
      },
    [navigation],
  );

  const renderItem = useCallback(
    ({ label, value, props = {} }, i) => (
      <List.Item
        {...props}
        key={i}
        title={<Subheading style={{ letterSpacing: 0 }}>{label}</Subheading>}
        description={
          <Paragraph style={{ color: theme.colors.placeholder }}>
            {value}
          </Paragraph>
        }
        descriptionNumberOfLines={100}
        style={{ padding: 0 }}
      />
    ),
    [theme.colors.placeholder],
  );

  return (
    <Fragment>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.separator} />
        <Card style={styles.cardContainer}>
          <Card.Content style={{ paddingVertical: 8 }}>
            {jobDescription.map(renderItem)}
          </Card.Content>
        </Card>
        <View style={styles.separator} />
        <Card style={styles.cardContainer}>
          <Card.Content style={{ paddingVertical: 8 }}>
            {jobRequirements.map(renderItem)}
          </Card.Content>
        </Card>
        <View style={styles.separator} />
      </ScrollView>
      <ApplyView
        isVisible={visible}
        job={job}
        applying={applying}
        onDismiss={onDismiss}
        onConfirmApply={onConfirmApply}
      />
      {/*{session.role === 'EMPLOYER' ? (*/}
      {/*  <View style={styles.fabContainer}>*/}
      {/*    <FAB*/}
      {/*      icon="square-edit-outline"*/}
      {/*      label="Edit"*/}
      {/*      onPress={navigate(RouteNames.editJob)}*/}
      {/*      style={{*/}
      {/*        backgroundColor: theme.colors.primary,*/}
      {/*      }}*/}
      {/*      uppercase={false}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*) : null}*/}
      {session.role === 'EMPLOYER' && (
        <View style={[styles.fabContainer, { alignItems: 'flex-end' }]}>
          <FAB
            icon="square-edit-outline"
            label={isHindi ? 'संपादित करें' : 'Edit'}
            color={theme.colors.surface}
            onPress={navigate(RouteNames.editJob, { item: job })}
            style={{
              ...(applying
                ? { backgroundColor: theme.colors.disabled }
                : { backgroundColor: theme.colors.primary }),
            }}
            uppercase={false}
          />
        </View>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    justifyContent: 'space-between',
    elevation: 0,
  },
  headerContainer: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  cardContainer: {
    marginHorizontal: 16,
    paddingVertical: 8,
    // borderWidth: 1,
    // elevation: 0,
  },
  separator: {
    height: 16,
  },
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'flex-end',
    padding: 16,
  },
});

export default DetailsView;
