// @flow
import { createTransform } from 'redux-persist';
import isEmpty from 'lodash.isempty';

const transformsConfig: Object = {
  app: {
    inbound: (inboundState) => ({ ...inboundState, appView: '' }),
    outbound: (inboundState, _, { session: sessionState }) => {
      const { session } = JSON.parse(sessionState);

      return {
        ...inboundState,
        appView: isEmpty(session) ? '' : session.role,
      };
    },
    config: 'whitelist',
  },
};

const transforms: Object = Object.keys(transformsConfig).map((key) =>
  createTransform(
    (...props) => ({
      ...transformsConfig[key].inbound(...props),
    }),
    (...props) => ({
      ...transformsConfig[key].outbound(...props),
    }),
    {
      [transformsConfig[key].config]: [key],
    },
  ),
);

export default transforms;
