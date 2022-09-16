import React, { useState, useEffect, useRef, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/core/Pagination';
import Stack from '@material-ui/core/Stack';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import Select from '@material-ui/core/Select';
import NativeSelect from '@mui/material/NativeSelect';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@mui/material/InputBase';

// Material icons
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Component
import Api from '../Api';
import Header from '../components/Header';
import { MainBox, theme, baseStyles } from '../styles/base';
import { MenuStyles } from '../styles/custom';
import MenuListModal from '../components/MenuListModal';


interface Props {
  [key: string]: string;
}

interface IMenu {
  ca_name: string;
  ca_code: string;
}

interface ICategory {
  label: string;
  value: string;
}

export default function MenuList(props: any) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const base = baseStyles();
  const menu = MenuStyles();
  const params: any = useParams();
  const history = useHistory();

  const [isLoading, setLoading] = useState(false);
  const [lists, setLists] = useState<Props[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 페이지 현재 페이지
  const [startOfIndex, setStartOfIndex] = useState(0); // 페이지 API 호출 start 인덱스
  const [postPerPage, setPostPerPage] = useState(6); // 페이지 API 호출 Limit
  const [menuTotalCount, setMenuTotalCount] = useState(0); // 테스트중
  const [totalCount, setTotalCount] = useState(0); // 아이템 전체 갯수
  const [category, setCategory] = useState(''); // 카테고리 지정값

  // 현재 메뉴 
  const indexOfLastList = currentPage * postPerPage;
  const indexOfFirstList = indexOfLastList - postPerPage;
  const currentLists = lists.slice(indexOfFirstList, indexOfLastList);


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

        let newArr: any[] = [
          {
            label: '전체',
            value: 'all'
          }
        ];

        arrItems.map((menu: IMenu) => {
          newArr.push(
            {
              label: menu.ca_name,
              value: menu.ca_code
            })
        });

        setMenuCategory(newArr);

        setLoading(false);
      } else {
        setLoading(false);
        console.log('메뉴를 가져오지 못했습니다.');
      }
    });
  }

  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      fontSize: 14,
      marginTop: theme.spacing(1),
    },
    '& .MuiInputBase-input': {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.secondary.main}`,
      fontSize: 14,
      // padding: '10px 26px 10px 12px',
      padding: '2px 26px 5px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        // borderColor: '#80bdff',
        // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        borderColor: 'none',
        boxShadow: 'none',
      },
    },
  }));

  console.log("category ?", category);
  console.log("menuCategory ?", menuCategory);

  const handleClick = (value: string) => {
    setCurrentPage(1);
    setStartOfIndex(0);
    history.push(`/menu/${value}`);
  }

  // 전체 메뉴 가져오기 핸들러
  const getAllMenusHandler = () => {
    setLoading(true);

    const param = {
      item_count: startOfIndex,
      limit_count: postPerPage,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      ca_code: 'all'
    };

    console.log("all get param ?", param);

    Api.send('store_item_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      console.log('all메뉴 resultItem', resultItem);
      console.log('all메뉴 arrItems', arrItems);

      let toTotalCount = Number(resultItem.total_cnt);
      setMenuTotalCount(toTotalCount);

      if (resultItem.result === 'Y') {
        // setLists(arrItems);
        setLoading(false);
      } else {
        // setLists([]);
        setLoading(false);
      }
    });
  }


  // 메뉴 가져오기 핸들러
  const getMenusHandler = () => {
    setLoading(true);

    const param = {
      item_count: startOfIndex,
      limit_count: postPerPage,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      ca_code: params.categoryId
    };

    console.log("param ?", param);

    Api.send('store_item_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      console.log('메뉴 arrItems', arrItems);

      let toTotalCount = Number(resultItem.total_cnt);
      setTotalCount(toTotalCount);

      let totalPage = Math.ceil(toTotalCount / postPerPage);

      setTotalCount(totalPage);

      console.log("args", args);
      console.log("resultItem total_cnt", resultItem.total_cnt);

      if (resultItem.result === 'Y') {
        setLists(arrItems);
        setLoading(false);
      } else {
        setLists([]);
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    if (typeof params.categoryId === undefined) {
      console.log('출력?');
      setCategory('all');
    } else {
      setCategory(params.categoryId);
    }
  }, [params.categoryId])

  useEffect(() => {
    getCategoryHandler();
  }, [mt_id, mt_jumju_code])

  useEffect(() => {
    if (params.categoryId && typeof params.categoryId === 'string') {
      getAllMenusHandler();
      getMenusHandler();
    }
  }, [mt_id, mt_jumju_code, startOfIndex, params.categoryId])

  console.log("currentPage", currentPage);
  console.log("postPerPage", postPerPage);


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

  // 메뉴 정렬 모달 핸들러
  const [menuListModalOpen, setMenuListModalOpen] = useState<boolean>(false);
  const onListModalHandler = () => {
    setMenuListModalOpen(!menuListModalOpen);
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

  const propModalToastAction = (msg: string, severity: string) => {
    setToastState({ msg, severity });
    handleOpenAlert();
  }

  return (
    <Box component="div" className={base.root}>
      <Header type="menu" />
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
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ position: 'relative', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
          <Box className={base.loadingWrap}>
            <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
          </Box>
        </MainBox>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ position: 'relative', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>

          {menuListModalOpen &&
            <MenuListModal open={menuListModalOpen} onClose={onListModalHandler} reflesh={getMenusHandler} propModalToastAction={propModalToastAction} />
          }

          <Box mt={3} />
          {lists && lists.length > 0 &&
            <Grid container spacing={3}>
              {lists.map((list, index) => (
                <Grid key={list.it_id} item xs={12} md={6} alignContent='baseline'>
                  <Link to={`/menu_edit/${list.it_id}`}>
                    <Paper className={menu.menuListPaper}>
                      <Box className={menu.menuListWrap}>
                        {list.it_img1 &&
                          <Box>
                            <img src={list.it_img1} className={menu.menuListImg} alt={list.it_name} />
                          </Box>
                        }
                        <Box className={menu.menuListTextWrap}>
                          <Box className={menu.menuListTitle}>
                            <Typography component="p" mr={1} fontWeight="bold">{list.ca_name}</Typography>
                            {list.it_type1 === '1' ? <span className={menu.menuListLabel01}>대표메뉴</span> : null}
                            {list.it_use === '1' ? <span className={menu.menuListLabel02}>판매중</span> : <span className={menu.menuListLabel03}>판매중지</span>}
                            {list.it_soldout === '1' ? <span className={menu.menuListLabel05}>품절</span> : null}
                          </Box>
                          <Box className={menu.menuListTitle} flexWrap='wrap'>
                            {list.it_type3 === '1' ? <span className={menu.menuListLabel04}>추천</span> : null}
                            {list.it_type4 === '1' ? <span className={menu.menuListLabel04}>신메뉴</span> : null}
                            {list.it_type5 === '1' ? <span className={menu.menuListLabel04}>인기</span> : null}
                            {list.it_type7 === '1' ? <span className={menu.menuListLabel04}>1인분</span> : null}
                            {list.it_type8 === '1' ? <span className={menu.menuListLabel04}>계절별미</span> : null}
                          </Box>
                          <p className={menu.menuListName}>{list.it_name}</p>
                          <p className={menu.menuListPrice}>{Api.comma(list.it_price)}원</p>
                        </Box>
                      </Box>
                    </Paper>
                  </Link>
                </Grid>
              ))}
            </Grid>
          }

          {/* 등록된 메뉴 없을 때 */}
          {lists.length === 0 || lists === null ?
            <Box style={{ display: 'flex', flex: 1, height: 'calc(100vh - 160px)', justifyContent: 'center', alignItems: 'center' }}>
              <Typography style={{ fontSize: 15 }}>등록된 메뉴가 없습니다.</Typography>
            </Box>
            : null}
          {/* // 등록된 메뉴 없을 때 */}

          <Box py={1} />

          <Box
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            style={{
              position: 'absolute',
              left: 20,
              right: 10,
              bottom: 83
            }}
          >
            {menuTotalCount && menuTotalCount > 0 ?
              <Button
                variant='outlined'
                color='secondary'
                className={clsx(base.confirmBtn, base.ml20)}
                style={{ height: 30, minWidth: 100, fontSize: 14, boxShadow: 'none' }}
                onClick={onListModalHandler}
              >
                메뉴 정렬
              </Button>
              :
              <Box>&nbsp;</Box>
            }
            {menuCategory && menuCategory.length > 0 &&
              <FormControl sx={{ m: 1, minWidth: 80 }}>
                {/* <InputLabel id="demo-simple-select-autowidth-label">전체</InputLabel> */}
                <NativeSelect
                  value={category}
                  onChange={e => handleClick(e.target.value as string)}
                  input={<BootstrapInput />}
                  required
                  defaultValue={'all'}
                >
                  {menuCategory.map((category, index) => (
                    <option key={index} value={category.value}>{category.label}</option>
                  ))}
                </NativeSelect>
              </FormControl>
            }
          </Box>

          {/* 페이지네이션 */}
          {totalCount ?
            <Box mt={7} display='flex' justifyContent='center' alignSelf="center"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 40
              }}
            >
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
          {/* // 페이지네이션 */}
        </MainBox>
      }
    </Box >
  );
}