import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

// Material UI Components
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import InputAdornment from '@material-ui/core/InputAdornment';

// Material icons
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import QueueIcon from '@material-ui/icons/Queue';
import PostAddIcon from '@material-ui/icons/PostAdd';
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Local Component
import Api from '../Api';
import Header from '../components/Header';
import { baseStyles, theme, MainBox } from '../styles/base';
import { MenuStyles } from '../styles/custom';

interface IOption {
  [key: string]: string
}
interface MenuOption {
  name: string;
  select: IOption[];
}
interface ICategory {
  label: string;
  value: string;
}
interface IMenu {
  ca_name: string;
  ca_code: string;
}
interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

type OptionType = 'default' | 'add'; // 기본옵션 | 추가 옵션
type OptionSize = 'option' | 'detail'; // 옵션 | 세부
type CheckedType = '1' | '0'; // 가능(true) | 불가능(false)

function PaperComponent(props: PaperProps) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function MenuAdd(props: any) {

  const base = baseStyles();
  const menu = MenuStyles();
  const history = useHistory();
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const [isLoading, setLoading] = useState(false);

  const [category, setCategory] = useState(''); // 카테고리 선택값
  const [menuName, setMenuName] = useState(''); // 메뉴명
  const [menuInfo, setMenuInfo] = useState(''); // 메뉴 기본설명
  const [menuPrice, setMenuPrice] = useState(''); // 메뉴 판매가격
  const [menuDescription, setMenuDescription] = useState(''); // 메뉴 상세설명
  const [options, setOptions] = useState<MenuOption[]>([]); // 기본옵션
  const [addOptions, setAddOptions] = useState<MenuOption[]>([]); // 추가옵션
  const [open, setOpen] = useState(false); // 세부 옵션 삭제전 모달 on/off
  const [delModalOpen, setDelModalOpen] = useState(false); // 대옵션 삭제전 모달 on/off
  const [delImageModalOpen, setDelImageModalOpen] = useState(false); // 메뉴 이미지 삭제전 모달 on/off

  const [mainOptionType, setMainOptionType] = useState<OptionType>("default"); // 메인 옵션 타입
  const [mainIndex, setMainIndex] = useState(0); // 메인 옵션 인덱스
  const [optionType, setOptionType] = useState<OptionType>("default"); // 옵션 타입('default' : 기본옵션 | 'add' : 추가옵션)
  const [optionSize, setOptionSize] = useState<OptionSize>('option'); // 옵션 size
  const [parentIndex, setParentIndex] = useState(0); // 옵션 index
  const [childIndex, setChildIndex] = useState(0); // 세부옵션 index
  const [checked01, setChecked01] = useState<CheckedType>('0'); // 대표메뉴('1' : 지정 | '0': 지정안함)
  const [checked03, setChecked03] = useState<CheckedType>('0'); // 추천('1' : 지정 | '0': 지정안함)
  const [checked04, setChecked04] = useState<CheckedType>('0'); // 신메뉴('1' : 지정 | '0': 지정안함)
  const [checked05, setChecked05] = useState<CheckedType>('0'); // 인기('1' : 지정 | '0': 지정안함)
  const [checked07, setChecked07] = useState<CheckedType>('0'); // 1인분 가능('1' : 지정 | '0': 지정안함)
  const [checked08, setChecked08] = useState<CheckedType>('0'); // 계절별미('1' : 지정 | '0': 지정안함)

  const [checked02, setChecked02] = useState<CheckedType>('1'); // 판매가능('1' : 가능 | '0': 불가)
  const [soldOut, setSoldOut] = useState<CheckedType>('0'); // 품절여부('1' : 품절 | '0': 품절아님)
  const [image, setImage] = useState(''); // 메뉴 이미지 URL

  const optionUsage = [{ value: 'Y', label: '사용함' }, { value: 'N', label: '사용안함' }];

  // 기본옵션, 추가옵션 탭 
  const [value, setValue] = React.useState('default');

  // 이미지 업로드
  const [source, setSource] = React.useState({});
  const [imageUsable, setImageUsable] = React.useState(true); // 이미지 사용가능 여부

  const onChange = (evt: any) => {

    const img = evt.target.files[0];

    console.log('img detail', img);
    let typeArr: string[] = img.type.split('/');
    console.log('img typeArr', typeArr);
    if (typeArr[0] !== 'image') {
      setToastState({ msg: '이미지 파일만 업로드 하실 수 있습니다.', severity: 'error' });
      handleOpenAlert();
      setImage('');
      return false;
    } else if (typeArr[1] !== 'jpg' && typeArr[1] !== 'jpeg' && typeArr[1] !== 'png' && typeArr[1] !== 'bmp') {
      setToastState({ msg: '이미지 확장자를 확인해주세요.', severity: 'error' });
      handleOpenAlert();
      setImageUsable(false);
      setImage('');
    } else {
      setImageUsable(true);
      setSource(img);

      if (evt.target.files.length) {
        let file = (evt.target.files)[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          setImage(e.target.result);
        }
      } else {
        setImage('');
      }
    }
  }

  // (등록된)카테고리 불러오기
  const [menuCategory, setMenuCategory] = React.useState<ICategory[]>([]);

  const getCategoryHandler = () => {
    setLoading(true);
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'select'
    }

    Api.send('store_item_category', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {

        arrItems.map((menu: IMenu) => {
          setMenuCategory(prev => [
            ...prev,
            {
              label: menu.ca_name,
              value: menu.ca_code
            }
          ]
          );
        });
        setLoading(false);
      } else {
        setLoading(false);
        console.log('메뉴를 가져오지 못했습니다.');
      }
    });
  }

  React.useEffect(() => {
    getCategoryHandler();
  }, [mt_id, mt_jumju_code])

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


  const createOption = () => {
    return ({
      multiple: false,
      name: '',
      select: [
        {
          value: '',
          price: '',
          status: 'Y'
        }
      ],
    });
  };

  const optionAddHandler = (payload: OptionType) => {
    if (payload === 'default') {
      if (options.length < 10) {
        setOptions(options => {
          const result = [...options];
          result.push(createOption());
          return result;
        });
      } else {
        setToastState({ msg: '기본옵션은 최대 10개 입력하실 수 있습니다.', severity: 'error' });
        handleOpenAlert();
      }
    } else {
      setAddOptions(options => {
        const result = [...options];
        result.push(createOption());
        return result;
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 메인 이미지 삭제 전 실행
  const delImageHandler = () => {
    setDelImageModalOpen(!delImageModalOpen);
  }

  // 메인 이미지 '삭제하기' 버튼 클릭시
  const deleteMainImage = () => {
    setSource({});
    setImage('');
    setDelImageModalOpen(false);
  }

  // 메인 옵션 삭제시 실행 기능
  const handleClickOpen02 = (type: OptionType, index: number) => {
    setMainOptionType(type);
    setMainIndex(index);
    setDelModalOpen(true);
  };

  // 메인 옵션 삭제 취소
  const handleClose02 = () => {
    setDelModalOpen(false);
  }

  // 메인 옵션 삭제 실행
  const deleteMainOption = () => {

    console.log('mainOptionType', mainOptionType);
    console.log('mainIndex', mainIndex);
    setDelModalOpen(!delModalOpen);
    // return false;

    if (mainOptionType === 'default') {
      setOptions(options => {
        const result = [...options];
        result.splice(mainIndex, 1);
        return result;
      })
    } else {
      setAddOptions(options => {
        const result = [...options];
        result.splice(mainIndex, 1);
        return result;
      })
    }
  }

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCategory(event.target.value as string);
  };

  // 옵션 삭제 전 핸들러
  const optionDeleteConfirmHandler = (size: OptionSize, type: OptionType, parent: number, child: number) => {
    setOptionSize(size);
    setOptionType(type);
    setParentIndex(parent);
    setChildIndex(child);
    setOpen(true);
  };

  // 세부 옵션 삭제 전 핸들러
  const handleClickOpen = (type: OptionType, parent: number, child: number) => {
    setOptionType(type);
    setParentIndex(parent);
    setChildIndex(child);
    setOpen(true);
  };

  // 세부 옵션 삭제 핸들러
  const deleteOption = () => {

    if (optionType === 'default') {
      setOptions(options => {
        const result = [...options];
        result[parentIndex].select.splice(childIndex, 1);
        return result;
      })
    } else {
      setAddOptions(options => {
        const result = [...options];
        result[parentIndex].select.splice(childIndex, 1);
        return result;
      })
    }
    setOpen(false);
  }

  const addMenuHandler = () => {
    if (category === '') {
      setToastState({ msg: '카테고리를 선택해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (menuName === '') {
      setToastState({ msg: '메뉴명을 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (menuPrice === '' || menuPrice == '0') {
      setToastState({ msg: '판매가격을 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else {

      let isExistDefaultDetailOption: boolean = true; // 기본옵션 - 세부옵션 유무
      let isExistAddDetailOption: boolean = true; // 추가옵션 - 세부옵션 유무

      // 기본옵션 - 세부옵션 유무 체크
      if (options && options.length > 0) {
        options.map((option) => {

          if (option.name === '' || option.name === null) {
            setToastState({ msg: '기본옵션에 옵션명이 없습니다.', severity: 'error' });
            handleOpenAlert();
            isExistDefaultDetailOption = false;
            return false;
          }

          option.select.map((item) => {

            if (item.value === '' || item.value === null) {
              setToastState({ msg: '기본옵션에 세부옵션명이 없습니다.', severity: 'error' });
              handleOpenAlert();
              isExistDefaultDetailOption = false;
            } else {
              isExistDefaultDetailOption = true;
            }
          })
        })
      }

      // 추가옵션 - 세부옵션 유무 체크
      if (addOptions && addOptions.length > 0) {
        addOptions.map((option) => {

          if (option.name === '' || option.name === null) {
            setToastState({ msg: '추가옵션에 옵션명이 없습니다.', severity: 'error' });
            handleOpenAlert();
            isExistDefaultDetailOption = false;
            return false;
          }

          option.select.map((item) => {

            if (item.value === '' || item.value === null) {
              setToastState({ msg: '추가옵션에 세부옵션명이 없습니다.', severity: 'error' });
              handleOpenAlert();
              isExistAddDetailOption = false;
            } else {
              isExistAddDetailOption = true;
            }
          })
        })
      }

      let filterNameArr: string[] = []; // 기본옵션 name값을 담을 새 배열
      let isExistSameValue: boolean = false; // 기본옵션 같은 옵션명 있는지 체크

      let filterNameArr02: string[] = []; // 추가옵션 name값을 담을 새 배열
      let isExistSameValue02: boolean = false; // 추가옵션 같은 옵션명 있는지 체크

      options?.map((option: any, i: number) => {
        filterNameArr.push(option.name);
      })

      addOptions?.map((option: any, i: number) => {
        filterNameArr02.push(option.name);
      })

      // 기본옵션 같은 값 찾기
      for (let i = 0; i < filterNameArr.length; i++) {
        for (let j = 0; j < filterNameArr.length; j++) {
          if (i !== j) {
            console.log('filterNameArr[i]', filterNameArr[i]);
            console.log('filterNameArr[j]', filterNameArr[j]);

            if (filterNameArr[i] === filterNameArr[j]) {
              setToastState({ msg: '기본옵션명에 같은 옵션명이 있습니다.', severity: 'error' });
              handleOpenAlert();
              isExistSameValue = true;
            } else {
              isExistSameValue = false;
            }
          }
        }
      }

      // 추가옵션 같은 값 찾기
      for (let i = 0; i < filterNameArr02.length; i++) {
        for (let j = 0; j < filterNameArr02.length; j++) {
          if (i !== j) {
            console.log('filterNameArr02[i]', filterNameArr02[i]);
            console.log('filterNameArr02[j]', filterNameArr02[j]);

            if (filterNameArr02[i] === filterNameArr02[j]) {
              setToastState({ msg: '추가옵션명에 같은 옵션명이 있습니다.', severity: 'error' });
              handleOpenAlert();
              isExistSameValue02 = true;
            } else {
              isExistSameValue02 = false;
            }
          }
        }
      }

      // console.log('이까지 오나');
      // console.log('isExistSameValue', isExistSameValue);
      // console.log('isExistSameValue02', isExistSameValue02);
      // console.log('isExistDefaultDetailOption', isExistDefaultDetailOption);
      // console.log('isExistAddDetailOption', isExistAddDetailOption);
      if (!isExistSameValue && !isExistSameValue02 && isExistDefaultDetailOption && isExistAddDetailOption) {


        let param = {
          jumju_id: mt_id,
          jumju_code: mt_jumju_code,
          mode: 'insert',
          ca_id2: category,
          menuName: menuName,
          menuInfo: menuInfo,
          menuPrice: menuPrice,
          menuDescription: menuDescription,
          it_type1: checked01,
          it_type3: checked03,
          it_type4: checked04,
          it_type5: checked05,
          it_type7: checked07,
          it_type8: checked08,
          it_soldout: soldOut,
          it_use: checked02,
          menuOption: JSON.stringify(options),
          menuAddOption: JSON.stringify(addOptions),
          it_img1: source
        };

        console.log('메뉴 등록 param', param);

        Api.send2('store_item_input', param, (args: any) => {

          let resultItem = args.resultItem;
          let arrItems = args.arrItems;

          console.log('메뉴 등록 resultItem', resultItem);
          console.log('메뉴 등록 arrItems', arrItems);

          if (resultItem.result === 'Y') {
            setToastState({ msg: '메뉴가 등록되었습니다.', severity: 'success' });
            handleOpenAlert();
            // setTimeout(() => {
            //   history.push('/menu');
            // }, 700);
          } else {
            setToastState({ msg: '메뉴를 등록 중에 오류가 발생하였습니다.', severity: 'error' });
            handleOpenAlert();
          }
        });
      }
    }
  }

  console.log('image ??', image);

  return (
    <Box component="div" className={base.root}>
      <Header type="menuAdd" action={addMenuHandler} />
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
      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box className={base.mb10} style={{ position: 'relative' }}>
              {image ?
                <img id="menuImg" src={image} className={menu.menuImg} alt="메뉴이미지" />
                :
                <Box style={{ position: 'relative', width: '100%', height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ececec' }}>
                  <p style={{ color: '#666' }}>이미지 업로드</p>
                </Box>
              }
              <input
                accept="image/*"
                className={menu.menuInput}
                id="contained-button-file"
                multiple
                type="file"
                onChange={onChange}
              // onChange={handleUploadClick}
              />
              <label htmlFor="contained-button-file">
                <Fab component="span" variant="circular" color="primary" style={{ position: 'absolute', right: 70, bottom: 10, color: theme.palette.primary.contrastText }} className={menu.photoSelectIcon}>
                  <AddPhotoAlternateOutlinedIcon />
                </Fab>
              </label>
              <Fab component="span" variant="circular" color='default' style={{ position: 'absolute', right: 5, bottom: 10, color: theme.palette.primary.contrastText }} className={menu.photoSelectIcon} onClick={delImageHandler}>
                <DeleteOutlineOutlinedIcon />
              </Fab>
            </Box>

            {/* <div className={base.mb20}></div> */}
            <Box mb={3}>
              <small>업로드 가능한 이미지 확장자는 <mark>jpg, jpeg, png, bmp</mark>입니다.</small>
              {!imageUsable && (
                <>
                  <br />
                  <small style={{ color: 'red' }}>※이미지 확장자가 업로드 불가능한 확장자입니다.</small>
                </>
              )}
            </Box>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="0">
                <FormControlLabel
                  value={'0'}
                  checked={checked01 === '1' ? true : false}
                  control={<Checkbox color="primary" style={{ paddingLeft: 0 }} />}
                  label="대표"
                  labelPlacement="start"
                  style={{ width: 80, margin: 0, flexDirection: 'row' }}
                  onChange={() => checked01 === '1' ? setChecked01('0') : setChecked01('1')}
                />
                <FormControlLabel
                  value={'0'}
                  checked={checked03 === '1' ? true : false}
                  control={<Checkbox color="primary" style={{ paddingLeft: 0 }} />}
                  label="추천"
                  labelPlacement="start"
                  style={{ width: 80, margin: 0, flexDirection: 'row' }}
                  onChange={() => checked03 === '1' ? setChecked03('0') : setChecked03('1')}
                />
                <FormControlLabel
                  value={'0'}
                  checked={checked04 === '1' ? true : false}
                  control={<Checkbox color="primary" style={{ paddingLeft: 0 }} />}
                  label="신메뉴"
                  labelPlacement="start"
                  style={{ width: 95, margin: 0, flexDirection: 'row' }}
                  onChange={() => checked04 === '1' ? setChecked04('0') : setChecked04('1')}
                />
                <FormControlLabel
                  value={'0'}
                  checked={checked05 === '1' ? true : false}
                  control={<Checkbox color="primary" style={{ paddingLeft: 0 }} />}
                  label="인기"
                  labelPlacement="start"
                  style={{ width: 80, margin: 0, flexDirection: 'row' }}
                  onChange={() => checked05 === '1' ? setChecked05('0') : setChecked05('1')}
                />
                <FormControlLabel
                  value={'0'}
                  checked={checked07 === '1' ? true : false}
                  control={<Checkbox color="primary" style={{ paddingLeft: 0 }} />}
                  label="1인분 가능"
                  labelPlacement="start"
                  style={{ width: 120, margin: 0, flexDirection: 'row' }}
                  onChange={() => checked07 === '1' ? setChecked07('0') : setChecked07('1')}
                />
                <FormControlLabel
                  value={'0'}
                  checked={checked08 === '1' ? true : false}
                  control={<Checkbox color="primary" style={{ paddingLeft: 0 }} />}
                  label="계절별미"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={() => checked08 === '1' ? setChecked08('0') : setChecked08('1')}
                />
              </RadioGroup>
            </FormControl>
            <div className={base.mb20}></div>
            {/* {checked01 === '1' ?
              <div className={base.mb20}>
                <Typography variant="body1" component="p" color="primary">
                  ※ 대표메뉴로 지정하였습니다.
                </Typography>
              </div>
              :
              <div className={base.mb40}>
              </div>
            } */}
            {/* <div className={base.mb20}>
                <Typography variant="body1" component="p" color="textSecondary">
                  ※ 기본메뉴로 지정되었습니다.
                </Typography>
              </div>
            */}
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="0">
                <FormControlLabel
                  value={'1'}
                  checked={checked02 === '1' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="판매가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={() => setChecked02('1')}
                />
                <FormControlLabel
                  value={'0'}
                  checked={checked02 === '0' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="판매중지"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={() => setChecked02('0')}
                />
              </RadioGroup>
            </FormControl>
            {checked02 === '1' ?
              <div className={base.mb20}>
                <Typography variant="body1" component="p" color="primary">
                  ※ 판매 가능 상태로 지정하였습니다.
                </Typography>
              </div>
              :
              <div className={base.mb20}>
                <Typography variant="body1" component="p" color="textSecondary">
                  ※ 판매 불가 상태로 지정하였습니다.
                </Typography>
              </div>
            }
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="0">
                <FormControlLabel
                  value={'0'}
                  checked={soldOut === '1' ? true : false}
                  control={<Checkbox color="primary" style={{ paddingLeft: 0 }} />}
                  label="품절"
                  labelPlacement="start"
                  style={{ width: 80, margin: 0, flexDirection: 'row' }}
                  onChange={e => soldOut === '1' ? setSoldOut('0') : setSoldOut('1')}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" className={base.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">카테고리 선택</InputLabel>
              <Select
                value={category}
                onChange={e => setCategory(e.target.value as string)}
                label="카테고리"
                required
              >
                {menuCategory && menuCategory.length > 0 ?
                  menuCategory.map((category, index) => (
                    <MenuItem key={index} value={category.value}>{category.label}</MenuItem>
                  ))
                  : <MenuItem value="">
                    <em>등록된 카테고리가 없습니다.</em>
                  </MenuItem>}
              </Select>
              <div className={base.mb30}></div>
              <TextField
                value={menuName}
                label="메뉴명"
                variant="outlined"
                required
                placeholder="메뉴명을 입력해주세요."
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setMenuName(e.target.value as string)}
              />
              <div className={base.mb30}></div>
              <TextField
                value={menuInfo}
                label="기본설명"
                variant="outlined"
                placeholder="기본설명을 입력해주세요."
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setMenuInfo(e.target.value as string)}
              />
              <div className={base.mb30}></div>
              <TextField
                label="판매가격"
                value={menuPrice}
                variant="outlined"
                required
                placeholder="0"
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>,
                }}
                onChange={e => {
                  const re = /^[0-9\b]+$/;
                  if (e.target.value === '' || re.test(e.target.value)) {
                    let changed = e.target.value.replace(/(^0+)/, '');
                    setMenuPrice(changed);
                  }
                }}
              />
              <div className={base.mb30}></div>
              <TextField
                value={menuDescription}
                fullWidth
                className={base.multiTxtField}
                label="메뉴상세설명"
                multiline
                rows={10}
                placeholder="메뉴 상세설명을 작성해주세요."
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
                onChange={e => setMenuDescription(e.target.value as string)}
              />
            </FormControl>
          </Grid>
        </Grid>
        <div className={base.mb30}></div>

        <Box sx={{ width: '100%', typography: 'body1' }}>

          <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Box onClick={() => setValue('default')} display='flex' justifyContent='center' alignItems='center' style={{ flex: 1, maxWidth: 'inherit', color: value === 'default' ? '#000' : '#c4c4c4', borderWidth: value === 'default' ? 1 : 0, borderStyle: 'solid', borderColor: '#c4c4c4', borderBottom: value === 'default' ? 'none' : 1, borderBottomColor: value === 'default' ? 'transparent' : '#c4c4c4', borderBottomStyle: value === 'default' ? 'none' : 'solid', borderTopLeftRadius: 3, borderTopRightRadius: 3 }}>
              <p>기본옵션</p>
            </Box>
            <Box onClick={() => setValue('add')} display='flex' justifyContent='center' alignItems='center' style={{ flex: 1, maxWidth: 'inherit', color: value === 'add' ? '#000' : '#c4c4c4', borderWidth: value === 'add' ? 1 : 0, borderStyle: 'solid', borderColor: '#c4c4c4', borderBottom: value === 'add' ? 'none' : 1, borderBottomColor: value === 'add' ? 'transparent' : '#c4c4c4', borderBottomStyle: value === 'add' ? 'none' : 'solid', borderTopLeftRadius: 3, borderTopRightRadius: 3 }}>
              <p>추가옵션</p>
            </Box>
          </Box>

          <Box py={1} />
          {value === 'default' &&
            <Grid item xs={12} md={12}>
              <div className={base.mb30}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Typography variant="h6" component="h6">
                    기본옵션
                  </Typography>
                  <Button
                    variant="contained"
                    style={{ boxShadow: 'none' }}
                    onClick={() => optionAddHandler('default')}
                    color="primary"
                    startIcon={<QueueIcon />}
                  >
                    옵션추가
                  </Button>
                </div>
              </div>
              {options && options.length > 0 && options.map((option, index) => (
                <FormControl key={index} fullWidth>
                  <Box display='flex' flexDirection="row" justifyContent='space-between' alignItems='center' key={index} style={{ marginBottom: 20 }}>
                    <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center' style={{ width: '70%' }}>
                      <TextField
                        value={option.name === null || option.name === undefined ? '' : option.name}
                        id="outlined-basic"
                        label={`기본 옵션명 ${index < 9 ? '0' : ''}${index + 1}`}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder='옵션분류 예: 사이즈 or 맛 등'
                        variant="outlined"
                        className={base.fieldMargin}
                        style={{ width: '100%', marginRight: '1%' }}
                        onChange={e => {
                          setOptions(options => {
                            const result = [...options];
                            result[index].name = e.target.value as string;
                            return result;
                          })
                        }}
                      />
                    </Box>
                    <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center' style={{ width: '30%' }}>
                      <Button
                        className={base.formControl02}
                        variant="outlined"
                        color="secondary"
                        startIcon={<PostAddIcon />}
                        onClick={() =>
                          setOptions(options => {
                            const result = [...options];
                            result[index].select.push({
                              value: '',
                              price: '',
                              status: 'Y'
                            });
                            return result;
                          })
                        }
                      >
                        추가
                      </Button>
                      <Button
                        className={base.optionDeleteBtn}
                        variant="outlined"
                        color="secondary"
                        startIcon={<HighlightOffIcon />}
                        onClick={() => handleClickOpen02('default', index)}
                      >
                        삭제
                      </Button>
                    </Box>
                  </Box>
                  {option.select && option.select.map((item, selectIndex) => (
                    <Box className={base.fieldMargin} display='flex' flexDirection="row" justifyContent="flex-start" alignItems="center" key={selectIndex} style={{ height: 50 }}>
                      <Box display='flex' flexDirection="row" justifyContent="flex-start" alignItems="center" style={{ width: '70%' }}>
                        <Typography fontSize={18} color="#ffc739" mr={1}>┗</Typography>
                        <TextField
                          style={{ width: '69%', marginRight: '1%' }}
                          value={item.value === null || item.value === undefined ? '' : item.value}
                          id="outlined-basic"
                          // label={`기본 ${index < 9 ? '0' : ''}${index + 1} - 세부명`}
                          label='세부명'
                          InputLabelProps={{
                            shrink: true,
                          }}
                          placeholder='세부명을 입력해주세요.'
                          variant="outlined"
                          onChange={e => {
                            setOptions(options => {
                              const result = [...options];
                              result[index].select[selectIndex].value = e.target.value as string;
                              return result;
                            })
                          }}
                        />
                        <TextField
                          style={{ width: '29%', marginRight: '1%' }}
                          value={item.price === null || item.price === undefined ? '' : item.price}
                          id="outlined-basic"
                          // label={`기본 ${index < 9 ? '0' : ''}${index + 1} - 추가금액`}
                          label='추가금액'
                          InputLabelProps={{
                            shrink: true,
                          }}
                          placeholder='0'
                          variant="outlined"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">원</InputAdornment>,
                          }}
                          onChange={e => {
                            const re = /^[0-9\b]+$/;
                            if (e.target.value === '' || re.test(e.target.value)) {
                              let changed = e.target.value.replace(/(^0+)/, '');
                              setOptions(options => {
                                const result = [...options];
                                result[index].select[selectIndex].price = changed;
                                return result;
                              })
                            }
                          }}
                        />
                      </Box>
                      <Box display='flex' flexDirection="row" justifyContent="flex-start" alignItems="center" style={{ width: '30%' }}>
                        <FormControl variant="outlined" className={base.formControl02}>
                          <InputLabel>사용여부</InputLabel>
                          <Select
                            value={item.status}
                            style={{ width: '100%' }}
                            onChange={e => {
                              setOptions(options => {
                                const result = [...options];
                                result[index].select[selectIndex].status = e.target.value as string;
                                return result;
                              })
                            }}
                            label="사용여부"
                            required
                          >
                            {optionUsage.map((usage, index) => (
                              <MenuItem key={index} value={usage.value}>{usage.label}</MenuItem>
                            ))
                            }
                          </Select>
                        </FormControl>
                        <Button
                          className={base.optionDeleteBtn}
                          startIcon={<HighlightOffIcon />}
                          variant="outlined"
                          // startIcon={<HighlightOffIcon />}
                          onClick={() => handleClickOpen('default', index, selectIndex)}
                        >
                          삭제
                        </Button>
                      </Box>
                    </Box>
                  )
                  )
                  }
                  <div style={{ marginTop: 10, marginBottom: 23, height: 1, backgroundColor: '#e5e5e5' }}></div>
                </FormControl>
              )
              )}
            </Grid>
          }

          {value === 'add' &&
            <Grid item xs={12} md={12}>
              <div className={base.mb30}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Typography variant="h6" component="h6">
                    추가옵션
                  </Typography>
                  <Button
                    variant="contained"
                    style={{ boxShadow: 'none' }}
                    onClick={() => optionAddHandler('add')}
                    color="primary"
                    startIcon={<QueueIcon />}
                  >
                    옵션추가
                  </Button>
                </div>
              </div>
              {addOptions && addOptions.length > 0 && addOptions.map((option, index) => (
                <FormControl key={index} fullWidth>
                  <Box display='flex' flexDirection="row" justifyContent='space-between' alignItems='center' key={index} style={{ marginBottom: 20 }}>
                    <Box display='flex' flexDirection="row" key={index} style={{ width: '70%' }}>
                      <TextField
                        value={option.name === null || option.name === undefined ? '' : option.name}
                        id="outlined-basic"
                        label={`추가 옵션명 ${index < 9 ? '0' : ''}${index + 1}`}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder='추가옵션명을 입력해주세요.'
                        variant="outlined"
                        className={base.fieldMargin}
                        style={{ width: '100%', marginRight: '1%' }}
                        onChange={e => {
                          setAddOptions(options => {
                            const result = [...options];
                            result[index].name = e.target.value as string;
                            return result;
                          })
                        }}
                      />
                    </Box>
                    <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center' style={{ width: '30%' }}>
                      <Button
                        className={base.formControl02}
                        variant="outlined"
                        color="secondary"
                        startIcon={<PostAddIcon />}
                        onClick={() =>
                          setAddOptions(options => {
                            const result = [...options];
                            result[index].select.push({
                              value: '',
                              price: '',
                              status: 'Y'
                            });
                            return result;
                          })
                        }
                      >
                        추가
                      </Button>
                      <Button
                        className={base.optionDeleteBtn}
                        variant="outlined"
                        color="secondary"
                        startIcon={<HighlightOffIcon />}
                        onClick={() => handleClickOpen02('add', index)}
                      >
                        삭제
                      </Button>
                    </Box>
                  </Box>
                  {option.select && option.select.map((item, selectIndex) => (
                    <Box className={base.fieldMargin} display='flex' flexDirection="row" justifyContent="flex-start" alignItems="center" key={selectIndex} style={{ height: 50 }}>
                      <Box display='flex' flexDirection="row" justifyContent="flex-start" alignItems="center" style={{ width: '70%' }}>
                        <Typography fontSize={18} color="#ffc739" mr={1}>┗</Typography>
                        <TextField
                          style={{ width: '69%', marginRight: '1%' }}
                          value={item.value === null || item.value === undefined ? '' : item.value}
                          id="outlined-basic"
                          // label={`추가 ${index < 9 ? '0' : ''}${index + 1} - 세부명`}
                          label='세부명'
                          InputLabelProps={{
                            shrink: true,
                          }}
                          placeholder='세부명을 입력해주세요.'
                          variant="outlined"
                          onChange={e => {
                            setAddOptions(options => {
                              const result = [...options];
                              result[index].select[selectIndex].value = e.target.value as string;
                              return result;
                            })
                          }}
                        />
                        <TextField
                          style={{ width: '29%', marginRight: '1%' }}
                          value={item.price === null || item.price === undefined ? '' : item.price}
                          id="outlined-basic"
                          // label={`추가 ${index < 9 ? '0' : ''}${index + 1} - 추가금액`}
                          label='추가금액'
                          InputLabelProps={{
                            shrink: true,
                          }}
                          placeholder='0'
                          variant="outlined"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">원</InputAdornment>,
                          }}
                          onChange={e => {
                            const re = /^[0-9\b]+$/;
                            if (e.target.value === '' || re.test(e.target.value)) {
                              let changed = e.target.value.replace(/(^0+)/, '');
                              setAddOptions(options => {
                                const result = [...options];
                                result[index].select[selectIndex].price = changed;
                                return result;
                              })
                            }
                          }}
                        />
                      </Box>
                      <Box display='flex' flexDirection="row" justifyContent="flex-start" alignItems="center" style={{ width: '30%' }}>
                        <FormControl variant="outlined" className={base.formControl02}>
                          <InputLabel>사용여부</InputLabel>
                          <Select
                            value={item.status}
                            style={{ width: '100%' }}
                            onChange={e => {
                              setAddOptions(options => {
                                const result = [...options];
                                result[index].select[selectIndex].status = e.target.value as string;
                                return result;
                              })
                            }}
                            label="사용여부"
                            required
                          >
                            {optionUsage.map((usage, index) => (
                              <MenuItem key={index} value={usage.value}>{usage.label}</MenuItem>
                            ))
                            }
                          </Select>
                        </FormControl>
                        <Button
                          className={base.optionDeleteBtn}
                          startIcon={<HighlightOffIcon />}
                          variant="outlined"
                          color="secondary"
                          // startIcon={<HighlightOffIcon />}
                          onClick={() => handleClickOpen('add', index, selectIndex)}
                        >
                          삭제
                        </Button>
                      </Box>
                    </Box>
                  )
                  )
                  }
                  <div style={{ marginTop: 10, marginBottom: 23, height: 1, backgroundColor: '#e5e5e5' }}></div>
                </FormControl>
              )
              )}
            </Grid>
          }
        </Box>

        {/* 메뉴 이미지 삭제전 모달 */}
        <Dialog
          open={delImageModalOpen}
          onClose={delImageHandler}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move', width: 500 }} id="draggable-dialog-title">
            메뉴 이미지 삭제
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              메뉴 이미지를 삭제하시겠습니까?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={delImageHandler} color="primary">
              취소
            </Button>
            <Button onClick={deleteMainImage} color="primary">
              삭제하기
            </Button>
          </DialogActions>
        </Dialog>
        {/* // 메뉴 이미지 삭제전 모달 */}

        {/* 메인옵션 삭제전 모달 */}
        <Dialog
          open={delModalOpen}
          onClose={handleClose02}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move', width: 500 }} id="draggable-dialog-title">
            정말 삭제하시겠습니까?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`선택하신 ${mainOptionType === 'default' ? '기본옵션' : '추가옵션'}을 삭제하시겠습니까?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose02} color="primary">
              취소
            </Button>
            <Button onClick={deleteMainOption} color="primary">
              삭제하기
            </Button>
          </DialogActions>
        </Dialog>
        {/* // 메인옵션 삭제전 모달 */}

        {/* 세부옵션 삭제전 모달 */}
        <Dialog
          open={open}
          onClose={handleClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move', width: 500 }} id="draggable-dialog-title">
            정말 삭제하시겠습니까?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              선택하신 세부옵션을 삭제하시겠습니까?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
              취소
            </Button>
            <Button onClick={deleteOption} color="primary">
              삭제하기
            </Button>
          </DialogActions>
        </Dialog>
        {/* // 세부옵션 삭제전 모달 */}
      </MainBox >
    </Box >
  );
}