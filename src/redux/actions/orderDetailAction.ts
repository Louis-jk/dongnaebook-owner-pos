import types from './types';

export function updateOrderDetail(data: string) {
  const args = JSON.parse(data);
  console.log('order detail args', args);

  return {
    type: types.UPDATE_ORDER_DETAIL,
    order: args !== '' ? args.order : null,
    product: args !== '' ? args.orderDetail : [],
    store: args !== '' ? args.store : null,
  };
}
