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

  // Toast(Alert) ??????
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

  // ???????????? ??????
  const [storeInit, setStoreInit] = React.useState(false); // ?????? ?????? ????????? ??????
  const [info, setInfo] = React.useState<IStoreInfo>({
    do_jumju_introduction: '', // ????????????
    do_jumju_info: '', // ??
    do_jumju_guide: '', // ?????? ??? ??????
    do_jumju_menu_info: '', // ?????? ??????
    do_major_menu: '', // ????????????
    do_jumju_origin: '', // ????????? ??????
    do_jumju_origin_use: '', // ????????? ?????? ??????
    do_take_out: '', // ?????? ?????? ??????
    do_coupon_use: '', // ?????? ?????? ??????
    do_delivery_guide: '', // ?????? ??????
    do_delivery_time: '', // ?????? ?????? ??????
    do_end_state: '', // ????????????
    mt_sound: '', // ?????? ??????
    mt_print: '', // ?????? ????????? ??????????????? ?????? (1: true / 0: false)
    mb_one_saving: '', // 1?????? ??????
    pic: [] // ?????? ?????????
  });

  const getStoreInfo = () => {

    setLoading(true);

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      // mode: 'pos'
    };

    Api.send('store_guide', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log('====================================');
        console.log('???????????? arrItems', arrItems);
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
          do_end_state: arrItems.do_end_state,
          mt_sound: arrItems.mt_sound,
          mt_print: arrItems.mt_print,
          mb_one_saving: arrItems.mb_one_saving,
          pic: arrItems.pic
        });

        if (arrItems.pic && arrItems.pic.length > 0) {
          arrItems.pic.map((pic: string, index: number) => {

            // let type = pic.slice(pic.lastIndexOf('.')).replace('.', '');
            // let name = pic.slice(pic.lastIndexOf('/')).replace('/', '').split('.')[0];

            let type = pic.slice(pic.lastIndexOf('.')).replace('.', '');
            let name = pic.slice(pic.lastIndexOf('/'));

            // setDetailImgs(prev => [...prev, {
            //   uri: pic,
            //   type,
            //   name,
            // }]);

            setDetailImgs(prev => [...prev, pic]);
          })
        }
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

    const param: any = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: storeInit ? 'update' : 'insert',
      act: 'pos',
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
      do_end_state: info.do_end_state,
      mt_sound: info.mt_sound,
      mt_print: info.mt_print,
      mb_one_saving: info.mb_one_saving,
    };


    // console.log('paramparam', param);

    // ?????? ???????????? ?????? ??????
    let params2: any = {};

    if (detailImgs && detailImgs.length > 0) {
      detailImgs.map((arr, index) => {
        if (index === 4) {
          params2.rt_img5 = arr;
        } else if (index === 3) {
          params2.rt_img4 = arr;
        } else if (index === 2) {
          params2.rt_img3 = arr;
        } else if (index === 1) {
          params2.rt_img2 = arr;
        } else {
          params2.rt_img1 = arr;
        }
      });
    }

    // return false;

    console.log("params2", params2);

    Api.send3('store_guide_update', param, params2, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      console.log("resultItemresultItem", resultItem);

      if (resultItem.result === 'Y') {

        // console.log('?????? ?????? arrItems', arrItems);

        dispatch(loginAction.updateNotify(info.mt_sound));
        dispatch(loginAction.updateAutoPrint(info.mt_print));
        if (storeInit) {
          setToastState({ msg: '??????????????? ?????? ???????????????.', severity: 'success' });
          handleOpenAlert();
        } else {
          setToastState({ msg: '??????????????? ?????? ???????????????.', severity: 'success' });
          handleOpenAlert();
        }

      } else {
        if (storeInit) {
          setToastState({ msg: '??????????????? ???????????? ?????? ????????? ?????????????????????.\n??????????????? ??????????????????.', severity: 'error' });
          handleOpenAlert();
        } else {
          setToastState({ msg: '??????????????? ???????????? ?????? ????????? ?????????????????????.\n??????????????? ??????????????????.', severity: 'error' });
          handleOpenAlert();
        }
      }
    });
  }

  // ????????? ?????????
  const [detailImgs, setDetailImgs] = useState<Array<any>>([]);

  // ????????? ???????????????
  const handleImageUpload = (e: any) => {
    const fileArr = e.target.files;

    let fileURLs: any[] = [];

    let file;
    let filesLength = fileArr.length > 5 ? 5 : fileArr.length;

    if (fileArr.length + detailImgs.length > 5) {
      setToastState({ msg: '?????? ???????????? 5????????? ????????? ???????????????..', severity: 'warning' });
      handleOpenAlert();
    } else {

    }

    for (let i = 0; i < filesLength; i++) {

      file = fileArr[i];

      let reader = new FileReader();

      reader.onload = () => {
        console.log(reader.result);
        fileURLs[i] = reader.result;

        let testArr: any = [];

        console.log("fileURLs", fileURLs);
        console.log("fileURLs[0]", fileURLs[0]);

        // handlingDataForm(fileURLs[0]);



        fileURLs.map((pic: string, index: number) => {
          let type = pic.slice(pic.lastIndexOf('.')).replace('.', '');
          let name = pic.slice(pic.lastIndexOf('/'));
          // let name = pic.slice(pic.lastIndexOf('/')).replace('/', '').split('.')[0];


          // testArr.push({
          //   uri: pic,
          //   type,
          //   name,
          // })
          testArr.push(pic)

          // setDetailImgs(prev => [...prev, {
          //   uri: pic,
          //   type,
          //   name,
          // }]);
        })

        console.log('testArr', testArr);

        const compareArray = (a: any, b: any) => {
          for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b.length; j++) {
              if (a[i].name === b[j].name) {
                console.log('?????? ???', a[i])
                return true;
              } else {
                console.log('?????? ??? ??????')
                return false;
              }
            }
          }
        };

        let checkArr = compareArray(detailImgs, testArr);

        if (!checkArr) {
          // setDetailImgs(prev => [...prev, testArr]);
          let addArr = detailImgs.concat(testArr);
          setDetailImgs(addArr);
        }
        // setDetailImgs([...fileURLs]);
      };


      reader.readAsDataURL(file);
    }
  };

  // const handlingDataForm = async (dataURI: any) => {
  //   // dataURL ?????? data:image/jpeg:base64,~~~~~~~ ????????? ','??? ???????????? ????????? ~~~~~??? ????????? ?????? ?????????
  //   // const byteString = atob(dataURI.split(",")[1]);
  //   // const byteString = dataURI.split(",")[1];
  //   const byteString = dataURI;

  //   console.log('byteString', byteString);
  //   // return false;

  //   // Blob??? ???????????? ?????? ??????, ??? ????????? ?????? ??? ????????? ????????? ???????????? ???????????????.
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);

  //   console.log('ia ???', ia);

  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   const blob = new Blob([ia], {
  //     type: "image/jpeg"
  //   });
  //   const file = new File([blob], "image.jpg");

  //   console.log('file ???', file);

  //   // ??? ????????? ?????? ?????? image?????? FormData??? ???????????????.
  //   // ??????????????? ???????????? ?????? ???, FormData??? ????????? ?????? ????????? ?????????????????????.
  //   const formData = new FormData();
  //   formData.append("representative_avatar", file);

  //   console.log('formData ???', formData);

  //   // // ????????? ??? ???????????????.
  //   // formData.append("name", "nkh");
  //   // formData.append("email", "noh5524@gmail.com");

  //   // try {
  //   //   const changeAvatar = await apis.auth.changeUserAccount(formData);
  //   //   alert(changeAvatar.status);
  //   // } catch (error: any) {
  //   //   alert(error.response.data.errors);
  //   // }
  // };

  // ????????? ?????? ?????????
  const handleImageAddUpload = (e: any) => {
    const fileArr = e.target.files;

    let fileURLs: any[] = [];

    let file;
    let enableArr = (5 - detailImgs.length);

    let filesLength = fileArr.length > enableArr ? enableArr : fileArr.length;

    if (fileArr.length > enableArr) {
      setToastState({ msg: '?????? ???????????? 5????????? ????????? ???????????????.', severity: 'warning' });
      handleOpenAlert();
    }

    for (let i = 0; i < filesLength; i++) {
      file = fileArr[i];

      let reader = new FileReader();
      reader.onload = () => {

        fileURLs[i] = reader.result;

        let newArr = detailImgs.filter(img => img === fileURLs[0]);
        if (newArr && newArr.length > 0) {
          setToastState({ msg: '????????? ???????????? ?????????????????????.', severity: 'warning' });
          handleOpenAlert();
        } else {
          console.log("fileURLs", fileURLs);
          fileURLs.map((pic: string, index: number) => {
            let type = pic.slice(pic.lastIndexOf('.')).replace('.', '');
            let name = pic.slice(pic.lastIndexOf('/')).replace('/', '').split('.')[0];

            // setDetailImgs(prev => [...prev, {
            //   uri: pic,
            //   type,
            //   name,
            // }]);

            setDetailImgs(prev => [...prev, pic]);
          })

          // setDetailImgs(prev => [...prev, ...fileURLs]);
        }
      };
      reader.readAsDataURL(file);
    }

  }

  // ????????? ??????
  const deleteItemImg = (key: number) => {
    let filteredArr = detailImgs.filter((img, index) => index !== key);
    setDetailImgs(filteredArr);
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
          <Box mt={3} />
          <Grid container spacing={3}>

            {/* ?????? ????????? ????????? */}
            <Grid item xs={12} md={12}>
              <Box mb={0.5} style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
              }}>
                <Typography variant='body1' mr={0.5}>?????? ?????? ?????????</Typography>
                <Typography variant='body1' fontSize={12} color='#FFA400' mr={0.5}>(??? 5????????? ????????? ??????)</Typography>
                {/* <div onMouseOver={() => alert('hi')} onTouchStart={() => alert('are you Touched?')}>
                  <img src='/images/ico_question_tooltip.png' style={{ width: 20, height: 20, objectFit: 'cover' }} alt='??????????????? ??????' title='??????????????? ??????' />
                </div> */}
              </Box>
              <Box style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
              }}>
                {detailImgs && detailImgs.length > 1 ? (
                  <Box style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}>
                    {detailImgs.map((itemImg, index) => (
                      <Box style={{ position: 'relative', width: '20%', height: '150px', marginLeft: index === 0 ? 0 : '5px' }}>
                        <img key={`item-image-${index}`} src={itemImg.uri} style={{ width: '100%', height: '100%', borderRadius: 5, objectFit: 'cover' }} />
                        <Box className='delete-btn' onClick={() => deleteItemImg(index)}>
                          <img key={`item-image-delete-${index}`} src='./images/close_wh.png' style={{ position: 'absolute', top: 5, right: 5, width: 12, height: 12, objectFit: 'scale-down', padding: 5, backgroundColor: '#222', borderRadius: 20 }} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) :
                  detailImgs && detailImgs.length == 1 ? (
                    <Box style={{ position: 'relative', width: '20%', height: '150px' }}>
                      <img src={detailImgs[0]} style={{ width: '100%', height: '100%', borderRadius: 5, objectFit: 'cover' }} />
                      <Box className='delete-btn' onClick={() => deleteItemImg(0)}>
                        <img src='/images/close_wh.png' style={{ position: 'absolute', top: 5, right: 5, width: 12, height: 12, objectFit: 'scale-down', padding: 5, backgroundColor: '#222', borderRadius: 20 }} />
                      </Box>
                    </Box>
                  ) :
                    new Array(5).fill(0).map((item, index) => (
                      <Box onChange={handleImageUpload} style={{ position: 'relative', width: '20%', height: '150px', borderRadius: 5, marginLeft: index === 0 ? 0 : '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#efefef' }}>
                        <p style={{ color: '#aaa' }}>{`??????????????? 0${index + 1}`}</p>
                      </Box>
                    ))}
              </Box>
              <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>

                {detailImgs.length >= 5 ?
                  (
                    <>
                      <Box className='custom-file-upload' style={{ backgroundColor: '#ececec' }}>
                        <UploadIcon />
                        ?????? ?????????
                      </Box>
                      <Box className='custom-file-upload' style={{ backgroundColor: '#ececec' }}>
                        <PlusOneRoundedIcon />
                        ??????
                      </Box>
                    </>
                  ) :
                  (
                    <>
                      <label className='custom-file-upload'>
                        <input type='file' accept='image/*' multiple onChange={handleImageUpload} />
                        <UploadIcon />
                        ?????? ?????????
                      </label>
                      <label className='custom-file-upload'>
                        <input type='file' accept='image/*' onChange={handleImageAddUpload} />
                        <PlusOneRoundedIcon />
                        ??????
                      </label>
                    </>
                  )
                }
              </Box>
            </Grid>
            {/* // ?????? ????????? ????????? */}

            <Grid item xs={12} md={6}>
              <TextField
                value={info.do_jumju_introduction === null || info.do_jumju_introduction === undefined ? '' : info.do_jumju_introduction}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="????????????"
                multiline
                rows={5}
                placeholder='??????????????? ??????????????????.'
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
                label="????????? ??????"
                multiline
                rows={5}
                placeholder='????????? ????????? ??????????????????.'
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
                label="????????????"
                multiline
                rows={9}
                placeholder='??????????????? ??????????????????.'
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
                label="????????????"
                multiline
                rows={2}
                placeholder='??????????????? ??????????????????.'
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setInfo({
                  ...info,
                  do_major_menu: e.target.value as string
                })}
              />
              <Typography variant="caption" color="primary">??? ??????????????? ???????????? ??????, ??????(,)??? ???????????? ??????????????????.</Typography>
              <div style={{ marginTop: 10, marginBottom: 20 }}></div>
              <TextField
                value={info.do_jumju_origin === null || info.do_jumju_origin === undefined ? '' : info.do_jumju_origin}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="????????? ??????"
                multiline
                rows={4}
                placeholder='????????? ????????? ??????????????????.'
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
                label="?????? ????????????"
                variant="outlined"
                placeholder="?????? ??????????????? ??????????????????."
                InputLabelProps={{
                  shrink: true
                }}
                // InputProps={{
                //   endAdornment: <InputAdornment position="end">???</InputAdornment>,
                // }}
                onChange={e => setInfo({
                  ...info,
                  do_delivery_time: e.target.value as string
                })}
              />
            </Grid>
            {/* <Button variant="contained" color="primary" fullWidth>????????????</Button> */}
          </Grid>
          <Box className={clsx(base.mb10, base.mt20)}></Box>
          {/* ?????? ?????? ?????? ????????? ???????????? ?????? ????????????
          <Grid item xs={12} md={6} mb={2}>
            <Typography fontWeight='bold'>?????? ??????</Typography>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'1'}
                  checked={info.mt_sound === '1' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="1??? ??????"
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
                  label="2??? ??????"
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
                  label="3??? ??????"
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
            <Typography fontWeight='bold'>?????? ????????? ?????? ????????? ??????</Typography>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'1'}
                  checked={info.mt_print === '1' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="????????????"
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
                  label="????????????"
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
            <Typography fontWeight='bold'>?????? ?????? ?????? ??????</Typography>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'Y'}
                  checked={info.do_take_out === 'Y' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="????????????"
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
                  label="???????????????"
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
              <Typography fontWeight='bold'>?????? ?????? ?????? ??????</Typography>
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'Y'}
                  checked={info.do_coupon_use === 'Y' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="?????? ?????? ??????"
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
                  label="?????? ?????? ?????????"
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