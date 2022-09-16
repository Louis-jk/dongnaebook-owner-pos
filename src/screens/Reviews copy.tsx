import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ko';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { faReplyAll, faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
import Rating from '@material-ui/core/Rating';
import Pagination from '@material-ui/core/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';

// Material icons
import AddCommentOutlinedIcon from '@material-ui/icons/AddCommentOutlined';
import CancelIcon from '@material-ui/icons/Cancel';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import CloseIcon from '@material-ui/icons/Close';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

// Local Component
import Header from '../components/Header';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';


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
  wr_mb_id: string;
}

export default function Reviews(props: any) {

  const base = baseStyles();
  const { mt_id, mt_jumju_code, mt_store } = useSelector((state: any) => state.login);

  const [isLoading, setLoading] = React.useState(false);
  const [rate, setRate] = useState({ }); // 별점
  const [currentPage, setCurrentPage] = useState(1); // 페이지 현재 페이지
  const [startOfIndex, setStartOfIndex] = useState(0); // 페이지 API 호출 start 인덱스
  const [postPerPage, setPostPerPage] = useState(3); // 페이지 API 호출 Limit
  const [totalCount, setTotalCount] = useState(0); // 아이템 전체 갯수
  const [lists, setLists] = useState<IReview[]>([]); // 리뷰 리스트
  const [isImageOpen, setImageOpen] = useState(false); // 이미지 LightBox 오픈상태
  const [photoIndex, setPhotoIndex] = useState(0); // 이미지 LightBox 인덱스
  const [images, setImages] = useState<string[]>([]); // 리뷰 해당 이미지 저장소 (LightBox 사용때문) 
  const [deleteItId, setDeleteItId] = useState(''); // 삭제시 리뷰 아이디
  const [deleteWrId, setDeleteWrId] = useState(''); // 삭제시 리뷰어 아이디

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

  //  리뷰 가져오기
  const getReviewListHandler = () => {

    setLoading(true);

    const param = {
      bo_table: 'review',
      item_count: startOfIndex,
      limit_count: postPerPage,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    };

    Api.send('store_review_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      let toTotalCount = Number(resultItem.total_cnt);
      setTotalCount(toTotalCount);

      let totalPage = Math.ceil(toTotalCount / postPerPage);

      setTotalCount(totalPage);
      console.log("reviews resultItem", resultItem);

      if (resultItem.result === 'Y') {
        setRate(arrItems.rate);
        setLists(arrItems.review);
        setLoading(false);
      } else {
        setRate({ });
        setLists([]);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getReviewListHandler();
  }, [mt_id, mt_jumju_code, startOfIndex])


  // 리뷰 삭제 핸들러
  const deleteReviewHandler = (it_id: string, wr_id: string) => {
    setDeleteItId(it_id);
    setDeleteWrId(wr_id);
    replyModalHandleOpen();
  }

  // 답글 삭제
  const deleteReply = () => {
    const param = {
      bo_table: 'review',
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'comment_delete',
      it_id: deleteItId,
      wr_id: deleteWrId
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
        setToastState({ msg: `답글을 삭제하는데 문제가 생겼습니다.\n관리자에게 문의해주세요.`, severity: 'error' });
        handleOpenAlert();
        replyModalHandleClose();
      }
    });
  }

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
  const [reviewProfile, setRevieProfile] = useState(''); // 리뷰 유저 프로필
  const [reviewMenu, setRevieMenu] = useState(''); // 리뷰 선택 메뉴
  const [reviewRating, setReRating] = useState(''); // 리뷰 평점
  const [reviewDatetime, setRDatetime] = useState(''); // 리뷰 작성일자


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

      console.log("review param", param);

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
          setToastState({ msg: `답글을 등록하는데 문제가 생겼습니다.\n관리자에게 문의해주세요.`, severity: 'error' });
          handleOpenAlert();
          handleClose();
        }
      });
    }
  }

  const sendReplyHandler = (id: string, content: string, itId: string, userId: string, profile: string, menu: string, rating: string, datetime: string) => {
    setReviewId(id);
    setReviewContent(content);
    setReviewItId(itId);
    setReviewUserId(userId);
    setRevieProfile(profile);
    setRevieMenu(menu);
    setReRating(rating);
    setRDatetime(datetime);
    handleOpen();
  }


  return (
    <Box component="div" className={base.root}>
      {isImageOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setImageOpen(false)}
          onMovePrevRequest={() => {
            let filtered = (photoIndex + images.length - 1) % images.length;
            setPhotoIndex(filtered);
          }
          }
          onMoveNextRequest={() => {
            let filtered = (photoIndex + 1) % images.length;
            setPhotoIndex(filtered);
          }
          }
        />
      )}
      <Header type="review" />
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
      {/* 리뷰 코멘트 입력 모달 */}
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
            {/* <h2 id="transition-modal-title">코멘트 입력</h2> */}
            <IconButton color="primary" aria-label="upload picture" component="span" onClick={handleClose} style={{ position: 'absolute', top: -10, right: -10, width: 30, height: 30, color: '#fff', backgroundColor: theme.palette.primary.main }}>
              <CloseRoundedIcon />
            </IconButton>
            <Box className={clsx(base.flexRow, base.mb10)}>
              <Avatar alt={`유저아이디: ${reviewId} 님의 프로필 사진`} src={reviewProfile} className={clsx(base.large, base.mr10)} />
              <Box>
                <Grid className={base.flexRow}>
                  <Grid className={clsx(base.title, base.mb05)}>
                    <Typography variant="body1" component="b" style={{ marginRight: 10 }}>{reviewMenu}</Typography>
                    <Typography variant="body1" component="b" style={{ marginRight: 10 }}>|</Typography>
                    <Typography variant="body1" component="b" style={{ marginRight: 10 }}>{reviewUserId}</Typography>
                  </Grid>
                </Grid>
                <Grid className={clsx(base.title, base.mb05)} style={{ display: 'flex', alignItems: 'center' }}>
                  <Rating name="half-rating-read" size="small" value={Number(reviewRating)} readOnly />
                  <Typography variant="body1" component="b" style={{ marginRight: 10 }}></Typography>
                  <Typography variant="body1" component="b">{moment(reviewDatetime, 'YYYYMMDD').fromNow()}</Typography>
                </Grid>
              </Box>
            </Box>
            <Box mb={3}>
              <TextField
                value={reviewContent}
                fullWidth
                className={base.reviewMultiTxtField}
                style={{ backgroundColor: '#f7f7f7' }}
                multiline
                rows={5}
                contentEditable='false'
                focused={false}
                spellCheck={false}
                variant='outlined'
              />
            </Box>
            <TextField
              value={comment}
              fullWidth
              className={base.reviewMultiTxtField}
              id="outlined-multiline-static"
              label="답글입력"
              multiline
              rows={6}
              variant="outlined"
              onChange={e => setComment(e.target.value as string)}
            />
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{ marginTop: 20 }}>
              <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} className={base.confirmBtn} onClick={sendReply}>등록하기</ModalConfirmButton>
              <ModalCancelButton variant="outlined" className={base.confirmBtn} onClick={handleClose}>닫기</ModalCancelButton>
            </ButtonGroup>
          </div>
        </Fade>
      </Modal>
      {/* // 리뷰 코멘트 입력 모달 */}

      {/* 답글 삭제 모달 */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
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
            <h2 id="transition-modal-title" className={base.modalTitle}>답글 삭제</h2>
            <p id="transition-modal-description" className={base.modalDescription}>해당 답글을 삭제하시겠습니까?</p>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={deleteReply}>삭제하기</ModalConfirmButton>
              <ModalCancelButton fullWidth variant="outlined" onClick={replyModalHandleClose}>취소</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* // 답글 삭제 모달 */}
      {isLoading ?
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10 }}>
          <Box className={base.loadingWrap}>
            <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
          </Box>
        </MainBox>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10 }}>
          {lists && lists.length > 0 &&
            <Grid container spacing={3} style={{ minHeight: 520 }}>
              {lists.map((list, index) =>
                <Grid item xs={12} key={index + list.wr_id + list.wr_mb_id} alignContent='baseline'>
                  <Paper className={base.reviewPaper} style={{ position: 'relative' }}>
                    <Grid className={base.flexRow} alignItems='center'>
                      <Avatar alt={`유저아이디: ${list.wr_mb_id} 님의 프로필 사진`} src={list.profile} className={clsx(base.large, base.mr20)} />
                      <Grid className={base.flexColumn}>
                        <Grid className={base.flexRow}>
                          <Grid className={base.title}>
                            <Typography variant="body1" component="b" style={{ marginRight: 10 }}>{list.menu}</Typography>
                            <Typography variant="body1" component="b" style={{ marginRight: 10 }}>|</Typography>
                            <Typography variant="body1" component="b" style={{ marginRight: 10 }}>{list.wr_mb_id}</Typography>
                          </Grid>
                        </Grid>
                        <Grid className={base.title} style={{ display: 'flex', alignItems: 'center' }}>
                          <Rating name="half-rating-read" size="small" value={Number(list.rating)} readOnly />
                          <Typography variant="body1" component="b" style={{ marginRight: 10 }}></Typography>
                          <Typography variant="body1" component="b">{moment(list.datetime, 'YYYYMMDD').fromNow()}</Typography>
                          <Box style={{ position: 'absolute', right: 10, top: 10 }}>
                            {list.reply ?
                              <Button
                                color="primary"
                                disabled
                                aria-label="button"
                                startIcon={<AddCommentOutlinedIcon />}
                              >
                                답글달기
                              </Button>
                              :
                              <Button
                                color="primary"
                                aria-label="button"
                                startIcon={<AddCommentOutlinedIcon />}
                                // style={{ color: theme.palette.primary.dark }}
                                onClick={() => sendReplyHandler(list.wr_id, list.content, list.it_id, list.wr_mb_id, list.profile, list.menu, list.rating, list.datetime)}
                              >
                                답글달기
                              </Button>
                            }
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    {list.pic.length > 0 ?
                      <Grid style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }} spacing={3}>
                        {list.pic.map((image, index) =>
                          <Box key={index}>
                            <Button onClick={() => {
                              setImages(list.pic);
                              setImageOpen(true);
                            }
                            }
                            >
                              <img src={image} style={{ width: 150, height: 150, borderRadius: 5, objectFit: 'cover' }} alt={image} />
                            </Button>
                          </Box>
                        )}
                      </Grid>
                      : null}
                    <Grid className={clsx(base.flexColumn, base.mt20, base.commantWrap)}>
                      <Typography variant="body1" component="b" textAlign='left'>{list.content}</Typography>
                    </Grid>
                    {list.reply ?
                      <Grid className={clsx(base.flexColumn, base.mt10, base.commantWrap)} style={{ position: 'relative', backgroundColor: theme.palette.primary.light }}>
                        <FontAwesomeIcon icon={faReply} size="1x" rotation={180} style={{ marginRight: 10 }} />
                        <Typography variant="body1" component="b" textAlign='left'>{list.replyComment}</Typography>
                        <Box style={{ position: 'absolute', right: 10, top: 10 }}>
                          <IconButton
                            onClick={() => deleteReviewHandler(list.it_id, list.wr_id)}
                          >
                            <HighlightOffIcon color='secondary' style={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Grid>
                      : null}
                  </Paper>
                </Grid>
              )}
            </Grid>
          }
          {lists.length === 0 || lists === null ?
            <Box style={{ display: 'flex', flex: 1, height: 'calc(100vh - 160px)', justifyContent: 'center', alignItems: 'center' }}>
              <Typography style={{ fontSize: 15 }}>등록된 리뷰가 없습니다.</Typography>
            </Box>
            : null}
          {totalCount ?
            <Box mt={7} mb={3} display='flex' justifyContent='center' alignSelf="center">
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
        </MainBox>
      }
    </Box>
  );
}