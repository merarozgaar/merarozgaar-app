// @flow

import { useSelector } from 'react-redux';
import {
  appContentSelector,
  appLanguageSelector,
} from '../redux/selectors/app';
import type { ContentType } from '../utils/contentProviders';

type UseAppContentType = {
  appContent: ContentType,
  appLanguage: string,
};

const useAppContent = (): UseAppContentType => {
  const appLanguage = useSelector(appLanguageSelector);

  const appContent = useSelector(appContentSelector);

  return {
    appContent,
    appLanguage,
  };
};

export default useAppContent;
