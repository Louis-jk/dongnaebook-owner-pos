import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ko';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { faReplyAll, faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import Stack from '@material-ui/core/Stack';
import Pagination from '@material-ui/core/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

// Material icons
import AddCommentOutlinedIcon from '@material-ui/icons/AddCommentOutlined';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

// Local Component
import Header from '../components/Header';
import Api from '../Api';
import {
  theme,
  MainBox,
  baseStyles,
  ModalCancelButton,
  ModalConfirmButton,
} from '../styles/base';
import ThumbUp from '../assets/images/thumbup.png';

interface IReview {
  content: string;
  datetime: string;
  it_id: string;
  menu: string;
  num: string;
  pic: string[];
  pic_count: string;
  profile: string;
  rating: string;
  replayDate: string;
  reply: boolean;
  replyComment: string;
  subject: string;
  wr_id: string;
  wr_mb_nickname: string;
  wr_mb_id: string;
  wr_score1: string;
  wr_score2: string;
  wr_score3: string;
  wr_score4: string;
}

interface RateProp {
  [key: string]: number | string;
}

export default function Reviews(props: any) {
  const base = baseStyles();
  const { mt_id, mt_jumju_code, mt_store } = useSelector(
    (state: any) => state.login
  );

  const [isLoading, setLoading] = React.useState(false);
  const [rate, setRate] = useState<RateProp>({}); // 평점
  const [currentPage, setCurrentPage] = useState(1); // 페이지 현재 페이지
  const [startOfIndex, setStartOfIndex] = useState(0); // 페이지 API 호출 start 인덱스
  const [postPerPage, setPostPerPage] = useState(5); // 페이지 API 호출 Limit
  const [totalCount, setTotalCount] = useState(0); // 아이템 전체 갯수
  const [lists, setLists] = useState<IReview[]>([]); // 리뷰 리스트
  const [per01, setPer01] = useState(0); // 맛 퍼센트 (리뷰평점)
  const [per02, setPer02] = useState(0); // 또주문 퍼센트 (리뷰평점)
  const [per03, setPer03] = useState(0); // 빠른배달 퍼센트 (리뷰평점)
  const [per04, setPer04] = useState(0); // 가성비 퍼센트 (리뷰평점)
  const [isImageOpen, setImageOpen] = useState(false); // 이미지 LightBox 오픈상태
  const [photoIndex, setPhotoIndex] = useState(0); // 이미지 LightBox 인덱스
  const [images, setImages] = useState<string[]>([]); // 리뷰 해당 이미지 저장소 (LightBox 사용때문)
  const [deleteItId, setDeleteItId] = useState(''); // 삭제시 리뷰 아이디
  const [deleteWrId, setDeleteWrId] = useState(''); // 삭제시 리뷰어 아이디

  // Toast(Alert) 관리
  const [toastState, setToastState] = React.useState({
    msg: '',
    severity: '',
  });
  const [openAlert, setOpenAlert] = React.useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  // 리뷰 각 progress
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    width: 400,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#ffc739' : '#1c1b30',
    },
  }));

  //  리뷰 가져오기
  const getReviewListHandler = () => {
    setLoading(true);

    const param = {
      bo_table: 'review',
      item_count: startOfIndex,
      limit_count: postPerPage,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
    };

    Api.send('store_review_list2', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      let toTotalCount = Number(resultItem.total_cnt);
      setTotalCount(toTotalCount);

      let totalPage = Math.ceil(toTotalCount / postPerPage);

      setTotalCount(totalPage);

      if (resultItem.result === 'Y') {
        console.log('arrItems', arrItems);

        setRate(arrItems.rate);
        if (arrItems.review && arrItems.review.length > 0) {
          setLists(arrItems.review);
        } else {
          setLists([]);
        }
        setPer01(arrItems.rate.rating_per1 * 100);
        setPer02(arrItems.rate.rating_per2 * 100);
        setPer03(arrItems.rate.rating_per3 * 100);
        setPer04(arrItems.rate.rating_per4 * 100);
        setLoading(false);
      } else {
        setRate({});
        setLists([]);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getReviewListHandler();
  }, [mt_id, mt_jumju_code, startOfIndex]);

  // 리뷰 삭제 핸들러
  const deleteReviewHandler = (it_id: string, wr_id: string) => {
    setDeleteItId(it_id);
    setDeleteWrId(wr_id);
    replyModalHandleOpen();
  };

  // 답글 삭제
  const deleteReply = () => {
    const param = {
      bo_table: 'review',
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'comment_delete',
      it_id: deleteItId,
      wr_id: deleteWrId,
    };

    Api.send('store_review_comment', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        setToastState({ msg: '답글을 삭제하였습니다.', severity: 'success' });
        handleOpenAlert();
        setTimeout(() => {
          getReviewListHandler();
          replyModalHandleClose();
        }, 700);
      } else {
        setToastState({
          msg: `답글을 삭제하는데 문제가 생겼습니다.\n관리자에게 문의해주세요.`,
          severity: 'error',
        });
        handleOpenAlert();
        replyModalHandleClose();
      }
    });
  };

  // 페이지 전환 핸들러
  const pageHandleChange = (event: any, value: any) => {
    if (value === 1 || value < 1) {
      setStartOfIndex(0);
    } else {
      let start = (value - 1) * postPerPage;
      setStartOfIndex(start);
    }
    setCurrentPage(value);
  };

  // 답글 삭제 전 모달
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const replyModalHandleOpen = () => {
    setReplyModalOpen(true);
  };

  const replyModalHandleClose = () => {
    setReplyModalOpen(false);
  };

  // 코멘트 모달
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [comment, setComment] = useState(''); // 리뷰 답글(업주 -> 고객)
  const [reviewId, setReviewId] = useState(''); // 리뷰 아이디
  const [reviewContent, setReviewContent] = useState(''); // 리뷰 컨텐츠(고객이 남긴 리뷰)
  const [reviewItId, setReviewItId] = useState(''); // 리뷰 메뉴 아이디
  const [reviewUserId, setReviewUserId] = useState(''); // 리뷰 유저 아이디
  const [reviewUserNick, setReviewUserNick] = useState(''); // 리뷰 유저 닉네임
  const [reviewProfile, setRevieProfile] = useState(''); // 리뷰 유저 프로필
  const [reviewMenu, setRevieMenu] = useState(''); // 리뷰 선택 메뉴
  const [reviewScore01, setReScore01] = useState(''); // 리뷰 스코어01
  const [reviewScore02, setReScore02] = useState(''); // 리뷰 스코어02
  const [reviewScore03, setReScore03] = useState(''); // 리뷰 스코어03
  const [reviewScore04, setReScore04] = useState(''); // 리뷰 스코어04
  const [reviewDatetime, setRDatetime] = useState(''); // 리뷰 작성일자
  const [reviewPic, setReviewPic] = useState<string[]>([]); // 리뷰 포토

  const sendReply = () => {
    if (comment === '' || comment === null) {
      setToastState({ msg: '답글을 작성해주세요.', severity: 'error' });
      handleOpenAlert();
    } else {
      const param = {
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        bo_table: 'review',
        it_id: reviewItId,
        wr_id: reviewId,
        mode: 'comment',
        wr_content: comment,
        wr_name: mt_store,
      };

      Api.send('store_review_comment', param, (args: any) => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y') {
          setToastState({ msg: '답글을 등록하였습니다.', severity: 'success' });
          handleOpenAlert();
          setTimeout(() => {
            getReviewListHandler();
            setComment('');
            handleClose();
          }, 700);
        } else {
          setToastState({
            msg: `답글을 등록하는데 문제가 생겼습니다.\n관리자에게 문의해주세요.`,
            severity: 'error',
          });
          handleOpenAlert();
          handleClose();
        }
      });
    }
  };

  const sendReplyHandler = (
    id: string,
    nickname: string,
    content: string,
    itId: string,
    userId: string,
    profile: string,
    menu: string,
    score1: string,
    score2: string,
    score3: string,
    score4: string,
    datetime: string,
    pic: string[]
  ) => {
    setReviewId(id);
    setReviewContent(content);
    setReviewItId(itId);
    setReviewUserId(userId);
    setReviewUserNick(nickname);
    setRevieProfile(profile);
    setRevieMenu(menu);
    setReScore01(score1);
    setReScore02(score2);
    setReScore03(score3);
    setReScore04(score4);
    setRDatetime(datetime);
    setReviewPic(pic);
    handleOpen();
  };

  return (
    <Box component='div' className={base.root}>
      {isImageOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setImageOpen(false)}
          onMovePrevRequest={() => {
            let filtered = (photoIndex + images.length - 1) % images.length;
            setPhotoIndex(filtered);
          }}
          onMoveNextRequest={() => {
            let filtered = (photoIndex + 1) % images.length;
            setPhotoIndex(filtered);
          }}
        />
      )}
      <Header type='review' />
      <Box className={base.alertStyle}>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={openAlert}
          autoHideDuration={5000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={toastState.severity === 'error' ? 'error' : 'success'}
          >
            {toastState.msg}
          </Alert>
        </Snackbar>
      </Box>
      {/* 리뷰 코멘트 입력 모달 */}
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
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
            {/* <h2 id="transition-modal-title">코멘트 입력</h2> */}
            <IconButton
              color='primary'
              aria-label='upload picture'
              component='span'
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 30,
                height: 30,
                color: '#fff',
                backgroundColor: theme.palette.primary.main,
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
            <Box
              className={clsx(base.flexRow, base.mb10)}
              justifyContent='flex-start'
              alignItems='center'
            >
              <Avatar
                alt={`유저아이디: ${reviewId} 님의 프로필 사진`}
                src={reviewProfile}
                className={clsx(base.large, base.mr10)}
              />
              <Box>
                <Grid className={base.flexRow}>
                  <Grid className={clsx(base.title, base.mb05)}>
                    <Typography
                      variant='body1'
                      component='b'
                      style={{ marginRight: 10 }}
                    >
                      {reviewUserNick}
                    </Typography>
                    <Typography variant='body1' component='b' color='#999'>
                      {moment(reviewDatetime, 'YYYYMMDD').fromNow()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Grid
              className={clsx(base.title, base.mb10)}
              display='flex'
              flexDirection='row'
              justifyContent='space-between'
              alignItems='center'
              mt={2}
            >
              <Box
                display='flex'
                flexDirection='row'
                justifyContent='center'
                alignItems='center'
                mx={0.5}
                style={{
                  width: '100%',
                  borderWidth: 1,
                  borderColor: reviewScore01 === '1' ? '#222' : '#E3E3E3',
                  borderStyle: 'solid',
                  borderRadius: 10,
                  padding: '7px 10px',
                }}
              >
                <Typography
                  fontSize={11}
                  style={{ color: reviewScore01 === '1' ? '#222' : '#888888' }}
                >
                  맛
                </Typography>
                <Typography
                  fontSize={9}
                  style={{
                    backgroundColor: reviewScore01 === '1' ? '#222' : '#e3e3e3',
                    color: '#fff',
                    borderRadius: 5,
                    padding: '1px 10px',
                  }}
                  ml={0.7}
                >
                  BEST
                </Typography>
              </Box>
              <Box
                display='flex'
                flexDirection='row'
                justifyContent='center'
                alignItems='center'
                mx={0.5}
                style={{
                  width: '100%',
                  borderWidth: 1,
                  borderColor: reviewScore02 === '1' ? '#222' : '#E3E3E3',
                  borderStyle: 'solid',
                  borderRadius: 10,
                  padding: '7px 10px',
                }}
              >
                <Typography
                  fontSize={11}
                  style={{ color: reviewScore02 === '1' ? '#222' : '#888888' }}
                >
                  또 주문
                </Typography>
                <Typography
                  fontSize={9}
                  style={{
                    backgroundColor: reviewScore02 === '1' ? '#222' : '#e3e3e3',
                    color: '#fff',
                    borderRadius: 5,
                    padding: '1px 10px',
                  }}
                  ml={0.7}
                >
                  BEST
                </Typography>
              </Box>
              <Box
                display='flex'
                flexDirection='row'
                justifyContent='center'
                alignItems='center'
                mx={0.5}
                style={{
                  width: '100%',
                  borderWidth: 1,
                  borderColor: reviewScore03 === '1' ? '#222' : '#E3E3E3',
                  borderStyle: 'solid',
                  borderRadius: 10,
                  padding: '7px 10px',
                }}
              >
                <Typography
                  fontSize={11}
                  style={{ color: reviewScore03 === '1' ? '#222' : '#888888' }}
                >
                  빠른배달
                </Typography>
                <Typography
                  fontSize={9}
                  style={{
                    backgroundColor: reviewScore03 === '1' ? '#222' : '#e3e3e3',
                    color: '#fff',
                    borderRadius: 5,
                    padding: '1px 10px',
                  }}
                  ml={0.7}
                >
                  BEST
                </Typography>
              </Box>
              <Box
                display='flex'
                flexDirection='row'
                justifyContent='center'
                alignItems='center'
                mx={0.5}
                style={{
                  width: '100%',
                  borderWidth: 1,
                  borderColor: reviewScore04 === '1' ? '#222' : '#E3E3E3',
                  borderStyle: 'solid',
                  borderRadius: 10,
                  padding: '7px 10px',
                }}
              >
                <Typography
                  fontSize={11}
                  style={{ color: reviewScore04 === '1' ? '#222' : '#888888' }}
                >
                  가성비
                </Typography>
                <Typography
                  fontSize={9}
                  style={{
                    backgroundColor: reviewScore04 === '1' ? '#222' : '#e3e3e3',
                    color: '#fff',
                    borderRadius: 5,
                    padding: '1px 10px',
                  }}
                  ml={0.7}
                >
                  BEST
                </Typography>
              </Box>
            </Grid>
            {reviewPic.length > 0 ? (
              <Grid
                display='flex'
                flexDirection='row'
                justifyContent='flex-start'
                alignItems='center'
                mt={2}
                mb={3}
              >
                {reviewPic.map((image, index) => (
                  <Box
                    key={index}
                    height={100}
                    style={{
                      width: 'calc(100% / 5)',
                      marginRight: index !== reviewPic.length - 1 ? 10 : 0,
                    }}
                  >
                    <img
                      src={image}
                      style={{
                        width: '100%',
                        height: '100%',
                        margin: 0,
                        padding: 0,
                        borderRadius: 5,
                        objectFit: 'cover',
                      }}
                      alt={image}
                    />
                  </Box>
                ))}
              </Grid>
            ) : null}
            <TextField
              value={comment}
              fullWidth
              className={base.reviewMultiTxtField}
              id='outlined-multiline-static'
              label='답글입력'
              multiline
              rows={6}
              variant='outlined'
              onChange={(e) => setComment(e.target.value as string)}
            />
            <ButtonGroup
              variant='text'
              color='primary'
              aria-label='text primary button group'
              style={{ marginTop: 20 }}
            >
              <ModalConfirmButton
                variant='contained'
                style={{ boxShadow: 'none' }}
                className={base.confirmBtn}
                onClick={sendReply}
              >
                등록하기
              </ModalConfirmButton>
              <ModalCancelButton
                variant='outlined'
                className={base.confirmBtn}
                onClick={handleClose}
              >
                닫기
              </ModalCancelButton>
            </ButtonGroup>
          </div>
        </Fade>
      </Modal>
      {/* // 리뷰 코멘트 입력 모달 */}

      {/* 답글 삭제 모달 */}
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={base.modal}
        open={replyModalOpen}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={replyModalOpen}>
          <Box className={clsx(base.modalInner, base.colCenter)}>
            <h2 id='transition-modal-title' className={base.modalTitle}>
              답글 삭제
            </h2>
            <p
              id='transition-modal-description'
              className={base.modalDescription}
            >
              해당 답글을 삭제하시겠습니까?
            </p>
            <ButtonGroup
              variant='text'
              color='primary'
              aria-label='text primary button group'
            >
              <ModalConfirmButton
                variant='contained'
                style={{ boxShadow: 'none' }}
                onClick={deleteReply}
              >
                삭제하기
              </ModalConfirmButton>
              <ModalCancelButton
                fullWidth
                variant='outlined'
                onClick={replyModalHandleClose}
              >
                취소
              </ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* // 답글 삭제 모달 */}
      {isLoading ? (
        <MainBox
          component='main'
          sx={{ flexGrow: 1, p: 3 }}
          style={{ borderTopLeftRadius: 10 }}
        >
          <Box className={base.loadingWrap}>
            <CircularProgress
              disableShrink
              color='primary'
              style={{ width: 50, height: 50 }}
            />
          </Box>
        </MainBox>
      ) : (
        <MainBox
          component='main'
          sx={{ flexGrow: 1, p: 3 }}
          style={{ borderTopLeftRadius: 10 }}
        >
          {lists && rate && (
            <Grid container spacing={3} mb={3}>
              <Grid
                item
                xs={12}
                display='flex'
                flexDirection='row'
                justifyContent='flex-start'
                alignItems='flex-start'
              >
                <Grid
                  item
                  xs={12}
                  md={10}
                  display='flex'
                  flexDirection='column'
                  justifyContent='flex-start'
                  alignItems='flex-start'
                >
                  <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='center'
                    alignItems='center'
                    mb={1}
                  >
                    <BorderLinearProgress variant='determinate' value={per01} />
                    <Typography
                      ml={1}
                      style={{ color: '#888' }}
                    >{`맛 ${rate.wr_score1}`}</Typography>
                  </Box>
                  <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='center'
                    alignItems='center'
                    mb={1}
                  >
                    <BorderLinearProgress variant='determinate' value={per02} />
                    <Typography
                      ml={1}
                      style={{ color: '#888' }}
                    >{`또 주문 ${rate.wr_score2}`}</Typography>
                  </Box>
                  <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='center'
                    alignItems='center'
                    mb={1}
                  >
                    <BorderLinearProgress variant='determinate' value={per03} />
                    <Typography
                      ml={1}
                      style={{ color: '#888' }}
                    >{`빠른배달 ${rate.wr_score3}`}</Typography>
                  </Box>
                  <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='center'
                    alignItems='center'
                    mb={1}
                  >
                    <BorderLinearProgress variant='determinate' value={per04} />
                    <Typography
                      ml={1}
                      style={{ color: '#888' }}
                    >{`가성비 ${rate.wr_score4}`}</Typography>
                  </Box>
                </Grid>
                <div
                  style={{
                    width: 1,
                    height: '90%',
                    backgroundColor: '#e3e3e3',
                  }}
                ></div>
                <Grid item xs={12} md={5}>
                  <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='center'
                    alignItems='center'
                  >
                    <img
                      src={ThumbUp}
                      style={{ width: 148, height: 122, objectFit: 'cover' }}
                      alt='리뷰아이콘'
                    />
                    <Typography
                      fontSize={24}
                      fontWeight='bold'
                      style={{ color: '#222' }}
                    >
                      {rate.max_score_value}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          )}
          <Button variant='contained' fullWidth sx={{ mb: 3, py: 1.5 }}>
            <Typography fontWeight='bold' color='#333'>
              리뷰 공지 작성
            </Typography>
          </Button>

          {lists && lists.length > 0 && (
            <Grid container spacing={3} style={{ minHeight: 520 }}>
              {lists.map((list, index) => (
                <Grid
                  item
                  xs={12}
                  key={index + list.wr_id + list.wr_mb_id}
                  alignContent='baseline'
                >
                  <Paper
                    className={base.reviewPaper}
                    style={{ position: 'relative' }}
                  >
                    <Grid className={base.flexRow} alignItems='center'>
                      <Avatar
                        alt={`유저아이디: ${list.wr_mb_nickname} 님의 프로필 사진`}
                        src={list.profile}
                        className={clsx(base.large, base.mr20)}
                      />
                      <Grid className={base.flexColumn}>
                        <Grid className={base.flexRow}>
                          <Grid className={base.title}>
                            {/* <Typography variant="body1" component="b" style={{ marginRight: 10 }}>{list.menu}</Typography>
                            <Typography variant="body1" component="b" style={{ marginRight: 10 }}>|</Typography> */}
                            <Typography
                              variant='body1'
                              component='b'
                              style={{ marginRight: 10 }}
                            >
                              {list.wr_mb_nickname}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          className={base.title}
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant='body1'
                            component='b'
                            style={{ color: '#999' }}
                          >
                            {moment(list.datetime, 'YYYYMMDD').fromNow()}
                          </Typography>
                          <Box
                            style={{ position: 'absolute', right: 10, top: 10 }}
                          >
                            {list.reply ? (
                              <Button
                                color='primary'
                                disabled
                                aria-label='button'
                                startIcon={<AddCommentOutlinedIcon />}
                              >
                                답글달기
                              </Button>
                            ) : (
                              <Button
                                color='primary'
                                aria-label='button'
                                startIcon={<AddCommentOutlinedIcon />}
                                // style={{ color: theme.palette.primary.dark }}
                                onClick={() =>
                                  sendReplyHandler(
                                    list.wr_id,
                                    list.wr_mb_nickname,
                                    list.content,
                                    list.it_id,
                                    list.wr_mb_id,
                                    list.profile,
                                    list.menu,
                                    list.wr_score1,
                                    list.wr_score2,
                                    list.wr_score3,
                                    list.wr_score4,
                                    list.datetime,
                                    list.pic
                                  )
                                }
                              >
                                답글달기
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      display='flex'
                      flexDirection='row'
                      justifyContent='space-between'
                      alignItems='center'
                      mt={2}
                      ml={7}
                    >
                      <Box
                        display='flex'
                        flexDirection='row'
                        justifyContent='center'
                        alignItems='center'
                        mx={0.5}
                        style={{
                          width: '100%',
                          borderWidth: 1,
                          borderColor:
                            list.wr_score1 === '1' ? '#222' : '#E3E3E3',
                          borderStyle: 'solid',
                          borderRadius: 10,
                          padding: '7px 10px',
                        }}
                      >
                        <Typography
                          fontSize={16}
                          style={{
                            color: list.wr_score1 === '1' ? '#222' : '#888888',
                          }}
                        >
                          맛
                        </Typography>
                        <Typography
                          fontSize={12}
                          style={{
                            backgroundColor:
                              list.wr_score1 === '1' ? '#222' : '#e3e3e3',
                            color: '#fff',
                            borderRadius: 5,
                            padding: '1px 10px',
                          }}
                          ml={0.7}
                        >
                          BEST
                        </Typography>
                      </Box>
                      <Box
                        display='flex'
                        flexDirection='row'
                        justifyContent='center'
                        alignItems='center'
                        mx={0.5}
                        style={{
                          width: '100%',
                          borderWidth: 1,
                          borderColor:
                            list.wr_score2 === '1' ? '#222' : '#E3E3E3',
                          borderStyle: 'solid',
                          borderRadius: 10,
                          padding: '7px 10px',
                        }}
                      >
                        <Typography
                          fontSize={16}
                          style={{
                            color: list.wr_score2 === '1' ? '#222' : '#888888',
                          }}
                        >
                          또 주문
                        </Typography>
                        <Typography
                          fontSize={12}
                          style={{
                            backgroundColor:
                              list.wr_score2 === '1' ? '#222' : '#e3e3e3',
                            color: '#fff',
                            borderRadius: 5,
                            padding: '1px 10px',
                          }}
                          ml={0.7}
                        >
                          BEST
                        </Typography>
                      </Box>
                      <Box
                        display='flex'
                        flexDirection='row'
                        justifyContent='center'
                        alignItems='center'
                        mx={0.5}
                        style={{
                          width: '100%',
                          borderWidth: 1,
                          borderColor:
                            list.wr_score3 === '1' ? '#222' : '#E3E3E3',
                          borderStyle: 'solid',
                          borderRadius: 10,
                          padding: '7px 10px',
                        }}
                      >
                        <Typography
                          fontSize={16}
                          style={{
                            color: list.wr_score3 === '1' ? '#222' : '#888888',
                          }}
                        >
                          빠른배달
                        </Typography>
                        <Typography
                          fontSize={12}
                          style={{
                            backgroundColor:
                              list.wr_score3 === '1' ? '#222' : '#e3e3e3',
                            color: '#fff',
                            borderRadius: 5,
                            padding: '1px 10px',
                          }}
                          ml={0.7}
                        >
                          BEST
                        </Typography>
                      </Box>
                      <Box
                        display='flex'
                        flexDirection='row'
                        justifyContent='center'
                        alignItems='center'
                        mx={0.5}
                        style={{
                          width: '100%',
                          borderWidth: 1,
                          borderColor:
                            list.wr_score4 === '1' ? '#222' : '#E3E3E3',
                          borderStyle: 'solid',
                          borderRadius: 10,
                          padding: '7px 10px',
                        }}
                      >
                        <Typography
                          fontSize={16}
                          style={{
                            color: list.wr_score4 === '1' ? '#222' : '#888888',
                          }}
                        >
                          가성비
                        </Typography>
                        <Typography
                          fontSize={12}
                          style={{
                            backgroundColor:
                              list.wr_score4 === '1' ? '#222' : '#e3e3e3',
                            color: '#fff',
                            borderRadius: 5,
                            padding: '1px 10px',
                          }}
                          ml={0.7}
                        >
                          BEST
                        </Typography>
                      </Box>
                    </Grid>
                    {list.pic.length > 0 ? (
                      <Grid
                        display='flex'
                        flexDirection='row'
                        justifyContent='flex-start'
                        alignItems='center'
                        mt={2}
                        mb={3}
                        ml={7}
                      >
                        {list.pic.map((image, index) => (
                          <Box
                            key={index}
                            height={140}
                            style={{
                              width: 'calc(100% / 5)',
                              marginRight:
                                index !== list.pic.length - 1 ? 10 : 0,
                            }}
                          >
                            <Button
                              style={{
                                width: '100%',
                                height: '100%',
                                margin: 0,
                                padding: 0,
                              }}
                              onClick={() => {
                                setImages(list.pic);
                                setPhotoIndex(index);
                                setImageOpen(true);
                              }}
                            >
                              <img
                                src={image}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: 5,
                                  objectFit: 'cover',
                                }}
                                alt={image}
                              />
                            </Button>
                          </Box>
                        ))}
                      </Grid>
                    ) : null}
                    {list.reply ? (
                      <Grid
                        className={clsx(
                          base.flexColumn,
                          base.mt10,
                          base.commantWrap
                        )}
                        style={{
                          position: 'relative',
                          backgroundColor: theme.palette.primary.light,
                        }}
                        ml={7}
                      >
                        <FontAwesomeIcon
                          icon={faReply}
                          size='1x'
                          rotation={180}
                          style={{ marginRight: 10 }}
                        />
                        <Typography
                          variant='body1'
                          component='b'
                          textAlign='left'
                        >
                          {list.replyComment}
                        </Typography>
                        <Box
                          style={{ position: 'absolute', right: 10, top: 10 }}
                        >
                          <IconButton
                            onClick={() =>
                              deleteReviewHandler(list.it_id, list.wr_id)
                            }
                          >
                            <HighlightOffIcon
                              color='secondary'
                              style={{ fontSize: 16 }}
                            />
                          </IconButton>
                        </Box>
                      </Grid>
                    ) : null}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
          {lists.length === 0 || lists === null ? (
            <Box
              style={{
                display: 'flex',
                flex: 1,
                height: 'calc(100vh - 160px)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography style={{ fontSize: 15 }}>
                등록된 리뷰가 없습니다.
              </Typography>
            </Box>
          ) : null}
          {totalCount ? (
            <Box
              mt={7}
              mb={3}
              display='flex'
              justifyContent='center'
              alignSelf='center'
            >
              <Stack spacing={2}>
                <Pagination
                  color='primary'
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
          ) : null}
        </MainBox>
      )}
    </Box>
  );
}
