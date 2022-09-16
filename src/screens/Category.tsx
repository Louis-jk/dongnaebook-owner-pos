import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link, Router, useHistory, useLocation } from 'react-router-dom';
import clsx from 'clsx';

// Material UI Components
import { styled } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import Alert from '@material-ui/core/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

// Local Component
import Header from '../components/Header';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';
import { Button } from '@material-ui/core';

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    backgroundColor: '#b3b3b3',
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

interface ICategory {
  ca_id: string;
  ca_code: string;
  ca_img: string;
  ca_name: string;
  ca_use: string;
}


export default function SetCategory(props: any) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const base = baseStyles();
  const [lists, setLists] = React.useState<ICategory[]>([
    {
      ca_id: '',
      ca_code: '',
      ca_img: '',
      ca_name: '',
      ca_use: ''
    }
  ]);
  const [isLoading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false); // 카테고리 등록 모달
  const [name, setName] = React.useState(''); // 신규 카테고리 명
  const [editOpen, setEditOpen] = React.useState(false); // 카테고리 수정 모달
  const [categoryId, setCategoryId] = React.useState(''); // 수정할 카테고리 ID
  const [editName, setEditName] = React.useState(''); // 수정한 카테고리 명
  const inputRef = React.useRef<HTMLDivElement | null>(null); // 신규 카테고리명 textField Reference
  const inputEditRef = React.useRef<HTMLDivElement | null>(null); // 수정 카테고리명 textField Reference
  const [visible, setVisible] = React.useState(false); // 신규 카테고리 노출 여부
  const [editVisible, setEditVisible] = React.useState(false); // 카테고리 수정 노출 여부

  // 신규 카테고리 노출 여부 토글
  const visibleToggle = (type: string) => {
    if (type === 'new') {
      setVisible(prev => !prev);
    } else {
      setEditVisible(prev => !prev);
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

  // 카테고리 등록 모달 핸들러
  const openNewCategoryModal = () => {
    setOpen(true);
  }

  const closeNewCategoryModal = () => {
    setOpen(false);
  }

  const setNewCategoryModalHandler = () => {
    openNewCategoryModal();
  }

  // 카테고리 수정 모달 핸들러
  const openEditCategoryModal = () => {
    setEditOpen(true);
  }

  const closeEditCategoryModal = () => {
    setEditOpen(false);
  }

  const setEditCategoryModalHandler = (cId: string, cName: string, cVisible: boolean) => {
    setCategoryId(cId);
    setEditName(cName);
    setEditVisible(cVisible);
    openEditCategoryModal();
  }


  // 등록된 팁 정보 가져오기
  const getCategoryHandler = () => {
    setLoading(true);
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    };

    Api.send('store_item_category', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        setLists(arrItems);
        setLoading(false);
      } else {
        setLists([]);
        setLoading(false);
      }
    });
  };

  React.useEffect(() => {
    getCategoryHandler();
  }, [mt_id, mt_jumju_code]);



  // 신규 카테고리 등록 핸들러
  const setCategoryHandler = () => {

    const filter = (element: any) => element.ca_name === name;
    let filtered = lists.some(filter);

    // console.log("filtered ?", filtered);

    if (filtered) {
      setToastState({ msg: '이미 등록된 카테고리명입니다.', severity: 'error' });
      handleOpenAlert();
    } else {
      let param = {
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        ca_name: name,
        ca_use: visible ? '1' : '0'
      };

      Api.send('store_item_category_input', param, (args: any) => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;
        if (resultItem.result === 'Y') {
          setToastState({ msg: '카테고리를 등록하였습니다.', severity: 'success' });
          handleOpenAlert();
          setName('');
          closeNewCategoryModal();
          getCategoryHandler();
        } else {
          setToastState({ msg: '카테고리를 등록하는데 문제가 생겼습니다.', severity: 'error' });
          handleOpenAlert();
          setName('');
          closeNewCategoryModal();
          getCategoryHandler();
        }
      });
    }
  }

  // 신규 카테고리 등록 핸들러
  const editCategoryHandler = () => {
    let param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      ca_id: categoryId,
      ca_name: editName,
      ca_use: editVisible ? '1' : '0'
    };

    Api.send('store_item_category_update', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;
      if (resultItem.result === 'Y') {
        setToastState({ msg: '카테고리를 수정하였습니다.', severity: 'success' });
        handleOpenAlert();
        setEditName('');
        closeEditCategoryModal();
        getCategoryHandler();
      } else {
        setToastState({ msg: '카테고리를 수정하는데 문제가 생겼습니다.', severity: 'error' });
        handleOpenAlert();
        setEditName('');
        closeEditCategoryModal();
        getCategoryHandler();
      }
    });
  }

  console.log("lists", lists);
  console.log("name", name);
  console.log("visible", visible);

  return (
    <Box component="div" className={base.root}>
      <Header type="category" action={setNewCategoryModalHandler} />
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

      {isLoading ?
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
          <Box className={base.loadingWrap}>
            <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
          </Box>
        </MainBox>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
          <Box mt={3} />
          {/* 신규 카테고리 추가 모달 */}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={base.modal}
            open={open}
            // onClose={handleCloseCancel}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <Box className={clsx(base.modalInner, base.colCenter)}>
                <Typography id="transition-modal-title" component="h5" variant="h5" style={{ fontWeight: 'bold', marginBottom: 10, color: theme.palette.primary.main }}>카테고리 등록</Typography>
                <Typography id="transition-modal-description">신규 카테고리 명과 노출여부를 입력 및 지정해주세요.</Typography>
                <TextField
                  inputRef={inputRef}
                  value={name}
                  style={{ margin: 20 }}
                  fullWidth
                  id="outlined-basic"
                  label="신규 카테고리"
                  variant="outlined"
                  required
                  InputProps={{
                    endAdornment: <Android12Switch color="primary" defaultChecked onChange={() => visibleToggle('new')} checked={visible ? true : false} />
                  }}
                  onChange={e => setName(e.target.value as string)}
                />
                <Box mb={2}>
                  <p style={{ color: visible ? theme.palette.primary.main : '#222' }}>{visible ? '노출로 설정하였습니다.' : '비노출로 설정하였습니다.'}</p>
                </Box>
                <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                  <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={setCategoryHandler}>등록하기</ModalConfirmButton>
                  <ModalCancelButton variant="outlined" onClick={closeNewCategoryModal}>취소</ModalCancelButton>
                </ButtonGroup>
              </Box>
            </Fade>
          </Modal>
          {/* // 신규 카테고리 추가 모달 */}
          {/* 카테고리 수정 모달 */}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={base.modal}
            open={editOpen}
            // onClose={handleCloseCancel}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={editOpen}>
              <Box className={clsx(base.modalInner, base.colCenter)}>
                <Typography id="transition-modal-title" component="h5" variant="h5" style={{ fontWeight: 'bold', marginBottom: 10, color: theme.palette.primary.main }}>카테고리 수정</Typography>
                <Typography id="transition-modal-description">카테고리명 또는 노출여부를 수정할 수 있습니다.</Typography>
                <TextField
                  inputRef={inputEditRef}
                  value={editName}
                  style={{ margin: 20 }}
                  fullWidth
                  id="outlined-basic"
                  label="카테고리명"
                  variant="outlined"
                  required
                  InputProps={{
                    endAdornment: <Android12Switch defaultChecked onChange={() => visibleToggle('edit')} checked={editVisible ? true : false} />
                  }}
                  onChange={e => setEditName(e.target.value as string)}
                />
                <Box mb={2}>
                  <p style={{ color: editVisible ? theme.palette.primary.main : '#222' }}>{editVisible ? '노출로 설정하였습니다.' : '비노출로 설정하였습니다.'}</p>
                </Box>
                <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                  <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={editCategoryHandler}>수정하기</ModalConfirmButton>
                  <ModalCancelButton variant="outlined" onClick={closeEditCategoryModal}>취소</ModalCancelButton>
                </ButtonGroup>
              </Box>
            </Fade>
          </Modal>
          {/* // 카테고리 수정 모달 */}
          <Grid container spacing={3}>
            {lists && lists.length > 0 && lists.map((list, index) =>
              <Grid item xs={6} sm={6} md={6} key={list.ca_id} style={{ position: 'relative' }}>
                <Box display='flex' flexDirection='row' className={base.txtRoot}>
                  <TextField
                    value={list.ca_name}
                    className={base.textField}
                    id="outlined-basic"
                    label="카테고리명"
                    variant="outlined"
                    required
                    onChange={e => setLists(lists => {
                      const result = [...lists];
                      result[index].ca_name = e.target.value as string;
                      return result;
                    })}
                    onClick={() => setEditCategoryModalHandler(list.ca_id, list.ca_name, list.ca_use === '1' ? true : false)}
                    // onMouseLeave={() => alert('end?')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                      endAdornment: <Android12Switch defaultChecked checked={list.ca_use === '1' ? true : false} />
                    }}
                  />

                  <Link to={`/menu/${list.ca_code}`}
                    style={{
                      color: '#fff',
                      backgroundColor: theme.palette.info.main,
                      borderWidth: 1,
                      borderColor: theme.palette.info.main,
                      borderStyle: 'solid',
                      borderRadius: 5,
                      padding: '1.05rem 0.5rem',
                      boxShadow: 'none',
                      marginLeft: 10
                    }}
                  >
                    메뉴 보기
                  </Link>

                </Box>
              </Grid>
            )}
          </Grid>
          {lists.length === 0 || lists === null ?
            <Box style={{ display: 'flex', flex: 1, height: 'calc(100vh - 112px)', justifyContent: 'center', alignItems: 'center' }}>
              <Typography style={{ fontSize: 15 }}>등록된 카테고리가 없습니다.</Typography>
            </Box>
            : null}
        </MainBox>
      }
    </Box >
  );
}