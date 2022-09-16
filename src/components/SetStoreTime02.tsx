import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

// Material UI Components
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { Divider } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ButtonGroup from '@material-ui/core/ButtonGroup';

// Local Component
import Api from '../Api';
import { theme, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';
import { StoreTimeStyles } from '../styles/custom';
import { DayArr, weekArr } from '../assets/datas';


interface IList {
  [key: string]: string;
}

export default function StoreTimeTab01() {

  const base = baseStyles();
  const classes = StoreTimeStyles();
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);

  const [isLoading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<IList>({});
  const [open, setOpen] = React.useState(false); // 정기휴무일 삭제 모달 on/off
  const [openQuestion, setOpenQuestion] = React.useState(false); // 영업시간 적용 범위 질의 모달 on/off
  const [selectDay, setSelectDay] = React.useState<Array<string>>([]); // 선택 요일
  const [selectWeek, setSelectWeek] = React.useState<Array<string>>([]); // 선택 주



  // 요일 선택 핸들러
  const selectDayHandler = (payload: string) => {

    let filtered = selectDay.find(day => day === payload);

    if (filtered) {
      let removeObj = selectDay.filter(day => day !== payload);
      setSelectDay(removeObj);
    } else {
      let result = selectDay.concat(payload);
      setSelectDay(result);
    }
  };

  // 주 선택 핸들러
  const selectWeekHandler = (payload: string) => {
    let filtered = selectWeek.find(week => week === payload);

    if (filtered) {
      let removeObj = selectWeek.filter(week => week !== payload);
      setSelectWeek(removeObj);
    } else {
      let result = selectWeek.concat(payload);
      setSelectWeek(result);
    }
  }

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


  // 정기 휴무일 가져오기
  const getStoreClosingDay = () => {
    setLoading(true);

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'list'
    };


    Api.send('store_regular_hoilday', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        setList(arrItems[0]);
        setLoading(false);
      } else {
        setList({});
        setLoading(false);
      }
    });
  }

  // 삭제 전 모달
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteStoreClosingDayHandler = () => {
    handleOpen();
  }

  // 삭제 처리
  const deleteStoreClosingDay = () => {
    setLoading(true);

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'delete',
    };

    Api.send('store_regular_hoilday', param, (args: any) => {

      setLoading(true);

      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        handleClose();
        setToastState({ msg: '정기휴무일을 삭제하였습니다.', severity: 'success' });
        handleOpenAlert();
        getStoreClosingDay();
        setLoading(false);
      } else {
        handleClose();
        setToastState({ msg: '정기휴무일 삭제시 오류가 발생하였습니다.', severity: 'error' });
        handleOpenAlert();
        setLoading(false);
      }
    });
  }

  // 
  const checkHandler = () => {
    if (selectWeek.length < 1) {
      setToastState({ msg: '주를 지정해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (selectDay.length < 1) {
      setToastState({ msg: '요일을 지정해주세요.', severity: 'error' });
      handleOpenAlert();
    } else {
      setOpenQuestion(true);
    }
  }

  // 추가 처리
  const addStoreClosingDay = (type: string) => {

    let sortSelectDay = selectDay.sort();
    let sortSelectWeek = selectWeek.sort();

    let selectDayFormat = sortSelectDay.join();
    let selectWeekFormat = sortSelectWeek.join();


    setLoading(true);

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'update',
      st_yoil: selectDayFormat,
      st_week: selectWeekFormat,
      RangeType: type
    };

    Api.send('store_regular_hoilday', param, (args: any) => {

      setLoading(true);

      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        handleClose();
        setSelectDay([]);
        setSelectWeek([]);
        setToastState({ msg: '정기휴무일을 추가하였습니다.', severity: 'success' });
        handleOpenAlert();
        getStoreClosingDay();
        setOpenQuestion(false);
        setLoading(false);
      } else {
        handleClose();
        setSelectDay([]);
        setSelectWeek([]);
        setToastState({ msg: '정기휴무일 추가시 오류가 발생하였습니다.', severity: 'error' });
        handleOpenAlert();
        setOpenQuestion(false);
        setLoading(false);
      }
    });

  }

  useEffect(() => {
    getStoreClosingDay();
  }, [mt_id, mt_jumju_code]);


  return (
    isLoading ?
      <Box className={base.loadingWrap}>
        <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
      </Box>
      :
      <Box component='section'>
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

        {/* 정기휴무일 삭제 모달 */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={base.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box className={clsx(base.modalInner, base.colCenter)}>
              <h2 id="transition-modal-title" className={base.modalTitle}>정기휴무일 삭제</h2>
              <p id="transition-modal-description" className={base.modalDescription}>정기휴무일을 삭제하시겠습니까?</p>
              <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={deleteStoreClosingDay}>삭제하기</ModalConfirmButton>
                <ModalCancelButton variant="outlined" onClick={handleClose}>취소</ModalCancelButton>
              </ButtonGroup>
            </Box>
          </Fade>
        </Modal>
        {/* // 정기휴무일 삭제 모달 */}

        {/* 정기휴무일 적용 범위 질의 모달 */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={base.modal}
          open={openQuestion}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openQuestion}>
            <Box className={clsx(base.modalInner, base.colCenter)}>
              <h2 id="transition-modal-title" className={base.modalTitle}>정기휴무일 적용 범위</h2>
              <p id="transition-modal-description" className={base.modalDescription}>해당 정기휴무일을 전체 매장에 적용하시겠습니까?</p>
              <ButtonGroup variant="text" color="inherit" aria-label="text primary button group">
                <ModalConfirmButton variant="contained" style={{ boxShadow: 'none', backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }} onClick={() => addStoreClosingDay('all')}>전체 매장에 적용</ModalConfirmButton>
                <ModalConfirmButton variant="contained" style={{ boxShadow: 'none', backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} onClick={() => addStoreClosingDay('curr')}>해당 매장만</ModalConfirmButton>
                <ModalCancelButton variant="outlined" onClick={() => setOpenQuestion(false)}>닫기</ModalCancelButton>
              </ButtonGroup>
            </Box>
          </Fade>
        </Modal>
        {/* // 정기휴무일 적용 범위 질의 모달 */}

        {list !== null && list !== undefined && list.st_week !== null && list.st_yoil_txt !== null ?
          <Box component="article" style={{ margin: '30px 0' }}>
            <Box className={clsx(base.flexRowBetweenCenter)} style={{ margin: '10px 0' }}>
              <Box className={base.flexRowStartCenter}>
                <Box className={clsx(base.flexRow, base.mr10)} style={{ minWidth: 200 }}>
                  <p className={base.mr10} style={{ fontSize: 14, padding: '2px 10px', backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, borderRadius: 5 }}>{list.st_week}</p>
                  <p className={base.mr20}>{list.st_yoil_txt}</p>
                </Box>
              </Box>
              <IconButton color="primary" aria-label="upload picture" component="span" style={{ alignItems: 'flex-end' }} onClick={deleteStoreClosingDayHandler}>
                <HighlightOffIcon color="primary" />
              </IconButton>
            </Box>
          </Box>
          : null}

        {list ?
          <Typography className={base.mb10} style={{ color: '#999', margin: '25px 0 10px' }}>정기 휴무 요일과 주가 설정되어 있습니다.</Typography>
          :
          <Typography className={clsx(classes.pointTxt, base.mb10)} style={{ margin: '25px 0 10px' }}>정기 휴무 요일과 주를 설정하실 수 있습니다.</Typography>
        }
        <FormControl component="fieldset" style={{ marginBottom: 10 }}>
          <FormGroup aria-label="position" row>
            {weekArr && weekArr.map((week, index) => (
              <FormControlLabel
                key={index}
                value={week.key}
                control={
                  <Checkbox style={{ color: list ? '#e5e5e5' : theme.palette.primary.main }} />}
                label={week.value}
                labelPlacement="end"
                onClick={() => {
                  if (list) {
                    return false;
                  } else {
                    selectWeekHandler(week.key)
                  }
                }
                }
                disabled={list ? true : false}
                checked={selectWeek.includes(week.key) ? true : false}
              />
            ))}
          </FormGroup>
        </FormControl>
        <Divider />
        <FormControl component="fieldset" style={{ marginTop: 10, marginBottom: 20 }}>
          <FormGroup aria-label="position" row>
            {DayArr && DayArr.map((day, index) => (
              <FormControlLabel
                key={index}
                value={day.idx}
                control={<Checkbox style={{ color: list ? '#e5e5e5' : theme.palette.primary.main }} />}
                label={day.ko}
                labelPlacement="end"
                onClick={() => {
                  if (list) {
                    return false;
                  }
                  selectDayHandler(day.idx)
                }
                }
                disabled={list ? true : false}
                checked={selectDay.includes(day.idx) ? true : false}
              />
            ))}
          </FormGroup>
        </FormControl>


        {list ?
          <Button disabled className={classes.button} variant="contained" disableElevation>
            저장하기
          </Button>
          :
          <Button className={classes.button} variant="contained" style={{ backgroundColor: theme.palette.primary.main, color: '#fff' }} disableElevation onClick={checkHandler}>
            저장하기
          </Button>
        }

      </Box>
  );
}
