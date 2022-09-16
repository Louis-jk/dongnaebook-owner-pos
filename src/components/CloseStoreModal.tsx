import * as React from 'react';
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

// Material UI Components
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core/styles';
import Switch, { SwitchProps } from '@material-ui/core/Switch';

// Local Component
import { theme, baseStyles, ModalCancelButton } from '../styles/base';
import * as storeAction from '../redux/actions/storeAction';
import Api from '../Api';

interface IProps {
  isOpen: boolean;
  isClose: () => void;
}

interface Object {
  [key: string]: string;
}

export default function CloseStoreModal(props: IProps) {

  const base = baseStyles();
  const dispatch = useDispatch();
  const { mt_jumju_key } = useSelector((state: any) => state.login);
  const { allStore, closedStore } = useSelector((state: any) => state.store);
  const [closeId, setCloseId] = React.useState<string[]>([]); // 매장 영업중지 테스트 상태관리


  // 등록된 스토어 가져오기
  const getStoreHandler = () => {
    const param = {
      jumju_id: mt_jumju_key,
      item_count: 0,
      limit_count: 10
    };

    Api.send('store_jumju', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;
      console.log("store list result ", resultItem);
      console.log("store list", arrItems);
      if (resultItem.result === 'Y') {
        console.log('등록된 스토어 가져오기 success', arrItems);
        dispatch(storeAction.updateStore(arrItems));
      } else {
        console.log('등록된 스토어 가져오기 failed', arrItems);
        dispatch(storeAction.updateStore([]));
      }

    });
  };

  // 일시정지 핸들러
  const setCloseStoreHandler = (id: string, s_id: string, s_jumju_code: string) => {

    console.log('s_id', s_id);
    console.log('s_jumju_code', s_jumju_code);

    const checked = allStore.filter((store: any) => store.mt_id === s_id).filter((state: any) => state.do_end_state === 'Y');
    console.log('checked ?', checked);
    let state = '';
    if (checked.length > 0) {
      state = 'N'; // 일시중지
    } else {
      state = 'Y'; // 영업중
    }

    const param = {
      jumju_id: s_id,
      jumju_code: s_jumju_code,
      do_end_state: state
    };

    Api.send('store_close', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("일시정지 API success?", arrItems);
        getStoreHandler();
      } else {
        console.log("일시정지 faild?", arrItems);
        getStoreHandler();
      }
    });

    // const filtered = closeId.find(closeId => closeId === id);

    // if (filtered) {
    //   const removeObj = closeId.filter(closeId => closeId !== id);
    //   setCloseId(removeObj);
    //   dispatch(storeAction.closedStore(removeObj));
    // } else {
    //   let result = closeId.concat(id);
    //   setCloseId(result);
    //   dispatch(storeAction.closedStore(result));
    // }
  }

  // console.log("closeId", closeId);

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

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={base.modal}
      open={props.isOpen}
      // onClose={props.isClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.isOpen}>
        <Box className={clsx(base.modalInner, base.colCenter)} p={5}>
          <Typography id="transition-modal-title" component="h5" variant="h5" style={{ fontWeight: 'bold', marginBottom: 10, color: theme.palette.primary.main }}>영업 일시정지</Typography>
          <Typography id="transition-modal-description">정지하고자 하는 매장은 스위치를 꺼주세요.</Typography>

          <Box style={{ height: 1, width: '100%', backgroundColor: '#d5d5d5' }} my={2} />
          <Box maxHeight={300} overflow='scroll'>
            {allStore && allStore.length > 0 ? allStore.map((store: Object, index: number) => (

              <Box key={index} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width="100%" my={1}>
                <Box flexShrink={1} style={{ minWidth: 200 }}>
                  <Typography textAlign="left">{store.mt_store}</Typography>
                </Box>
                <Box flexShrink={1} textAlign="left" style={{ minWidth: 70 }}>
                  <Typography
                    component="span"
                    fontSize={12}
                    px={1}
                    py={0.5}
                    style={{
                      borderRadius: 5,
                      backgroundColor: store.do_end_state === 'N' ? '#F8485E' : '#9FE6A0',
                      color: store.do_end_state === 'N' ? '#fff' : '#564A4A',
                      transition: '.2s ease-in',
                    }}
                  >
                    {store.do_end_state === 'N' ? '정지중' : '영업중'}
                  </Typography>
                </Box>
                <Box flexShrink={1}>
                  <Android12Switch color="primary" onChange={() => setCloseStoreHandler(store.id, store.mt_id, store.mt_jumju_code)} checked={store.do_end_state === 'N' ? false : true} />
                </Box>
              </Box>
            ))
              : <Typography textAlign="left">등록된 매장이 없습니다.</Typography>
            }
          </Box>
          <ModalCancelButton fullWidth color="primary" sx={{ fontSize: 16, marginTop: 3 }} style={{ boxShadow: 'none' }} variant="contained" onClick={props.isClose}>닫기</ModalCancelButton>
        </Box>
      </Fade>
    </Modal>
  )
}