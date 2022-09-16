import types from './types';

export function updateMenuSelect(data: string) {
  
  console.log(data);

  return {
    type: types.MENU_CONTROL_SELECT,
    selectType: data
  }
}