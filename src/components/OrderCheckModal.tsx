import * as React from 'react';
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import moment from 'moment';
import 'moment/locale/ko';

// Material UI Components
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

// Local Component
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';
import * as orderAction from '../redux/actions/orderAction';
import * as orderDetailAction from '../redux/actions/orderDetailAction';
import * as checkOrderAction from '../redux/actions/checkOrderAction';
import appRuntime from '../appRuntime';

interface IProps {
  isOpen: boolean;
  od_id: string;
  currJumjuId: string;
  currJumjuCode: string;
  od_type: string;
  handleClose: () => void;
}
interface IDetails {
  [key: string]: string;
}

export default function OrderCheckModal(props: IProps) {

  const { mt_id, mt_jumju_code, mt_print, do_jumju_origin_use } = useSelector((state: any) => state.login);
  const { isChecked } = useSelector((state: any) => state.checkOrder);
  const history = useHistory();
  const base = baseStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false); // 신규 주문 -> 접수(배달/포장 시간 입력 모달)
  const [deliveryTime, setDeliveryTime] = React.useState(''); // 신규 주문 -> 배달시간 입력  

  const { order, product, store } = useSelector((state: any) => state.orderDetail);

  console.log("checkbox props", props);


  // Toast(Alert) 관리
  const [toastState, setToastState] = React.useState({
    msg: '',
    severity: ''
  });
  const [openAlert, setOpenAlert] = React.useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  // 일렉트론쪽 프린트 출력
  const handlePrint = () => {
    return new Promise((res, rej) => {
      if (order !== null && product !== null && store !== null) {

        const htmlFormat = `
    <style>
      @page { margin: 0; margin-bottom: 20px; }
      @media print {
        .print_area {
          margin-bottom: 50mm;
        }
      }
    </style>
    <div class='print_area' style='width: 100%;'>
      <h5 style='text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 15px'>매장 주문전표</h5>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <tr>
          <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>주문번호 : ${order.order_id}</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>결제방식 : ${order.od_settle_case}</td>
        </tr>
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>매장주소</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>${order.order_addr1}${order.order_addr3}</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${order.od_addr_jibeon}</td>
        </tr>
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>연락처</td>
        </tr>
        ${order.order_safety_number && order.od_settle_type !== 'cash' ?
            `<tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${order.order_safety_number}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${order.order_safety_str}</td>
          </tr>`
            :
            `<tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.phoneFomatter(order.order_hp)}</td>
          </tr>`
          }
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>요청사항</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>가게 : ${order.order_seller ? order.order_seller : '요청사항이 없습니다.'}</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>배달 : ${order.order_officer ? order.order_officer : '요청사항이 없습니다.'}</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>일회용 수저, 포크 : ${order.od_no_spoon == '1' ? '필요없음' : '필요함'}</td>
        </tr>
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <colgroup>
          <col width='70%' />
          <col width='30%' />
        </colgroup>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>메뉴명</td>
          <td style='text-align: right; font-size: 8pt; letter-spacing: -1;'>금액</td>
        </tr>
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <colgroup>
          <col width='70%' />
          <col width='30%' />
        </colgroup>
        ${product && product.length > 0 ?
            product.map((menu: any, index: number) => (
              `<tr key=${menu.it_name + index}>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${menu.it_name} ${menu.ct_qty}개</td>
            <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(menu.sum_price)}원</td>
          </tr>
          ${menu.cart_option && menu.cart_option.length > 0 ?
                menu.cart_option.map((defaultOption: any, key: number) => (
                  `<tr key=${'defaultOption-name-' + key}>
              <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 기본옵션 : ${defaultOption.ct_option}</td>
            </tr>
            <tr key=${'defaultOption-price-' + key}>
              <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 옵션금액 : ${Api.comma(defaultOption.io_price)}원</td>
            </tr>
            `
                )).join('') : ''}
        ${menu.cart_add_option && menu.cart_add_option.length > 0 ? menu.cart_add_option.map((addOption: any, key: number) => (
                  `<tr key=${'addOption-name-' + key}>
              <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 추가옵션 : ${addOption.ct_option}</td>
            </tr>
            <tr key=${'addOption-price-' + key}>
              <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 옵션금액 : ${Api.comma(addOption.io_price)}원</td>
            </tr>
            `
                )).join('') : ''}
        `
            )).join('')
            : ''
          }
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <colgroup>
          <col width='35%' />
          <col width='65%' />
        </colgroup>
        <tr colspan='2'>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>결제정보</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>총 주문금액</td>
          <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.odder_cart_price)}원</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>배달 팁</td>
          <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_cost)}원</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>오주 포인트</td>
          <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_point)}원</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>오주 쿠폰</td>
          <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_coupon_ohjoo)}원</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>상점 쿠폰</td>
          <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_coupon_store)}원</td>
        </tr>
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <colgroup>
          <col width='40%' />
          <col width='60%' />
        </colgroup>
        <tr>
          <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${order.od_sum_type}</td>
          <td style='text-align:right;  font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_sumprice)}원</td>
        </tr>
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>주문매장 : ${store.mb_company}</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 8pt;'>주문번호 : ${order.order_id}</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 8pt;'>주문일시 : ${moment(order.od_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY. MM. DD  HH:mm')}</td>
        </tr>
      </table>
      ${do_jumju_origin_use === 'Y' ?
            `<div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>원산지</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${store.do_jumju_origin}</td>
        </tr>
      </table>`
            : `<p>&nbsp;</p>`}
      <p>&nbsp;</p>
      <hr style='margin: 0 5px;' />
    </div>
  `
        res(appRuntime.send('pos_print', htmlFormat));
      } else {
        alert('주문 디테일이 없습니다.');
      }
    });
  }

  const handlePrint02 = () => {

    return new Promise((res, rej) => {
      if (order !== null && product !== null && store !== null) {

        const htmlFormat02 = `
    <style>
      @page { margin: 0; margin-bottom: 20px; }
      @media print {
        .print_area {
          margin-bottom: 50mm;
        }
      }
    </style>
    <div class='print_area' style='width: 100%;'>
      <h5 style='text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 15px'>${order.od_type} 주문전표</h5>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <tr>
          <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>주문번호 : ${order.order_id}</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>결제방식 : ${order.od_settle_case}</td>
        </tr>
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>매장주소</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>${order.order_addr1}${order.order_addr3}</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${order.od_addr_jibeon}</td>
        </tr>
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>연락처</td>
        </tr>
        ${order.order_safety_number && order.od_settle_type !== 'cash' ?
            `<tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${order.order_safety_number}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${order.order_safety_str}</td>
          </tr>`
            :
            `<tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.phoneFomatter(order.order_hp)}</td>
          </tr>`
          }
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>요청사항</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>가게 : ${order.order_seller ? order.order_seller : '요청사항이 없습니다.'}</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>배달 : ${order.order_officer ? order.order_officer : '요청사항이 없습니다.'}</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>일회용 수저, 포크 : ${order.od_no_spoon == '1' ? '필요없음' : '필요함'}</td>
        </tr>
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <colgroup>
          <col width='70%' />
          <col width='30%' />
        </colgroup>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>메뉴명</td>
          <td style='text-align: right; font-size: 8pt; letter-spacing: -1;'>금액</td>
        </tr>
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <colgroup>
          <col width='70%' />
          <col width='30%' />
        </colgroup>
       ${product && product.length > 0 ?
            product.map((menu: any, index: number) => (
              `<tr key=${menu.it_name + index}>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${menu.it_name} ${menu.ct_qty}개</td>
            <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(menu.sum_price)}원</td>
          </tr>
          ${menu.cart_option && menu.cart_option.length > 0 ?
                menu.cart_option.map((defaultOption: any, key: number) => (
                  `<tr key=${'defaultOption-name-' + key}>
              <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 기본옵션 : ${defaultOption.ct_option}</td>
            </tr>
            <tr key=${'defaultOption-price-' + key}>
              <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 옵션금액 : ${Api.comma(defaultOption.io_price)}원</td>
            </tr>
            `
                )).join('') : ''}
        ${menu.cart_add_option && menu.cart_add_option.length > 0 ? menu.cart_add_option.map((addOption: any, key: number) => (
                  `<tr key=${'addOption-name-' + key}>
              <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 추가옵션 : ${addOption.ct_option}</td>
            </tr>
            <tr key=${'addOption-price-' + key}>
              <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 옵션금액 : ${Api.comma(addOption.io_price)}원</td>
            </tr>
            `
                )).join('') : ''}
        `
            )).join('')
            : ''
          }
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <colgroup>
          <col width='35%' />
          <col width='65%' />
        </colgroup>
        <tr colspan='2'>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>결제정보</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>배달 팁</td>
          <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_cost)}원</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>오주 포인트</td>
          <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_point)}원</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>오주 쿠폰</td>
          <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_coupon_ohjoo)}원</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>상점 쿠폰</td>
          <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_coupon_store)}원</td>
        </tr>
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <colgroup>
          <col width='40%' />
          <col width='60%' />
        </colgroup>
        <tr>
          <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${order.od_sum_type}</td>
          <td style='text-align:right;  font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_sumprice)}원</td>
        </tr>
      </table>
      <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>주문매장 : ${store.mb_company}</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 8pt;'>주문번호 : ${order.order_id}</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 8pt;'>주문일시 : ${moment(order.od_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY. MM. DD  HH:mm')}</td>
        </tr>
      </table>
      ${do_jumju_origin_use === 'Y' ?
            `<div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
      <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>원산지</td>
        </tr>
        <tr>
          <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${store.do_jumju_origin}</td>
        </tr>
      </table>`
            : `<p>&nbsp;</p>`}
      <p>&nbsp;</p>
      <hr style='margin: 0 5px;' />
    </div>
  `
        setTimeout(() => {
          res(appRuntime.send('pos_print', htmlFormat02));
        }, 1000);

      } else {
        alert('주문 디테일이 없습니다.');
      }
    })
  }

  const printHandler = () => {
    handlePrint().then(() => handlePrint02()).catch((err: any) => console.error(err));
  }

  // 현재 신규주문 건수 가져오기
  const getNewOrderHandler = () => {

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '신규주문'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        dispatch(orderAction.updateNewOrder(JSON.stringify(arrItems)));
        getCheckOrderHandler();
      } else {
        dispatch(orderAction.updateNewOrder(null));
        getCheckOrderHandler();
      }
    });
  }

  // 현재 접수완료 주문 가져오기
  const getCheckOrderHandler = () => {

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '접수완료'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("접수완료 success?", arrItems);
        dispatch(orderAction.updateCheckOrder(JSON.stringify(arrItems)));
      } else {
        console.log("접수완료 faild?", arrItems);
        dispatch(orderAction.updateCheckOrder(null));
      }
    });
  }

  // 신규주문 접수하기 (신규주문 상태 -> 접수완료 상태)
  const checkOrderHandler = () => {

    if (deliveryTime === '') {
      if (props.od_type === '포장') {
        setToastState({ msg: '포장 완료 예상시간을 입력해주세요.', severity: 'error' });
      } else {
        setToastState({ msg: '배달 예상 소요시간을 입력해주세요.', severity: 'error' });
      }
      handleOpenAlert();
    } else {
      const param = {
        od_id: props.od_id,
        jumju_id: props.currJumjuId,
        jumju_code: props.currJumjuCode,
        od_process_status: '접수완료',
        delivery_time: deliveryTime,
        visit_time: deliveryTime
      };

      console.log('주문 접수 param', param);
      // return false;

      Api.send('store_order_status_update', param, (args: any) => {
        const resultItem = args.resultItem;
        const arrItems = args.arrItems;

        console.log('주문 접수 result resultItem', resultItem);
        console.log('주문 접수 result arrItems', arrItems);

        if (resultItem.result === 'Y') {
          setToastState({ msg: '주문을 접수하였습니다.', severity: 'success' });
          handleOpenAlert();
          dispatch(checkOrderAction.updateChecked(!isChecked));
          props.handleClose();
          getNewOrderHandler();
          setDeliveryTime('');

          if (mt_print === '1') {
            // 주문 접수시 자동 출력일 경우
            printHandler();
          }

          setTimeout(() => {
            history.push('/order_new');
          }, 700);
        } else {
          setToastState({ msg: '주문을 접수하는데 문제가 생겼습니다.', severity: 'error' });
          handleOpenAlert();
          props.handleClose();
          getNewOrderHandler();
          setDeliveryTime('');
        }
      });
    }
  };


  return (
    <>
      <Box className={base.alertStyle}>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={openAlert}
          autoHideDuration={5000}
          onClose={handleCloseAlert}
        >
          <Alert onClose={handleCloseAlert} severity={toastState.severity === 'error' ? 'error' : 'success'}>
            {toastState.msg}
          </Alert>
        </Snackbar>
      </Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={props.isOpen}
        // onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <Box className={clsx(base.modalInner, base.colCenter)}>
            <Typography id="transition-modal-title" component="h5" variant="h5" style={{ fontWeight: 'bold', marginBottom: 10, color: theme.palette.primary.main }}>{`${props.od_type === '포장' ? '포장' : '배달'} 예상시간 등록`}</Typography>
            <Typography id="transition-modal-description">{`${props.od_type === '포장' ? '포장' : '배달'} 예상시간을 입력해주세요.`}</Typography>
            <TextField
              value={deliveryTime}
              style={{ width: '100%', margin: 20, textAlign: 'right' }}
              id="outlined-basic"
              label={`예상 ${props.od_type === '포장' ? '포장' : '배달'}시간`}
              variant="outlined"
              required
              InputProps={{
                endAdornment: <InputAdornment position="end">분</InputAdornment>,
              }}
              onChange={e => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === '' || re.test(e.target.value)) {
                  let changed = e.target.value.replace(/(^0+)/, '');
                  setDeliveryTime(changed);
                }
              }}
            />

            <Box display='flex' flexDirection='row' mb={5}>
              <Button variant={deliveryTime === '10' ? 'contained' : 'outlined'} color='info' style={{ marginRight: 5, boxShadow: 'none' }} onClick={() => setDeliveryTime('10')}>10분</Button>
              <Button variant={deliveryTime === '20' ? 'contained' : 'outlined'} color='info' style={{ marginRight: 5, boxShadow: 'none' }} onClick={() => setDeliveryTime('20')}>20분</Button>
              <Button variant={deliveryTime === '30' ? 'contained' : 'outlined'} color='info' style={{ marginRight: 5, boxShadow: 'none' }} onClick={() => setDeliveryTime('30')}>30분</Button>
              <Button variant={deliveryTime === '40' ? 'contained' : 'outlined'} color='info' style={{ marginRight: 5, boxShadow: 'none' }} onClick={() => setDeliveryTime('40')}>40분</Button>
              <Button variant={deliveryTime === '50' ? 'contained' : 'outlined'} color='info' style={{ marginRight: 5, boxShadow: 'none' }} onClick={() => setDeliveryTime('50')}>50분</Button>
              <Button variant={deliveryTime === '60' ? 'contained' : 'outlined'} color='info' onClick={() => setDeliveryTime('60')}>60분</Button>
            </Box>

            <ButtonGroup variant="text" color="primary" aria-label="text primary button group" fullWidth>
              <ModalConfirmButton variant="contained" color="primary" style={{ boxShadow: 'none' }} onClick={checkOrderHandler}>보내기</ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={props.handleClose}>취소</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
    </>
  )

}