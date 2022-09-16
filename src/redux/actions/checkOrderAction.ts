import types from './types';

export function updateChecked(data: boolean) {
  return {
    type: types.UPDATE_CHECKED,
    payload: data,
  };
}
