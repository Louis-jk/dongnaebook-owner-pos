import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import UploadIcon from '@mui/icons-material/Upload';
import PlusOneRoundedIcon from '@mui/icons-material/PlusOneRounded';

// Local Component
import Header from '../components/Header';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';
import appRuntime from '../appRuntime';
import clsx from 'clsx';
import * as loginAction from '../redux/actions/loginAction';

interface IProps {
  props: object;
}
interface IOption {
  [key: string]: string
}

interface IStoreInfo {
  do_jumju_introduction: string;
  do_jumju_info: string;
  do_jumju_guide: string;
  do_jumju_menu_info: string;
  do_major_menu: string;
  do_jumju_origin: string;
  do_jumju_origin_use: string;
  do_take_out: string;
  do_coupon_use: string;
  do_delivery_guide: string;
  do_delivery_time: string;
  do_cooking_time: string;
  do_end_state: string;
  mt_sound: string;
  mt_print: string;
  mb_one_saving: string;
  pic: string[];
}



export default function StoreInfo(props: IProps) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const base = baseStyles();
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

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

  // 매장소개 정보
  const [storeInit, setStoreInit] = React.useState(false); // 매장 정보 초기값 유무
  const [info, setInfo] = React.useState<IStoreInfo>({
    do_jumju_introduction: '', // 매장소개
    do_jumju_info: '', // ??
    do_jumju_guide: '', // 안내 및 혜택
    do_jumju_menu_info: '', // 메뉴 소개
    do_major_menu: '', // 대표메뉴
    do_jumju_origin: '', // 원산지 안내
    do_jumju_origin_use: '', // 원산지 표시 유무
    do_take_out: '', // 포장 가능 유무
    do_coupon_use: '', // 쿠폰 사용 유무
    do_delivery_guide: '', // 배달 안내
    do_delivery_time: '', // 평균 배달 시간
    do_cooking_time: '', // 평균 조리시간
    do_end_state: '', // 주문마감
    mt_sound: '', // 알림 횟수
    mt_print: '', // 주문 접수시 자동프린트 유무 (1: true / 0: false)
    mb_one_saving: '', // 1인분 가능
    pic: [] // 대표 이미지
  });

  const getStoreInfo = () => {

    setLoading(true);

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
    };

    Api.send('store_guide', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log('====================================');
        console.log('매장소개 arrItems', arrItems);
        console.log('====================================');
        setStoreInit(true);
        setInfo({
          do_jumju_introduction: arrItems.do_jumju_introduction,
          do_jumju_info: arrItems.do_jumju_info,
          do_jumju_guide: arrItems.do_jumju_guide,
          do_jumju_menu_info: arrItems.do_jumju_menu_info,
          do_major_menu: arrItems.do_major_menu,
          do_jumju_origin: arrItems.do_jumju_origin,
          do_jumju_origin_use: arrItems.do_jumju_origin_use,
          do_take_out: arrItems.do_take_out,
          do_coupon_use: arrItems.do_coupon_use,
          do_delivery_guide: arrItems.do_delivery_guide,
          do_delivery_time: arrItems.do_delivery_time,
          do_cooking_time: arrItems.do_cooking_time,
          do_end_state: arrItems.do_end_state,
          mt_sound: arrItems.mt_sound,
          mt_print: arrItems.mt_print,
          mb_one_saving: arrItems.mb_one_saving,
          pic: arrItems.pic
        });

        setDetailImgs01(arrItems.pic[0].img);
        setDetailImgs02(arrItems.pic[1].img);
        setDetailImgs03(arrItems.pic[2].img);
        setDetailImgs04(arrItems.pic[3].img);
        setDetailImgs05(arrItems.pic[4].img);

        setLoading(false);
      } else {
        setStoreInit(false);
        setInfo({
          do_jumju_introduction: '',
          do_jumju_info: '',
          do_jumju_guide: '',
          do_jumju_menu_info: '',
          do_major_menu: '',
          do_jumju_origin: '',
          do_jumju_origin_use: '',
          do_take_out: '',
          do_coupon_use: '',
          do_delivery_guide: '',
          do_delivery_time: '',
          do_cooking_time: '',
          do_end_state: '',
          mt_sound: '',
          mt_print: '',
          mb_one_saving: '',
          pic: []
        });
        setLoading(false);
      }
    });
  };

  React.useEffect(() => {
    getStoreInfo();
  }, [mt_id, mt_jumju_code])

  const updateStoreInfo = () => {

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: storeInit ? 'update' : 'insert',
      // act: 'pos',
      do_jumju_introduction: info.do_jumju_introduction,
      do_jumju_info: info.do_jumju_info,
      do_jumju_guide: info.do_jumju_guide,
      do_jumju_menu_info: info.do_jumju_menu_info,
      do_major_menu: info.do_major_menu,
      do_jumju_origin: info.do_jumju_origin,
      do_jumju_origin_use: info.do_jumju_origin_use,
      do_take_out: info.do_take_out,
      do_coupon_use: info.do_coupon_use,
      do_delivery_guide: info.do_delivery_guide,
      do_delivery_time: info.do_delivery_time,
      do_cooking_time: info.do_cooking_time,
      do_end_state: info.do_end_state,
      mt_sound: info.mt_sound,
      mt_print: info.mt_print,
      mb_one_saving: info.mb_one_saving,
      rt_img_del1: detailImgs01 !== '' ? 0 : 1,
      rt_img_del2: detailImgs02 !== '' ? 0 : 1,
      rt_img_del3: detailImgs03 !== '' ? 0 : 1,
      rt_img_del4: detailImgs04 !== '' ? 0 : 1,
      rt_img_del5: detailImgs05 !== '' ? 0 : 1
    };

    const param2 = {
      rt_img1: fileImgs01 !== null ? fileImgs01 : '',
      rt_img2: fileImgs02 !== null ? fileImgs02 : '',
      rt_img3: fileImgs03 !== null ? fileImgs03 : '',
      rt_img4: fileImgs04 !== null ? fileImgs04 : '',
      rt_img5: fileImgs05 !== null ? fileImgs05 : '',
    };
    console.log("param", param);
    console.log("param2", param2);

    Api.send3('store_guide_update', param, param2, (args: any) => {

      console.log('response args ::', args);

      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      console.log("resultItemresultItem", resultItem);
      console.log("resultItem arrItems >>>", arrItems);

      if (resultItem.result === 'Y') {

        // console.log('메뉴 수정 arrItems', arrItems);

        dispatch(loginAction.updateNotify(info.mt_sound));
        dispatch(loginAction.updateAutoPrint(info.mt_print));
        if (storeInit) {
          setToastState({ msg: '매장소개가 수정 되었습니다.', severity: 'success' });
          handleOpenAlert();
        } else {
          setToastState({ msg: '매장소개가 등록 되었습니다.', severity: 'success' });
          handleOpenAlert();
        }

      } else {
        if (storeInit) {
          setToastState({ msg: '매장소개를 수정하는 중에 오류가 발생하였습니다.\n관리자에게 문의해주세요.', severity: 'error' });
          handleOpenAlert();
        } else {
          setToastState({ msg: '매장소개를 등록하는 중에 오류가 발생하였습니다.\n관리자에게 문의해주세요.', severity: 'error' });
          handleOpenAlert();
        }
      }
    });
  }

  // 이미지 업로드
  const [sources, setSources] = useState<Array<any>>([]);
  const [detailImgs, setDetailImgs] = useState<Array<any>>([]);

  const [fileImgs01, setFileImgs01] = useState(null); //File 대표이미지01
  const [fileImgs02, setFileImgs02] = useState(null); //File 대표이미지02
  const [fileImgs03, setFileImgs03] = useState(null); //File 대표이미지03
  const [fileImgs04, setFileImgs04] = useState(null); //File 대표이미지04
  const [fileImgs05, setFileImgs05] = useState(null); //File 대표이미지05

  const [detailImgs01, setDetailImgs01] = useState(''); //base64 대표이미지01
  const [detailImgs02, setDetailImgs02] = useState(''); //base64 대표이미지02
  const [detailImgs03, setDetailImgs03] = useState(''); //base64 대표이미지03
  const [detailImgs04, setDetailImgs04] = useState(''); //base64 대표이미지04
  const [detailImgs05, setDetailImgs05] = useState(''); //base64 대표이미지05

  const setImageIndex = (index: number) => {
    console.log('setImageIndex', index);
  }

  // 이미지 다중업로드
  const handleImageUpload = (evt: any, index: number) => {

    console.log('이미지 업로드 evt', evt);
    console.log('setImageIndex >>>', index);

    const img: any = evt.target.files[0];

    // sources[index] = img;

    if (index === 0) {
      setFileImgs01(img);
    } else if (index === 1) {
      setFileImgs02(img);
    } else if (index === 2) {
      setFileImgs03(img);
    } else if (index === 3) {
      setFileImgs04(img);
    } else if (index === 4) {
      setFileImgs05(img);
    } else {
      return false;
    }

    if (evt.target.files.length) {
      let file = (evt.target.files)[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);
      let base64Img = '';
      reader.onload = (e: any) => {
        if (index === 0) {
          setDetailImgs01(e.target.result);
        } else if (index === 1) {
          setDetailImgs02(e.target.result);
        } else if (index === 2) {
          setDetailImgs03(e.target.result);
        } else if (index === 3) {
          setDetailImgs04(e.target.result);
        } else if (index === 4) {
          setDetailImgs05(e.target.result);
        } else {
          return false;
        }
        // detailImgs[index] = (e.target.result);
        // setDetailImgs(detailImgs);
      }
    } else {
      return false;
    }

  };

  // console.log('detailImgs01', detailImgs01);
  // console.log('detailImgs02', detailImgs02);
  // console.log('detailImgs03', detailImgs03);
  // console.log('detailImgs04', detailImgs04);
  // console.log('detailImgs05', detailImgs05);


  // 이미지 추가 업로드
  const handleImageAddUpload = (evt: any) => {

    const img = evt.target.files[0];

    let typeArr: string[] = img.type.split('/');

    if (typeArr[0] !== 'image') {
      setToastState({ msg: '이미지 파일만 업로드 하실 수 있습니다.', severity: 'error' });
      handleOpenAlert();
      return false;
    } else if (typeArr[1] !== 'jpg' && typeArr[1] !== 'jpeg' && typeArr[1] !== 'png' && typeArr[1] !== 'bmp') {
      setToastState({ msg: '이미지 확장자를 확인해주세요.', severity: 'error' });
      handleOpenAlert();
    } else {
      setSources(prev => [...prev, img]);

      if (evt.target.files.length) {
        let file = (evt.target.files)[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          setDetailImgs(prev => [...prev, e.target.result]);
        }
      } else {
        return false;
      }
    }
  }

  // console.log('이미지 소스 ::: ', sources);
  // console.log('이미지 재구성 ::: ', detailImgs);


  // 이미지 삭제
  const deleteItemImg = (index: number) => {

    // sources[index] = null;

    if (index === 0) {
      setDetailImgs01('');
      setFileImgs01(null);
    } else if (index === 1) {
      setDetailImgs02('');
      setFileImgs02(null);
    } else if (index === 2) {
      setDetailImgs03('');
      setFileImgs03(null);
    } else if (index === 3) {
      setDetailImgs04('');
      setFileImgs04(null);
    } else if (index === 4) {
      setDetailImgs05('');
      setFileImgs05(null);
    } else {
      return false;
    }
  }

  console.log('detailImgs', detailImgs);

  return (
    <Box component="div" className={base.root}>
      <Header type="storeInfo" action={updateStoreInfo} />
      <Box className={base.alert}>
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
      {isLoading ?
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
          <Box className={base.loadingWrap}>
            <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
          </Box>
        </MainBox>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
          <Box mt={1.5} />
          <Grid container spacing={3}>

            {/* 대표 이미지 업로드 */}
            <Grid item xs={12} md={12}>
              <Box mb={0.5} style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
              }}>
                <Typography variant='body1' mr={0.5}>매장 대표 이미지</Typography>
                <Typography variant='body1' fontSize={12} color='#FFA400' mr={0.5}>(총 5장까지 업로드 가능)</Typography>
                <Typography variant='body1' fontSize={12} color='#FFA400' mr={0.5}>※ 이미지는 4:3 비율을 권장합니다.</Typography>
                {/* <div onMouseOver={() => alert('hi')} onTouchStart={() => alert('are you Touched?')}>
                  <img src='/images/ico_question_tooltip.png' style={{ width: 20, height: 20, objectFit: 'cover' }} alt='대표이미지 안내' title='대표이미지 안내' />
                </div> */}
              </Box>
              <Box style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
              }}>
                {
                  detailImgs01 ? (
                    <Box style={{ position: 'relative', width: '20%', height: '120px', marginLeft: 0 }}>
                      <img src={detailImgs01} style={{ width: '100%', height: '100%', borderRadius: 5, objectFit: 'cover' }} />
                      <Box className='delete-btn' onClick={() => deleteItemImg(0)}>
                        <img src='images/close_wh.png' style={{ position: 'absolute', top: 5, right: 5, width: 12, height: 12, objectFit: 'scale-down', padding: 5, backgroundColor: '#222', borderRadius: 20 }} />
                      </Box>
                    </Box>
                  ) : (
                    <Box display='flex' justifyContent='center' alignItems='center' style={{ width: '20%', height: '120px', borderRadius: 5, backgroundColor: '#efefef', marginLeft: '5px' }}>
                      <label htmlFor={`upload_img01`} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{`대표이미지 01`}</label>
                      <input id={`upload_img01`} accept='image/*' type='file' onChange={e => handleImageUpload(e, 0)} />
                    </Box>
                  )
                }
                {
                  detailImgs02 ? (
                    <Box style={{ position: 'relative', width: '20%', height: '120px', marginLeft: 5 }}>
                      <img src={detailImgs02} style={{ width: '100%', height: '100%', borderRadius: 5, objectFit: 'cover' }} />
                      <Box className='delete-btn' onClick={() => deleteItemImg(1)}>
                        <img src='images/close_wh.png' style={{ position: 'absolute', top: 5, right: 5, width: 12, height: 12, objectFit: 'scale-down', padding: 5, backgroundColor: '#222', borderRadius: 20 }} />
                      </Box>
                    </Box>
                  ) : (
                    <Box display='flex' justifyContent='center' alignItems='center' style={{ width: '20%', height: '120px', borderRadius: 5, backgroundColor: '#efefef', marginLeft: '5px' }}>
                      <label htmlFor={`upload_img02`} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{`대표이미지 02`}</label>
                      <input id={`upload_img02`} accept='image/*' type='file' onChange={e => handleImageUpload(e, 1)} />
                    </Box>
                  )
                }
                {
                  detailImgs03 ? (
                    <Box style={{ position: 'relative', width: '20%', height: '120px', marginLeft: 5 }}>
                      <img src={detailImgs03} style={{ width: '100%', height: '100%', borderRadius: 5, objectFit: 'cover' }} />
                      <Box className='delete-btn' onClick={() => deleteItemImg(2)}>
                        <img src='images/close_wh.png' style={{ position: 'absolute', top: 5, right: 5, width: 12, height: 12, objectFit: 'scale-down', padding: 5, backgroundColor: '#222', borderRadius: 20 }} />
                      </Box>
                    </Box>
                  ) : (
                    <Box display='flex' justifyContent='center' alignItems='center' style={{ width: '20%', height: '120px', borderRadius: 5, backgroundColor: '#efefef', marginLeft: '5px' }}>
                      <label htmlFor={`upload_img03`} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{`대표이미지 03`}</label>
                      <input id={`upload_img03`} accept='image/*' type='file' onChange={e => handleImageUpload(e, 2)} />
                    </Box>
                  )
                }
                {
                  detailImgs04 ? (
                    <Box style={{ position: 'relative', width: '20%', height: '120px', marginLeft: 5 }}>
                      <img src={detailImgs04} style={{ width: '100%', height: '100%', borderRadius: 5, objectFit: 'cover' }} />
                      <Box className='delete-btn' onClick={() => deleteItemImg(3)}>
                        <img src='images/close_wh.png' style={{ position: 'absolute', top: 5, right: 5, width: 12, height: 12, objectFit: 'scale-down', padding: 5, backgroundColor: '#222', borderRadius: 20 }} />
                      </Box>
                    </Box>
                  ) : (
                    <Box display='flex' justifyContent='center' alignItems='center' style={{ width: '20%', height: '120px', borderRadius: 5, backgroundColor: '#efefef', marginLeft: '5px' }}>
                      <label htmlFor={`upload_img04`} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{`대표이미지 04`}</label>
                      <input id={`upload_img04`} accept='image/*' type='file' onChange={e => handleImageUpload(e, 3)} />
                    </Box>
                  )
                }
                {
                  detailImgs05 ? (
                    <Box style={{ position: 'relative', width: '20%', height: '120px', marginLeft: 5 }}>
                      <img src={detailImgs05} style={{ width: '100%', height: '100%', borderRadius: 5, objectFit: 'cover' }} />
                      <Box className='delete-btn' onClick={() => deleteItemImg(4)}>
                        <img src='images/close_wh.png' style={{ position: 'absolute', top: 5, right: 5, width: 12, height: 12, objectFit: 'scale-down', padding: 5, backgroundColor: '#222', borderRadius: 20 }} />
                      </Box>
                    </Box>
                  ) : (
                    <Box display='flex' justifyContent='center' alignItems='center' style={{ width: '20%', height: '120px', borderRadius: 5, backgroundColor: '#efefef', marginLeft: '5px' }}>
                      <label htmlFor={`upload_img05`} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{`대표이미지 05`}</label>
                      <input id={`upload_img05`} accept='image/*' type='file' onChange={e => handleImageUpload(e, 4)} />
                    </Box>
                  )
                }
              </Box>
            </Grid>
            {/* // 대표 이미지 업로드 */}

            <Grid item xs={12} md={6}>
              <TextField
                value={info.do_jumju_introduction === null || info.do_jumju_introduction === undefined ? '' : info.do_jumju_introduction}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="매장소개"
                multiline
                rows={5}
                placeholder="매장소개를 작성해주세요."
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setInfo({
                  ...info,
                  do_jumju_introduction: e.target.value as string
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={info.do_delivery_guide === null || info.do_delivery_guide === undefined ? '' : info.do_delivery_guide}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="배달팁 안내"
                multiline
                rows={5}
                placeholder="배달팁 안내를 작성해주세요."
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setInfo({
                  ...info,
                  do_delivery_guide: e.target.value as string
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={info.do_jumju_menu_info === null || info.do_jumju_menu_info === undefined ? '' : info.do_jumju_menu_info}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="메뉴소개"
                multiline
                rows={9}
                placeholder="메뉴소개를 작성해주세요."
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setInfo({
                  ...info,
                  do_jumju_menu_info: e.target.value as string
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={info.do_major_menu === null || info.do_major_menu === undefined ? '' : info.do_major_menu}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="대표메뉴"
                multiline
                rows={2}
                placeholder="대표메뉴를 작성해주세요."
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setInfo({
                  ...info,
                  do_major_menu: e.target.value as string
                })}
              />
              <Typography variant="caption" color="primary">※ 대표메뉴가 여러개일 경우, 쉼표(,)로 구분하여 입력해주세요.</Typography>
              <div style={{ marginTop: 10, marginBottom: 20 }}></div>
              <TextField
                value={info.do_jumju_origin === null || info.do_jumju_origin === undefined ? '' : info.do_jumju_origin}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="원산지 안내"
                multiline
                rows={4}
                placeholder="원산지 안내를 작성해주세요."
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setInfo({
                  ...info,
                  do_jumju_origin: e.target.value as string
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={info.do_delivery_time === null || info.do_delivery_time === undefined ? '' : info.do_delivery_time}
                fullWidth
                id="outlined-basic"
                label="평균 배달시간"
                variant="outlined"
                placeholder="평균 배달시간을 입력해주세요."
                InputLabelProps={{
                  shrink: true
                }}
                // InputProps={{
                //   endAdornment: <InputAdornment position="end">분</InputAdornment>,
                // }}
                onChange={e => setInfo({
                  ...info,
                  do_delivery_time: e.target.value as string
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={info.do_cooking_time === null || info.do_cooking_time === undefined ? '' : info.do_cooking_time}
                fullWidth
                id="outlined-basic"
                label="평균 조리시간"
                variant="outlined"
                placeholder="평균 조리시간을 입력해주세요."
                InputLabelProps={{
                  shrink: true
                }}
                // InputProps={{
                //   endAdornment: <InputAdornment position="end">분</InputAdornment>,
                // }}
                onChange={e => setInfo({
                  ...info,
                  do_cooking_time: e.target.value as string
                })}
              />
            </Grid>
            {/* <Button variant="contained" color="primary" fullWidth>등록하기</Button> */}
          </Grid>
          <Box className={clsx(base.mb10, base.mt20)}></Box>
          {/* 매장 설정 신규 페이지 생성으로 일단 주석처리
          <Grid item xs={12} md={6} mb={2}>
            <Typography fontWeight='bold'>알림 설정</Typography>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'1'}
                  checked={info.mt_sound === '1' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="1회 알림"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setInfo({
                      ...info,
                      mt_sound: '1'
                    });
                    appRuntime.send('sound_count', '1');
                  }}
                />
                <FormControlLabel
                  value={'2'}
                  checked={info.mt_sound === '2' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="2회 알림"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setInfo({
                      ...info,
                      mt_sound: '2'
                    });
                    appRuntime.send('sound_count', '2');
                  }}
                />
                <FormControlLabel
                  value={'3'}
                  checked={info.mt_sound === '3' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="3회 알림"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setInfo({
                      ...info,
                      mt_sound: '3'
                    });
                    appRuntime.send('sound_count', '3');
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} mb={2}>
            <Typography fontWeight='bold'>주문 접수시 자동 프린트 여부</Typography>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'1'}
                  checked={info.mt_print === '1' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="자동출력"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setInfo({
                      ...info,
                      mt_print: '1'
                    });
                  }}
                />
                <FormControlLabel
                  value={'0'}
                  checked={info.mt_print === '0' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="출력안함"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setInfo({
                      ...info,
                      mt_print: '0'
                    });
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} mb={2}>
            <Typography fontWeight='bold'>주문 포장 가능 여부</Typography>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'Y'}
                  checked={info.do_take_out === 'Y' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="포장가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={e => setInfo({
                    ...info,
                    do_take_out: 'Y'
                  })}
                />
                <FormControlLabel
                  value={'N'}
                  checked={info.do_take_out === 'N' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="포장불가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={e => setInfo({
                    ...info,
                    do_take_out: 'N'
                  })}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} mb={2}>
            <FormControl component="fieldset">
              <Typography fontWeight='bold'>쿠폰 사용 가능 여부</Typography>
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'Y'}
                  checked={info.do_coupon_use === 'Y' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="쿠폰 사용 가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={e => setInfo({
                    ...info,
                    do_coupon_use: 'Y'
                  })}
                />
                <FormControlLabel
                  value={'N'}
                  checked={info.do_coupon_use === 'N' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="쿠폰 사용 불가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={e => setInfo({
                    ...info,
                    do_coupon_use: 'N'
                  })}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
         */}
        </MainBox>
      }
    </Box >
  );
}