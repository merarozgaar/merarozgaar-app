// @flow
function actionTypeCreator(module: string, constants: Array<string>): Object {
  return constants.reduce((actions: Object, constant: string) => {
    actions[constant] = `gicbol/${module}/${constant}`;
    return actions;
  }, {});
}

export default actionTypeCreator;
