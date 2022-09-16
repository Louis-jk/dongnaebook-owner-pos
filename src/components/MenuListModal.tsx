import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// Material UI Components
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';

// Material icons
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Components
import Api from '../Api';
import { MainBox, baseStyles } from '../styles/base';
import { MenuStyles } from '../styles/custom';
import { ModalCancelButton, ModalConfirmButton } from '../styles/customButtons';

interface Props {
  open: boolean;
  onClose: () => void;
  reflesh: () => void;
  propModalToastAction: (a: string, b: string) => void;
}

const MenuListModal: React.FC<Props> = ({ open, onClose, reflesh, propModalToastAction }) => {

  const base = baseStyles();
  const menuSt = MenuStyles();
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const [menus, setMenus] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);


  // 메뉴 전체 불러오기
  const getTotalMenusHandler = () => {

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    };

    Api.send('store_item_sequence', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        setMenus(arrItems);
        setLoading(false);
      } else {
        setMenus([]);
        setLoading(false);
      }
    });

  }

  useEffect(() => {
    getTotalMenusHandler();
  }, [])

  console.log('menus ??', menus);

  // 수정하기 핸들러
  const onSumbmit = () => {

    let exportItId: string[] = []; // it_id 값 배열 그대로 
    let exportOrder: string[] = []; // it_id 값 배열 그대로 
    menus.map((menu: any, _: number) => {
      exportItId.push(menu.it_id);
    });
    menus.map((menu: any, _: number) => {
      exportOrder.push(menu.it_order);
    });

    console.log('exportItId ??', exportItId);
    console.log('exportOrder ??', exportOrder);


    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      it_id: exportItId,
      it_order: exportOrder,
    };

    console.log('메뉴 리스트 순서 param', param);

    Api.send('store_item_sequence_update', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log('메뉴 순서 수정 성공 arrItems', arrItems);
        onClose();
        reflesh();
        propModalToastAction('메뉴 순서를 수정하였습니다.', 'success');
      } else {
        propModalToastAction('메뉴 순서를 수정하였습니다.', 'error');
      }

      console.log('메뉴 순서 수정 resultItem', resultItem);
      console.log('메뉴 순서 수정 arrItems', arrItems);
    });
  }


  return (
    <>
      {
        menus && menus.length > 0 ?
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
              <Box className={base.modalInner} style={{ backgroundColor: '#25233e', width: 500 }}>
                <Box mb={2}>
                  <Typography component="h2" id="transition-modal-title" style={{ fontSize: 20 }} color='primary' fontWeight='bold'>메뉴 리스트</Typography>
                </Box>
                <Paper className={base.paper}>
                  <Box style={{ maxHeight: 500, overflow: 'auto' }}>
                    {menus && menus.length > 0 &&
                      menus.map((menu: any, index: number) => (
                        <Box key={`menus-${index}`} display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' mb={1.1}>
                          <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
                            {menu.it_img1 ?
                              <img src={menu.it_img1} style={{ width: 65, height: 65, objectFit: 'cover', marginRight: 15 }} alt={`${menu.ca_name}의 썸네일`} title={`${menu.ca_name}의 썸네일`} />
                              :
                              <Box style={{ display: 'block', width: 65, height: 65, backgroundColor: '#eee', marginRight: 15 }} />
                            }
                            <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start'>
                              <Box className={menuSt.menuListTitle}>
                                <Typography component="p" mr={1} fontWeight="bold" fontSize={13}>{menu.ca_name}</Typography>
                                {menu.it_type1 === '1' ? <span className={menuSt.menuListLabel01}>대표메뉴</span> : null}
                                {menu.it_use === '1' ? <span className={menuSt.menuListLabel02}>판매중</span> : <span className={menuSt.menuListLabel03}>판매중지</span>}
                                {menu.it_soldout === '1' ? <span className={menuSt.menuListLabel05}>품절</span> : null}
                              </Box>
                              <Box className={menuSt.menuListTitle}>
                                <Typography fontSize={12}>{menu.it_name}</Typography>
                              </Box>
                              <Typography fontSize={12}>{Api.comma(menu.it_price)}원</Typography>
                            </Box>
                          </Box>

                          <input
                            type="text"
                            value={menu.it_order}
                            style={{
                              width: 50,
                              padding: 5,
                              textAlign: 'center',
                              border: 'none',
                              borderWidth: 1,
                              borderStyle: 'solid',
                              borderColor: '#c4c4c4',
                              borderRadius: 3
                            }}
                            onChange={(e: any) => {
                              const re = /^[0-9\b]+$/;
                              if (e.target.value === '' || re.test(e.target.value)) {
                                let changed = e.target.value.replace(/(^0+)/, '');
                                setMenus(prev => {
                                  const result = [...prev];
                                  result[index].it_order = changed;
                                  return result;
                                })
                              }
                            }}
                          />

                        </Box>
                      ))
                    }
                  </Box>
                </Paper>
                <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{ marginTop: 20 }}>
                  <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={onSumbmit}>수정하기</ModalConfirmButton>
                  <ModalCancelButton variant="outlined" onClick={onClose}>닫기</ModalCancelButton>
                </ButtonGroup>
              </Box>
            </Fade>
          </Modal>
          : null
      }
    </>
  )
}

export default MenuListModal;