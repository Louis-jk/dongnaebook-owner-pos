import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";

// Material UI Components
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/core/Alert";
import Pagination from "@material-ui/core/Pagination";
import Stack from "@material-ui/core/Stack";

// Material icons
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import CircularProgress from "@material-ui/core/CircularProgress";

// Local Component
import Header from "../components/Header";
import Api from "../Api";
import { theme, MainBox, baseStyles } from "../styles/base";
import { ModalCancelButton, ModalConfirmButton } from "../styles/customButtons";

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

interface ITips {
  dd_id: string;
  dd_charge_start: string;
  dd_charge_end: string;
  dd_charge_price: string;
}

export default function Tips(props: any) {
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);

  const base = baseStyles();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // ????????? ?????? ?????????
  const [startOfIndex, setStartOfIndex] = useState(0); // ????????? API ?????? start ?????????
  const [postPerPage, setPostPerPage] = useState(3); // ????????? API ?????? Limit
  const [totalCount, setTotalCount] = useState(0); // ????????? ?????? ??????
  const [lists, setLists] = useState<ITips[]>([
    {
      dd_id: "",
      dd_charge_start: "",
      dd_charge_end: "",
      dd_charge_price: "",
    },
  ]);

  const [tipNo, setTipNo] = useState(0); // ????????? No
  const [tipId, setTipId] = useState(""); // ????????? ?????????
  const [minPrice, setMinPrice] = useState(""); // ???????????? ??????
  const [maxPrice, setMaxPrice] = useState(""); // ???????????? ??????
  const [tipPrice, setTipPrice] = useState(""); // ????????? ??????

  // ????????? ?????? ?????? ??????
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // ????????? ?????? ?????? ??????
  const [openEdit, setOpenEdit] = useState(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  // ????????? ?????? ?????? ??? ??????
  const editModalHandler = (
    no: number,
    id: string,
    min: string,
    max: string,
    tip: string
  ) => {
    setTipNo(no);
    setTipId(id);
    setMinPrice(min);
    setMaxPrice(max);
    setTipPrice(tip);
    handleEditOpen();
  };

  // ????????? ?????? ?????? ?????? ??? ??????
  const editCloseModalHandler = () => {
    setTipNo(0);
    setTipId("");
    setMinPrice("");
    setMaxPrice("");
    setTipPrice("");
    handleEditClose();
  };

  // ????????? ?????? ?????? ??????
  const [openTip, setOpenTip] = useState(false);

  const handleOpenTip = () => {
    setOpenTip(true);
  };

  const handleCloseTip = () => {
    setOpenTip(false);
  };

  // Toast(Alert) ??????
  const [toastState, setToastState] = useState({
    msg: "",
    severity: "",
  });
  const [openAlert, setOpenAlert] = useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  // ????????? ??? ?????? ????????????
  const getTipsHandler = () => {
    setLoading(true);

    const param = {
      item_count: startOfIndex,
      limit_count: postPerPage,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
    };

    Api.send("store_delivery", param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      let toTotalCount = Number(resultItem.total_cnt);
      setTotalCount(toTotalCount);

      let totalPage = Math.ceil(toTotalCount / postPerPage);

      setTotalCount(totalPage);

      if (resultItem.result === "Y") {
        setLists(arrItems);
        setLoading(false);
      } else {
        setLists([]);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getTipsHandler();
  }, [mt_id, mt_jumju_code, startOfIndex]);

  // ????????? ?????? ?????????
  const pageHandleChange = (event: any, value: any) => {
    if (value === 1 || value < 1) {
      setStartOfIndex(0);
    } else {
      let start = (value - 1) * postPerPage;
      setStartOfIndex(start);
    }
    setCurrentPage(value);
  };

  // ????????? ?????? ?????????
  const initializeState = () => {
    setMinPrice("");
    setMaxPrice("");
    setTipPrice("");
  };

  // ????????? ??????
  const onSubmitTips = (payload: string) => {
    let param = {};

    if (payload === "insert") {
      param = {
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        charge_start: minPrice,
        charge_end: maxPrice,
        charge_price: tipPrice,
        mode: "insert",
      };
    } else {
      param = {
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        dd_id: tipId,
        charge_start: minPrice,
        charge_end: maxPrice,
        charge_price: tipPrice,
        mode: "update",
      };
    }

    Api.send("store_delivery_input", param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;
      if (resultItem.result === "Y") {
        if (payload === "insert") {
          setToastState({
            msg: "????????? ???????????? ?????? ???????????????.",
            severity: "success",
          });
          handleOpenAlert();
          handleClose();
        } else {
          setToastState({
            msg: "???????????? ?????? ???????????????.",
            severity: "success",
          });
          handleOpenAlert();
          handleEditClose();
        }
      } else {
        if (payload === "insert") {
          setToastState({
            msg: "???????????? ???????????? ?????? ????????? ?????????????????????.\n??????????????? ??????????????????.",
            severity: "error",
          });
          handleOpenAlert();
          handleClose();
        } else {
          setToastState({
            msg: "???????????? ???????????? ?????? ????????? ?????????????????????.\n??????????????? ??????????????????.",
            severity: "error",
          });
          handleOpenAlert();
          handleEditClose();
        }
      }
      initializeState();
      getTipsHandler();
    });
  };

  // ????????? ??????/?????? ??? ??????
  const onSubmitHandler = (type: string) => {
    if (minPrice === null || minPrice === "") {
      setToastState({ msg: "????????????????????? ??????????????????.", severity: "error" });
      handleOpenAlert();
    }
    // else if (maxPrice === null || maxPrice === '') {
    //   setToastState({ msg: '????????????????????? ??????????????????.', severity: 'error' });
    //   handleOpenAlert();
    // }
    // else if (tipPrice === null || tipPrice === '') {
    //   setToastState({ msg: '???????????? ??????????????????.', severity: 'error' });
    //   handleOpenAlert();
    // }
    // else if (Number(minPrice) > Number(maxPrice)) {
    //   setToastState({ msg: '????????????????????? ???????????????????????? ?????? ??? ????????????.', severity: 'error' });
    //   handleOpenAlert();
    // }
    else {
      onSubmitTips(type);
    }
  };

  // ????????? ??????
  const deleteTipHandler = () => {
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: "delete",
      dd_id: tipId,
    };

    Api.send("store_delivery_input", param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;
      if (resultItem.result === "Y") {
        setToastState({
          msg: "???????????? ?????? ???????????????.",
          severity: "success",
        });
        handleOpenAlert();
        handleCloseTip();
        getTipsHandler();
      } else {
        setToastState({
          msg: "????????? ????????? ?????????????????????.",
          severity: "error",
        });
        handleOpenAlert();
        handleCloseTip();
      }
    });
  };

  // ????????? ?????? ??? ??????
  const deleteTipConfirmHandler = (id: string) => {
    setTipId(id);
    handleOpenTip();
  };

  return (
    <Box component="div" className={base.root}>
      <Header type="tips" action={handleOpen} />
      <Box className={base.alertStyle}>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={openAlert}
          autoHideDuration={5000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={toastState.severity === "error" ? "error" : "success"}
          >
            {toastState.msg}
          </Alert>
        </Snackbar>
      </Box>
      {/* ????????? ?????? ?????? */}
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
          <Box className={base.modalInner}>
            <Typography
              component="h2"
              id="transition-modal-title"
              style={{ fontSize: 20 }}
            >
              ????????? ??????
            </Typography>
            <Paper className={base.paper}>
              <Box className={base.txtRoot}>
                <TextField
                  value={minPrice}
                  className={base.textField}
                  fullWidth
                  id="outlined-basic"
                  label="??????????????????"
                  variant="outlined"
                  required
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === "" || re.test(e.target.value)) {
                      let changed = e.target.value.replace(/(^0+)/, "");
                      setMinPrice(changed);
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">??? ??????</InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box className={base.txtRoot}>
                <TextField
                  value={maxPrice}
                  className={base.textField}
                  fullWidth
                  id="outlined-basic"
                  label="??????????????????"
                  variant="outlined"
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === "" || re.test(e.target.value)) {
                      let changed = e.target.value.replace(/(^0+)/, "");
                      setMaxPrice(changed);
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">??? ??????</InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Typography mb={3} fontSize={13}>
                ??? ????????? ??????, ?????? ????????? ??????
              </Typography>
              <Box className={base.txtRoot}>
                <TextField
                  value={tipPrice}
                  className={base.textField}
                  fullWidth
                  id="outlined-basic"
                  label="?????????"
                  variant="outlined"
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === "" || re.test(e.target.value)) {
                      let changed = e.target.value.replace(/^(0+)\w+/, "0");
                      setTipPrice(changed);
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">??? ??????</InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Paper>
            <ButtonGroup
              variant="text"
              color="primary"
              aria-label="text primary button group"
              style={{ marginTop: 20 }}
            >
              <ModalConfirmButton
                variant="contained"
                style={{ boxShadow: "none" }}
                onClick={() => onSubmitHandler("insert")}
              >
                ????????????
              </ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={handleClose}>
                ??????
              </ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* // ????????? ?????? ?????? */}

      {/* ????????? ?????? ?????? */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={openEdit}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openEdit}>
          <Box className={base.modalInner}>
            <Box mb={2}>
              <Typography
                component="h2"
                id="transition-modal-title"
                style={{ fontSize: 20 }}
              >{`????????? ${
                tipNo < 10 ? `0${tipNo + 1}` : `${tipNo + 1}`
              } - ??????`}</Typography>
            </Box>
            <Paper className={base.paper}>
              <Box className={base.txtRoot}>
                <TextField
                  value={minPrice}
                  className={base.textField}
                  fullWidth
                  id="outlined-basic"
                  label="??????????????????"
                  variant="outlined"
                  required
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === "" || re.test(e.target.value)) {
                      let changed = e.target.value.replace(/(^0+)/, "");
                      setMinPrice(changed);
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">??? ??????</InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box className={base.txtRoot}>
                <TextField
                  value={maxPrice}
                  className={base.textField}
                  fullWidth
                  id="outlined-basic"
                  label="??????????????????"
                  variant="outlined"
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === "" || re.test(e.target.value)) {
                      let changed = e.target.value.replace(/(^0+)/, "");
                      setMaxPrice(changed);
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">??? ??????</InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Typography mb={3} fontSize={13}>
                ??? ????????? ??????, ?????? ????????? ??????
              </Typography>
              <Box className={base.txtRoot}>
                <TextField
                  value={tipPrice}
                  className={base.textField}
                  fullWidth
                  id="outlined-basic"
                  label="?????????"
                  variant="outlined"
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === "" || re.test(e.target.value)) {
                      let changed = e.target.value.replace(/^(0+)\w+/, "0");
                      setTipPrice(changed);
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">??? ??????</InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Paper>
            <ButtonGroup
              variant="text"
              color="primary"
              aria-label="text primary button group"
              style={{ marginTop: 20 }}
            >
              <ModalConfirmButton
                variant="contained"
                style={{ boxShadow: "none" }}
                onClick={() => onSubmitHandler("update")}
              >
                ????????????
              </ModalConfirmButton>
              <ModalCancelButton
                variant="outlined"
                onClick={editCloseModalHandler}
              >
                ??????
              </ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* // ????????? ?????? ?????? */}

      {/* ????????? ?????? ?????? */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={openTip}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openTip}>
          <Box className={base.modalInner}>
            <h3 className={base.modalTitle}>????????? ??????</h3>
            <p className={base.modalDescription}>
              ???????????? ???????????? ?????????????????????????
            </p>
            <ButtonGroup
              variant="text"
              color="primary"
              aria-label="text primary button group"
            >
              <ModalConfirmButton
                variant="contained"
                style={{ boxShadow: "none" }}
                onClick={deleteTipHandler}
              >
                ???
              </ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={handleCloseTip}>
                ?????????
              </ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* ????????? ?????? ?????? */}
      {isLoading ? (
        <MainBox
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
          style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
        >
          <Box className={base.loadingWrap}>
            <CircularProgress
              disableShrink
              color="primary"
              style={{ width: 50, height: 50 }}
            />
          </Box>
        </MainBox>
      ) : (
        <MainBox
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
          style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
        >
          <Box mt={3} />
          {lists && lists.length > 0 && (
            <Grid container spacing={3} style={{ minHeight: 520 }}>
              {lists.map((list, index) => (
                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={4}
                  key={list.dd_id}
                  style={{ position: "relative" }}
                  alignContent="baseline"
                >
                  <Box
                    style={{ backgroundColor: "#1c1b30", padding: "5px 20px" }}
                  >
                    <Typography color="#fff">
                      {`????????? ${
                        index < 10 ? `0${index + 1}` : `${index + 1}`
                      }`}
                    </Typography>
                  </Box>
                  <Paper
                    className={clsx(
                      base.paper,
                      base.gradient,
                      base.boxBlur,
                      base.border
                    )}
                    style={{
                      background: "linear-gradient(45deg, #f9f9f9, #fff9ea)",
                    }}
                  >
                    <Box className={base.txtRoot}>
                      <TextField
                        value={Api.comma(list.dd_charge_start)}
                        variant="outlined"
                        label="????????????"
                        style={{ backgroundColor: "#fff" }}
                        focused={false}
                        contentEditable={false}
                        disabled
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              ??? ??????
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box className={base.txtRoot}>
                      <TextField
                        value={Api.comma(list.dd_charge_end)}
                        variant="outlined"
                        label="????????????"
                        style={{ backgroundColor: "#fff" }}
                        focused={false}
                        disabled
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              ??? ??????
                            </InputAdornment>
                          ),
                        }}
                        contentEditable={false}
                      />
                    </Box>
                    <Typography mb={3} fontSize={13}>
                      ??? ????????? ??????, ?????? ????????? ??????
                    </Typography>
                    <Box className={base.txtRoot}>
                      <TextField
                        value={Api.comma(list.dd_charge_price)}
                        variant="outlined"
                        label="?????????"
                        disabled
                        style={{ backgroundColor: "#fff" }}
                        focused={false}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              ??? ??????
                            </InputAdornment>
                          ),
                        }}
                        contentEditable={false}
                      />
                    </Box>
                    <ButtonGroup
                      variant="text"
                      color="primary"
                      aria-label="text primary button group"
                      style={{ marginTop: 10, width: "100%" }}
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        style={{ flex: 1, boxShadow: "none" }}
                        onClick={() =>
                          editModalHandler(
                            index,
                            list.dd_id,
                            list.dd_charge_start,
                            list.dd_charge_end,
                            list.dd_charge_price
                          )
                        }
                      >
                        ??????
                      </Button>
                      <Button
                        color="info"
                        variant="contained"
                        style={{ flex: 1, boxShadow: "none" }}
                        onClick={() => deleteTipConfirmHandler(list.dd_id)}
                      >
                        ??????
                      </Button>
                    </ButtonGroup>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
          {lists.length === 0 || lists === null ? (
            <Box
              style={{
                display: "flex",
                flex: 1,
                height: "calc(100vh - 160px)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography style={{ fontSize: 15 }}>
                ????????? ???????????? ????????????.
              </Typography>
            </Box>
          ) : null}
          {totalCount ? (
            <Box
              mt={7}
              display="flex"
              justifyContent="center"
              alignSelf="center"
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
                ?????? ???????????? = count
                ?????? ????????? ?????? = defaultPage
              */}
              </Stack>
            </Box>
          ) : null}
        </MainBox>
      )}
    </Box>
  );
}
