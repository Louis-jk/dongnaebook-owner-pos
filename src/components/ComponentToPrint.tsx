import * as React from "react";
import { useSelector } from "react-redux";
import Api from "../Api";
import { makeStyles } from "@material-ui/styles";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const OrderPrint = React.forwardRef<HTMLDivElement>((props, ref) => {
  const { mt_store } = useSelector((state: any) => state.login);
  const { order, product, store } = useSelector((state: any) => state.orderDetail);

  return mt_store && order && product && store && (
    <Box id="print_box" ref={ref} display="block" width="80mm" height="100%" overflow="auto" zIndex={99999} p={3} style={{ backgroundColor: '#fff' }}>
      <Box>
      </Box>
      <Typography textAlign="center" fontWeight="bold" component="h5" variant="h5" mb={2}>오늘의 주문</Typography>
      <Divider />
      <Box my={2}>
        <Typography mb={0.5} fontSize="12pt" fontWeight="bold" marginBottom={1.5}>주문정보</Typography>
        <Box display="flex" flexDirection="row" mb={0.5}>
          <Typography fontSize="11pt" lineHeight={1.2} flex={3}>주문매장 : </Typography>
          <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{store.mb_company}</Typography>
        </Box>
        <Box display="flex" flexDirection="row" mb={0.5}>
          <Typography fontSize="11pt" lineHeight={1.2} flex={3}>주문시간 : </Typography>
          <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{order.od_time}</Typography>
        </Box>
        <Box display="flex" flexDirection="row" mb={0.5}>
          <Typography fontSize="11pt" lineHeight={1.2} flex={3}>주문방법 : </Typography>
          <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{order.od_type}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box my={2}>
        <Typography mb={0.5} fontSize="12pt" fontWeight="bold" marginBottom={1.5}>주문메뉴</Typography>
        {product.map((item: any, index: number) => (
          <Typography key={index} fontSize="11pt" lineHeight={1.2}>메뉴 : {item.it_name} / 옵션 - {item.ct_option}</Typography>
        ))}
      </Box>
      <Divider />
      <Box my={2}>
        <Typography mb={0.5} fontSize="12pt" fontWeight="bold" marginBottom={1.5}>배달정보</Typography>
        <Box display="flex" flexDirection="row" mb={0.5}>
          <Typography fontSize="11pt" lineHeight={1.2} flex={3}>배달주소 : </Typography>
          <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_addr1} {order.order_addr3}</Typography>
        </Box>
        <Box display="flex" flexDirection="row" mb={0.5}>
          <Typography fontSize="11pt" lineHeight={1.2} flex={3}>전화번호 : </Typography>
          <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{Api.phoneFomatter(order.order_hp)}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box my={2}>
        <Typography mb={0.5} fontSize="12pt" fontWeight="bold">요청사항</Typography>
        <Box display="flex" flexDirection="row" mb={0.5}>
          <Typography fontSize="11pt" lineHeight={1.2} flex={3}>사장님께 : </Typography>
          <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_seller ? order.order_seller : "요청사항이 없습니다."}</Typography>
        </Box>
        <Box display="flex" flexDirection="row">
          <Typography fontSize="11pt" lineHeight={1.2} flex={3}>기사님께 : </Typography>
          <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_officer ? order.order_officer : "요청사항이 없습니다."}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box my={2}>
        <Typography mb={0.5} fontSize="12pt" fontWeight="bold">결제정보</Typography>
        <Box display="flex" flexDirection="row" mb={0.5}>
          <Typography fontSize="11pt" lineHeight={1.2} flex={3}>총 주문금액 : </Typography>
          <Typography fontSize="11pt" lineHeight={1.2} flex={8} textAlign="right">{Api.comma(order.odder_cart_price)} 원</Typography>
        </Box>
        <Box display="flex" flexDirection="row" mb={0.5}>
          <Typography fontSize="11pt" lineHeight={1.2} flex={3}>배달팁 : </Typography>
          <Typography fontSize="11pt" lineHeight={1.2} flex={8} textAlign="right">{Api.comma(order.order_cost)} 원</Typography>
        </Box>
        <Box display="flex" flexDirection="row" mb={0.5}>
          <Typography fontSize="11pt" lineHeight={1.2} flex={3}>포인트 : </Typography>
          <Typography fontSize="11pt" lineHeight={1.2} flex={8} textAlign="right">{Api.comma(order.order_point)} P</Typography>
        </Box>
        <Box display="flex" flexDirection="row" mb={0.5}>
          <Typography fontSize="11pt" lineHeight={1.2} flex={3}>쿠폰할인 : </Typography>
          <Typography fontSize="11pt" lineHeight={1.2} flex={8} textAlign="right">{Api.comma(order.order_coupon)} 원</Typography>
        </Box>
        <Box display="flex" flexDirection="row" mb={2}>
          <Typography fontSize="11pt" lineHeight={1.2} flex={3}>결제방법 : </Typography>
          <Typography fontSize="11pt" lineHeight={1.2} flex={8} textAlign="right">{order.od_settle_case}</Typography>
        </Box>
        <Divider />
        <Box display="flex" flexDirection="row" mt={2} mb={1}>
          <Typography fontSize="12pt" fontWeight="bold" lineHeight={1.2} flex={4}>총 결제금액 : </Typography>
          <Typography fontSize="12pt" fontWeight="bold" lineHeight={1.2} flex={8} textAlign="right">{Api.comma(order.order_sumprice)} 원</Typography>
        </Box>
      </Box>
      <Divider />
    </Box>
  )
});

export default OrderPrint;
