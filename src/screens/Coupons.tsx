import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import Pagination from '@material-ui/core/Pagination';
import Stack from '@material-ui/core/Stack';

// Material icons
import IconButton from '@material-ui/core/IconButton';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Component
import Header from '../components/Header';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';
import { CouponStyles } from '../styles/custom';

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

interface ICoupon {
  cz_download: string;
  cz_end: string;
  cz_maximum: string;
  cz_method: string;
  cz_minimum: string;
  cz_no: string;
  cz_period: string;
  cz_price: string;
  cz_price_type: string;
  cz_start: string;
  cz_subject: string;
  cz_target: string;
  cz_type: string;
}

export default function Tips(props: any) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);

  const base = baseStyles();
  const coupon = CouponStyles();
  const history = useHistory();

  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 페이지 현재 페이지
  const [startOfIndex, setStartOfIndex] = useState(0); // 페이지 API 호출 start 인덱스
  const [postPerPage, setPostPerPage] = useState(6); // 페이지 API 호출 Limit
  const [totalCount, setTotalCount] = useState(0); // 아이템 전체 갯수
  const [lists, setLists] = useState<ICoupon[]>([
    {
      cz_download: '',
      cz_end: '',
      cz_maximum: '',
      cz_method: '',
      cz_minimum: '',
      cz_no: '',
      cz_period: '',
      cz_price: '',
      cz_price_type: '',
      cz_start: '',
      cz_subject: '',
      cz_target: '',
      cz_type: '',
    }
  ]);
  const [couponId, setCouponId] = useState('');

  // Toast(Alert) 설정 값
  const [toastState, setToastState] = useState({
    msg: '',
    severity: ''
  });
  const [openAlert, setOpenAlert] = useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteCouponConfirmHandler = (coupon_id: string) => {
    setCouponId(coupon_id);
    setOpen(true);
  }


  // 쿠폰 삭제 핸들러
  const deleteCouponHandler = () => {
    let param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      cz_no: couponId
    };

    Api.send('store_couponzone_delete', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        setToastState({ msg: '쿠폰이 삭제되었습니다.', severity: 'success' });
        handleOpenAlert();
        handleClose();
        getCouponListHandler();
      } else {
        setToastState({ msg: '쿠폰을 삭제하는 중 오류가 발생하였습니다.', severity: 'error' });
        handleOpenAlert();
        handleClose();
      }
    });
  }

  // 등록된 쿠폰 가져오기 핸들러
  const getCouponListHandler = () => {

    setLoading(true);

    let param = {
      item_count: startOfIndex,
      limit_count: postPerPage,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
    };

    Api.send('store_couponzone_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      let toTotalCount = Number(resultItem.total_cnt);
      setTotalCount(toTotalCount);

      let totalPage = Math.ceil(toTotalCount / postPerPage);

      setTotalCount(totalPage);

      if (resultItem.result === 'Y') {
        setLists(arrItems);
        setLoading(false);
      } else {
        setLists([]);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getCouponListHandler();
  }, [mt_id, mt_jumju_code, startOfIndex]);


  // 페이지 전환 핸들러
  const pageHandleChange = (event: any, value: any) => {

    if (value === 1 || value < 1) {
      setStartOfIndex(0);
    } else {
      let start = (value - 1) * postPerPage;
      setStartOfIndex(start);
    }
    setCurrentPage(value);
  }


  return (
    <Box component="div" className={base.root}>
      <Header type="coupon" action={handleOpen} />
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
      {/* 쿠폰 삭제 모달 */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={coupon.couponModal}
        open={open}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box className={coupon.couponModalInner} style={{ zIndex: 99999 }}>
            <h2 id="transition-modal-title" className={base.modalTitle}>쿠폰 삭제</h2>
            <p id="transition-modal-description" className={base.modalDescription}>선택하신 쿠폰을 삭제하시겠습니까?</p>
            <ButtonGroup variant="text" aria-label="text primary button group">
              <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={deleteCouponHandler}>예</ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={handleClose}>아니요</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* 쿠폰 삭제 모달 */}
      {isLoading ?
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
          <Box className={base.loadingWrap}>
            <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
          </Box>
        </MainBox>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
          <Box mt={1} />
          {lists && lists.length > 0 &&
            <Grid container spacing={3} style={{ minHeight: 520 }}>
              {lists.map((list, index) => (
                <Grid key={list.cz_no} item xs={12} sm={6} md={6} style={{ position: 'relative' }} alignContent='baseline'>
                  <Paper className={clsx(base.paper, coupon.gradient)} style={{ textAlign: 'left', borderWidth: 1, borderStyle: 'dotted', borderColor: '#c4c4c4', padding: '5px 16px 12px' }}>
                    <Typography variant="subtitle1" component="p" style={{ marginBottom: 5, textAlign: 'center', fontSize: 18, fontWeight: 500, color: theme.palette.primary.contrastText }}>{list.cz_subject}</Typography>
                    <Box component="article" className={coupon.couponBox}>
                      <Typography variant="subtitle1" component="p" style={{ position: 'absolute', top: -16, color: theme.palette.info.main }}>✂</Typography>
                      {list.cz_price_type === '1' ?
                        <Typography variant="h6" component='p' fontWeight='bold' className={coupon.couponPrice}>{list.cz_price}%</Typography>
                        :
                        <Typography variant="h6" component='p' fontWeight='bold' className={coupon.couponPrice}>{Api.comma(list.cz_price)}원</Typography>
                      }
                    </Box>
                    <Box mb={0.5}>
                      <Typography variant="body1" component="p" style={{ fontSize: 13, marginBottom: 5 }}>{`최소주문금액 : ${Api.comma(list.cz_minimum)}원`}</Typography>
                      {/* <Typography variant="body1" component="p" style={{ fontSize: 13, marginBottom: 5 }}>{`최대주문금액 ${Api.comma(list.cz_maximum)}원`}</Typography> */}
                    </Box>
                    <Box display='flex' flexDirection='row'>
                      <Typography variant="body1" component="p" style={{ fontSize: 13 }}>쿠폰사용기간&nbsp;:&nbsp;</Typography>
                      <Typography variant="body1" component="p" style={{ fontSize: 13 }}>{`${list.cz_start} - ${list.cz_end}`}</Typography>
                    </Box>

                    <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{ marginTop: 10, width: '100%' }}>
                      <Button color='primary' variant='contained' style={{ flex: 1, boxShadow: 'none' }} onClick={() => history.push({
                        pathname: `/coupon_edit/${list.cz_no}`,
                        state: { item: list }
                      })}>수정</Button>
                      <Button color='secondary' variant='contained' style={{ flex: 1, boxShadow: 'none' }} onClick={() => deleteCouponConfirmHandler(list.cz_no)}>삭제</Button>
                    </ButtonGroup>

                  </Paper>
                </Grid>
              )
              )}

            </Grid>
          }
          {lists.length === 0 || lists === null ?
            <Box style={{ display: 'flex', flex: 1, height: 'calc(100vh - 160px)', justifyContent: 'center', alignItems: 'center' }}>
              <Typography style={{ fontSize: 15 }}>등록된 쿠폰이 없습니다.</Typography>
            </Box>
            : null}
          {totalCount ?
            <Box mt={3} display='flex' justifyContent='center' alignSelf="center">
              <Stack spacing={2}>
                <Pagination
                  color="primary"
                  count={totalCount}
                  defaultPage={1}
                  showFirstButton
                  showLastButton
                  onChange={pageHandleChange}
                  page={currentPage}
                />
                {/* 
                토탈 페이지수 = count
                초기 페이지 번호 = defaultPage
              */}
              </Stack>
            </Box>
            : null}
        </MainBox>
      }
    </Box>
  );
}