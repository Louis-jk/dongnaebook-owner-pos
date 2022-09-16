import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux';
import MomentUtils from '@date-io/moment';
import moment from "moment";
import "moment/locale/ko";
import { ko } from "date-fns/esm/locale";
import clsx from 'clsx';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { alpha } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import Select, { SelectChangeEvent } from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import Stack from '@material-ui/core/Stack';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DateRangePicker, { DateRange } from '@material-ui/lab/DateRangePicker';
import { koKR } from '@material-ui/core/locale';

// Local Component
import Header from '../components/Header';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';

type DiscountType = 'currency' | 'ratio'; // 할인금액 | 할인율


export default function CouponEdit(props: any) {

  console.log("coupon edit props", props);

  const base = baseStyles();
  const history = useHistory();

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const [type, setType] = useState(''); // 쿠폰 사용범위
  const [name, setName] = useState(''); // 쿠폰명
  const [minPrice, setMinPrice] = useState(''); // 최소주문금액
  const [maxPrice, setMaxPrice] = useState(''); // 최대주문금액
  const [discountPrice, setDiscountPrice] = useState(''); // 할인금액 or 비율 값
  const [discountType, setDiscountType] = useState<DiscountType>('currency'); // 할인금액 or 비율 선택
  const [duration, setDuration] = useState(''); // 쿠폰사용기한
  const [value, setValue] = useState<DateRange<Date>>([null, null]); // 쿠폰 다운로드 유효기간
  const discountRef = useRef<HTMLDivElement | null>(null); //

  // 쿠폰 사용범위 셀렉트 핸들러
  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  useEffect(() => {
    setType(props.location.state.item.cz_type);
    setName(props.location.state.item.cz_subject);
    setMinPrice(props.location.state.item.cz_minimum);
    setMaxPrice(props.location.state.item.cz_maximum);
    setDiscountPrice(props.location.state.item.cz_price);
    if (props.location.state.item.cz_price_type === '0') {
      setDiscountType('currency');
    } else {
      setDiscountType('ratio');
    }
    setDuration(props.location.state.item.cz_period);
    let dateValue: any = [];
    dateValue.push(new Date(props.location.state.item.cz_start));
    dateValue.push(new Date(props.location.state.item.cz_end));

    setValue(dateValue);

  }, [props.location.state.item])



  // 할인금액, 할인율 change 핸들러
  const onDiscountHandler = (type: string) => {
    if (type === 'currency') {
      const re = /^0.+$/;
      if (re.test(discountPrice)) {
        setToastState({ msg: '할인금액을 올바르게 입력해주세요.', severity: 'info' });
        handleOpenAlert();
        setDiscountPrice('');
        setDiscountType('currency');
        discountRef.current?.focus();
      } else {
        setDiscountType('currency');
      }
    } else {
      let toNumber = Number(discountPrice);
      if (toNumber > 100) {
        setToastState({ msg: '할인율을 올바르게 입력해주세요.', severity: 'info' });
        handleOpenAlert();
        setDiscountPrice('');
        setDiscountType('ratio');
        discountRef.current?.focus();
      } else {
        setDiscountType('ratio');
      }
    }
  }

  // Toast(Alert) 관리
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

  // 쿠폰 수정하기
  const editCouponHandler = () => {
    let startDateFormat = moment(value[0]).format('YYYY-MM-DD');
    let endDateFormat = moment(value[1]).format('YYYY-MM-DD');

    // let startDateFormat = moment(selectedDate01).format('YYYY-MM-DD');
    // let endDateFormat = moment(selectedDate02).format('YYYY-MM-DD');
    // let toIntDiscountPrice = parseInt(discountPrice);
    let discountTypeFormat;
    if (discountType === 'currency') {
      discountTypeFormat = '0';
    } else {
      discountTypeFormat = '1';
    }

    let param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      cz_no: props.location.state.item.cz_no,
      cz_type: type,
      cz_subject: name,
      cz_start: startDateFormat,
      cz_end: endDateFormat,
      cz_period: duration,
      cz_price: discountPrice,
      cz_price_type: discountTypeFormat,
      cz_minimum: minPrice,
      cz_maximum: maxPrice
    };

    Api.send('store_couponzone_update', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        setToastState({ msg: '쿠폰이 수정 되었습니다.', severity: 'success' });
        handleOpenAlert();
        setTimeout(() => {
          history.push('/coupons');
        }, 500);
      } else {
        setToastState({ msg: '쿠폰을 수정하는 중에 오류가 발생하였습니다.\n관리자에게 문의해주세요.', severity: 'error' });
        handleOpenAlert();
      }
    });
  }

  const editCouponConfirmHandler = () => {
    if (type === null || type === '') {
      setToastState({ msg: '사용범위(쿠폰타입)를 선택해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (name === null || name === '') {
      setToastState({ msg: '쿠폰명을 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (minPrice === null || minPrice === '') {
      setToastState({ msg: '최소주문금액을 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    }
    // else if (maxPrice === null || maxPrice === '') {
    //   setToastState({ msg: '최대주문금액을 입력해주세요.', severity: 'error' });
    //   handleOpenAlert();
    // } 
    else if (discountPrice === null || discountPrice === '' || discountPrice === '0') {
      if (discountType === 'currency') {
        setToastState({ msg: '할인금액 입력해주세요.', severity: 'error' });
        handleOpenAlert();
      } else {
        setToastState({ msg: '할인율을 입력해주세요.', severity: 'error' });
        handleOpenAlert();
      }
    } else if (value[0] === null) {
      setToastState({ msg: '다운로드 유효기간 시작날짜를 지정해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (value[1] === null) {
      setToastState({ msg: '다운로드 유효기간 종료날짜를 지정해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (duration === null || duration === '') {
      setToastState({ msg: '쿠폰사용기한을 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    }
    // else if (Number(minPrice) > Number(maxPrice)) {
    //   setToastState({ msg: '최소주문금액이 최대주문금액보다 높을 수 없습니다.', severity: 'error' });
    //   handleOpenAlert();
    // } 
    else {
      editCouponHandler();
    }
  }

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const stateInitializeHandler = () => {
    setType('');
    setName('');
    setMinPrice('');
    setMaxPrice('');
    setDiscountPrice('');
    setDiscountType('currency');
    setDuration('');
    setValue([null, null]);
  }

  const reAddHandler = () => {
    // history.push('/couponAdd');
    stateInitializeHandler();
    handleClose();
  }

  const goBackList = () => {
    history.push('/coupons');
    handleClose();
  }

  return (
    <Box component="div" className={base.root}>
      <Header type="couponEdit" action={editCouponConfirmHandler} />
      <div className={base.alert}>
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
      </div>
      {/* 쿠폰 입력 완료 모달 */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={open}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={base.modalInner}>
            <h2 id="transition-modal-title" className={base.modalTitle}>쿠폰 등록 성공!</h2>
            <p id="transition-modal-description" className={base.modalDescription}>쿠폰을 추가로 등록하시겠습니까?</p>
            <ButtonGroup variant="text" aria-label="text primary button group">
              <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={reAddHandler}>추가 등록하기</ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={goBackList}>아니요</ModalCancelButton>
            </ButtonGroup>
          </div>
        </Fade>
      </Modal>
      {/* // 쿠폰 입력 완료 모달 */}

      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
        <Box style={{ marginBottom: 20 }}>
          <Typography variant="h5" component="h5">쿠폰 수정</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">사용범위</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="사용범위"
                onChange={handleChange}
              >
                <MenuItem value={'0'}>모두 사용가능</MenuItem>
                <MenuItem value={'1'}>포장용 쿠폰</MenuItem>
                <MenuItem value={'2'}>배달용 쿠폰</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              value={name}
              fullWidth
              id="outlined-basic"
              label="쿠폰명"
              variant="outlined"
              required
              onChange={e => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              value={minPrice}
              fullWidth
              label="최소주문금액"
              variant="outlined"
              required
              onChange={e => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === '' || re.test(e.target.value)) {
                  let changed = e.target.value.replace(/(^0+)/, '');
                  setMinPrice(changed);
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">원</InputAdornment>,
              }}
            />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <TextField
              value={maxPrice}
              fullWidth
              label="최대주문금액"
              variant="outlined"
              required
              onChange={e => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === '' || re.test(e.target.value)) {
                  let changed = e.target.value.replace(/(^0+)/, '');
                  setMaxPrice(changed);
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">원</InputAdornment>,
              }}
            />
          </Grid> */}
          <Grid item xs={12} md={6}>
            <TextField
              inputRef={discountRef}
              value={discountPrice}
              id="outlined-basic"
              label={discountType === 'currency' ? '할인금액' : '할인율'}
              variant="outlined"
              required
              style={{ width: 'auto', marginRight: 10 }}
              onChange={e => {
                if (discountType === 'currency') {
                  const re = /^[0-9\b]+$/;
                  if (e.target.value === '' || re.test(e.target.value)) {
                    let changed = e.target.value.replace(/(^0+)/, '');
                    setDiscountPrice(changed);
                  }
                } else {
                  const re = /^[0-9.\b]+$/;
                  if (e.target.value === '' || re.test(e.target.value)) {
                    let changed = e.target.value.replace(/(^0+)/, '');
                    console.log(changed);
                    console.log("changed type", typeof changed);
                    let toNumValue = Number(changed);
                    if (toNumValue > 99) {
                      setToastState({ msg: '할인율은 100%이상 될 수 없습니다.', severity: 'error' });
                      handleOpenAlert();
                    } else {
                      setDiscountPrice(changed);
                    }
                  }
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">{discountType === 'currency' ? '원' : '%'}</InputAdornment>,
              }}
            />
            <ButtonGroup variant="text" aria-label="text primary button group">
              <Button
                variant="outlined"
                style={{
                  height: 56,
                  width: 56,
                  fontWeight: 'bold',
                  color: discountType === 'currency' ? '#fff' : theme.palette.primary.main,
                  backgroundColor: discountType === 'currency' ? theme.palette.primary.main : '#fff',
                }}
                onClick={() => onDiscountHandler('currency')}>
                원
              </Button>
              <Button
                variant="outlined"
                style={{
                  height: 56,
                  width: 56,
                  fontWeight: 'bold',
                  color: discountType === 'ratio' ? '#fff' : theme.palette.primary.main,
                  backgroundColor: discountType === 'ratio' ? theme.palette.primary.main : '#fff',
                }}
                onClick={() => onDiscountHandler('ratio')}>
                %
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12} md={12} mb={3}>
            <p className={base.mb20}>다운로드 유효기간</p>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
              <DateRangePicker
                okText="확인"
                cancelText="취소"
                clearText="클리어"
                startText="시작날짜"
                endText="종료날짜"
                calendars={2}
                value={value}
                inputFormat='yyyy.MM.dd'
                minDate={new Date()}
                onChange={(newValue) => {
                  console.log("newValue", newValue);
                  setValue(newValue);
                }}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps}
                      id="date"
                      label="시작날짜"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <Box sx={{ mx: 2 }}> 부터 </Box>
                    <TextField {...endProps}
                      id="date"
                      label="종료날짜"
                      type="date"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </>
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              value={duration}
              fullWidth
              name="numberformat"
              id="outlined-basic"
              label="쿠폰사용기한"
              variant="outlined"
              required
              onChange={e => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === '' || re.test(e.target.value)) {
                  let changed = e.target.value.replace(/(^0+)/, '');
                  setDuration(changed);
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">일</InputAdornment>,
                // inputComponent: NumberFormatCustom as any,
              }}
            />
            <FormHelperText id="outlined-weight-helper-text">쿠폰사용 가능한 기간을 입력해주세요.</FormHelperText>
            <FormHelperText id="outlined-weight-helper-text">{`예:) 15일일 경우 -> 15`}</FormHelperText>
            <FormHelperText id="outlined-weight-helper-text">{`예:) 30일일 경우 -> 30`}</FormHelperText>
          </Grid>
        </Grid>

      </MainBox>
    </Box>

  )
}