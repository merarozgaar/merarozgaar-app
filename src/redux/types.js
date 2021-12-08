// @flow

export type ActionType = {
  type: string,
  payload?: Object,
};

export type DispatchType = (
  action: ActionType | ThunkActionType | PromiseActionType | Array<ActionType>,
) => any;

export type GetStateType = () => Object;

export type ThunkActionType = (
  dispatch: DispatchType,
  getState: GetStateType,
) => any;

export type PromiseActionType = Promise<ActionType>;
