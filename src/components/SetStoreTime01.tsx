import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import moment from "moment";
import "moment/locale/ko";
import { ko } from "date-fns/esm/locale";

// Material UI Components
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/core/Alert";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Divider, Typography } from "@material-ui/core";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopTimePicker from "@material-ui/lab/DesktopTimePicker";

// Local Component
import Api from "../Api";
import {
  theme,
  baseStyles,
  ModalCancelButton,
  ModalConfirmButton,
} from "../styles/base";
import { StoreTimeStyles } from "../styles/custom";
import { DayArr } from "../assets/datas";

interface IList {
  [key: string]: string;
}

export default function SetStoreTime01() {
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const base = baseStyles();
  const classes = StoreTimeStyles();

  const [isLoading, setLoading] = React.useState(false);
  const [lists, setLists] = React.useState<IList[]>([]);
  const [id, setId] = React.useState("");
  const [open, setOpen] = React.useState(false); // ???????????? ?????? ?????? on/off
  const [openQuestion, setOpenQuestion] = React.useState(false); // ???????????? ?????? ?????? ?????? ?????? on/off
  const [selectDay, setSelectDay] = React.useState<Array<string>>([]); // ?????? ??????
  const [startTime, setStartTime] = React.useState<Date | null>(new Date()); // ?????? ??????
  const [endTime, setEndTime] = React.useState<Date | null>(new Date()); // ?????? ??????
  const [getDays, setGetDays] = React.useState<Array<string>>([]); // ????????? ??????
  const [strValue, setStringValue] = React.useState(""); // getDays??? stringify

  const checkArr = `["0","1","2","3","4","5","6"]`; // ????????? ?????? ???????????? ?????? ????????? ????????? (???????????? ?????? on/off ??????)

  // ?????? ?????? ?????????
  const selectDayHandler = (payload: string) => {
    const filtered = selectDay.find((day) => day === payload);

    if (filtered) {
      const removeObj = selectDay.filter((day) => day !== payload);
      setSelectDay(removeObj);
    } else {
      let result = selectDay.concat(payload);
      setSelectDay(result);
    }
  };

  // Toast(Alert) ??????
  const [toastState, setToastState] = React.useState({
    msg: "",
    severity: "",
  });
  const [openAlert, setOpenAlert] = React.useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  // ???????????? ????????????
  const getStoreTime = () => {
    setLoading(true);

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: "list",
    };

    Api.send("store_service_hour", param, (args: any) => {
      setLoading(true);

      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === "Y") {
        setLists(arrItems);

        if (arrItems) {
          let result = arrItems.reduce((acc: any, curr: any, i: number) => {
            let toArr = curr.st_yoil.split(",");
            acc.push(toArr);
            return acc;
          }, []);

          let flatArr = result.flat(Infinity);
          let flatArrSort = flatArr.sort();
          // console.log("flatArrSort", flatArrSort);
          setGetDays(flatArrSort);

          let stringifyValue = JSON.stringify(flatArrSort);
          setStringValue(stringifyValue);
        } else {
          setGetDays([]);
          setLists([]);
        }
        setLoading(false);
      } else {
        setLists([]);
        setLoading(false);
      }
    });
  };

  // ?????? ??? ??????
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteStoreTimeHandler = (st_idx: string) => {
    setId(st_idx);
    handleOpen();
  };

  // ?????? ??????
  const deleteStoreTime = () => {
    setLoading(true);

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: "delete",
      st_idx: id,
    };

    Api.send("store_service_hour", param, (args: any) => {
      setLoading(true);

      let resultItem = args.resultItem;
      // let arrItems = args.arrItems;

      if (resultItem.result === "Y") {
        handleClose();
        setToastState({
          msg: "?????? ??????????????? ?????????????????????.",
          severity: "success",
        });
        handleOpenAlert();
        getStoreTime();
        setLoading(false);
      } else {
        handleClose();
        setToastState({
          msg: "?????? ???????????? ????????? ????????? ?????????????????????.",
          severity: "error",
        });
        handleOpenAlert();
        setLoading(false);
      }
    });
  };

  // ?????? ?????? ??? ?????? ?????????
  const checkHandler = () => {
    if (selectDay.length < 1) {
      setToastState({ msg: "?????? ????????? ??????????????????.", severity: "error" });
      handleOpenAlert();
    } else {
      setOpenQuestion(true);
    }
  };

  // ?????? ??????
  const addStoreTime = (type: string) => {
    let sortSelectDay = selectDay.sort();
    let selectDayFormat = sortSelectDay.join();
    let startTimeFormat = moment(startTime, "HH:mm").format("HH:mm");
    let endTimeFormat = moment(endTime, "HH:mm").format("HH:mm");

    setLoading(true);

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: "update",
      // mode2: 'all', // ''
      st_yoil: selectDayFormat,
      st_stime: startTimeFormat,
      st_etime: endTimeFormat,
      RangeType: type,
    };

    Api.send("store_service_hour", param, (args: any) => {
      setLoading(true);

      let resultItem = args.resultItem;
      // let arrItems = args.arrItems;

      if (resultItem.result === "Y") {
        handleClose();
        setSelectDay([]);
        setToastState({
          msg: "??????????????? ?????????????????????.",
          severity: "success",
        });
        handleOpenAlert();
        setOpenQuestion(false);
        getStoreTime();
        setLoading(false);
      } else {
        handleClose();
        setSelectDay([]);
        setToastState({
          msg: "???????????? ????????? ????????? ?????????????????????.",
          severity: "error",
        });
        handleOpenAlert();
        setOpenQuestion(false);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getStoreTime();

    return () => getStoreTime();
  }, [mt_id, mt_jumju_code]);

  console.log("====================================");
  console.log("strValue === ", strValue);
  console.log("checkArr === ", checkArr);
  console.log("====================================");

  return isLoading ? (
    <Box className={base.loadingWrap}>
      <CircularProgress
        disableShrink
        color="primary"
        style={{ width: 50, height: 50 }}
      />
    </Box>
  ) : (
    <Box component="section">
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

      {/* ???????????? ?????? ?????? */}
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
          <Box className={clsx(base.modalInner, base.colCenter)}>
            <h2 id="transition-modal-title" className={base.modalTitle}>
              ???????????? ??????
            </h2>
            <p
              id="transition-modal-description"
              className={base.modalDescription}
            >
              ?????? ??????????????? ?????????????????????????
            </p>
            <ButtonGroup
              variant="text"
              color="primary"
              aria-label="text primary button group"
            >
              <ModalConfirmButton
                variant="contained"
                style={{ boxShadow: "none" }}
                onClick={deleteStoreTime}
              >
                ????????????
              </ModalConfirmButton>
              <ModalCancelButton
                fullWidth
                variant="outlined"
                onClick={handleClose}
              >
                ??????
              </ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* // ???????????? ?????? ?????? */}

      {/* ???????????? ?????? ?????? ?????? ?????? */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={openQuestion}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openQuestion}>
          <Box className={clsx(base.modalInner, base.colCenter)}>
            <h2 id="transition-modal-title" className={base.modalTitle}>
              ???????????? ?????? ??????
            </h2>
            <p
              id="transition-modal-description"
              className={base.modalDescription}
            >
              ?????? ??????????????? ?????? ????????? ?????????????????????????
            </p>
            <ButtonGroup
              variant="text"
              color="inherit"
              aria-label="text primary button group"
            >
              <ModalConfirmButton
                variant="contained"
                style={{
                  boxShadow: "none",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }}
                onClick={() => addStoreTime("all")}
              >
                ?????? ????????? ??????
              </ModalConfirmButton>
              <ModalConfirmButton
                variant="contained"
                style={{
                  boxShadow: "none",
                  backgroundColor: theme.palette.info.main,
                  color: theme.palette.info.contrastText,
                }}
                onClick={() => addStoreTime("curr")}
              >
                ?????? ?????????
              </ModalConfirmButton>
              <ModalCancelButton
                variant="outlined"
                onClick={() => setOpenQuestion(false)}
              >
                ??????
              </ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* // ???????????? ?????? ?????? ?????? ?????? */}

      {lists !== null && lists.length > 0 ? (
        <Box component="article" style={{ margin: "30px 0" }}>
          {lists.map((list, index) => (
            <Box key={index}>
              <Box
                className={clsx(base.flexRowBetweenCenter)}
                style={{ margin: "10px 0" }}
              >
                <Box className={base.flexRowStartCenter}>
                  <Box
                    className={clsx(base.flexRow, base.mr10)}
                    style={{ minWidth: 200 }}
                  >
                    <p
                      className={base.mr20}
                      style={{
                        fontSize: 14,
                        padding: "2px 10px",
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderRadius: 5,
                      }}
                    >
                      ??????
                    </p>
                    <p className={base.mr20}>
                      {list.st_yoil_txt.replaceAll(",", ", ")}
                    </p>
                  </Box>

                  <Typography
                    className={base.mr20}
                    style={{ minWidth: 100 }}
                  >{`??????: ${list.st_stime}`}</Typography>

                  <Typography>{`??????: ${list.st_etime}`}</Typography>
                </Box>
                <IconButton
                  color="primary"
                  aria-label="delete"
                  component="span"
                  style={{ alignItems: "flex-end" }}
                  onClick={() => deleteStoreTimeHandler(list.st_idx)}
                >
                  <HighlightOffIcon color="primary" />
                </IconButton>
              </Box>
              <Divider />
            </Box>
          ))}
        </Box>
      ) : null}

      <Typography
        className={clsx(classes.pointTxt, base.mb10)}
        style={{
          margin: "25px 0 10px",
          color:
            strValue === checkArr
              ? "rgba(0, 0, 0, 0.26)"
              : theme.palette.primary.main,
        }}
      >
        {strValue === checkArr
          ? "?????? ????????? ????????? ?????? ???????????? ????????????."
          : "?????? ????????? ????????? ???????????? ??? ????????????."}
      </Typography>

      <FormControl component="fieldset" style={{ marginBottom: 20 }}>
        <FormGroup aria-label="position" row>
          {DayArr &&
            DayArr.map((day, index) => (
              <FormControlLabel
                key={index}
                value={day.idx}
                control={
                  getDays.find((getDay) => getDay === day.idx) ? (
                    <Checkbox checked style={{ color: "#e5e5e5" }} />
                  ) : (
                    <Checkbox color="primary" />
                  )
                }
                label={day.ko}
                labelPlacement="end"
                onClick={() => {
                  let result = getDays.find((getDay) => getDay === day.idx);
                  if (result) {
                    return false;
                  } else {
                    selectDayHandler(day.idx);
                  }
                }}
                disabled={
                  getDays.find((getDay) => getDay === day.idx) ? true : false
                }
                checked={selectDay.includes(day.idx) ? true : false}
              />
            ))}
        </FormGroup>
      </FormControl>

      <Typography
        className={clsx(classes.pointTxt, base.mb10)}
        style={{
          color:
            strValue === checkArr
              ? "rgba(0, 0, 0, 0.26)"
              : theme.palette.primary.main,
        }}
      >
        ?????? ??????????????? ??????????????? ??????????????????.
      </Typography>

      <Grid container spacing={3} className={base.mb20}>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
            <Box display="flex" flexDirection="row" className={classes.paper}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DesktopTimePicker
                    label="????????????"
                    value={startTime}
                    inputFormat="a hh:mm"
                    onChange={(newValue) => {
                      setStartTime(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    disabled={strValue === checkArr ? true : false}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DesktopTimePicker
                    label="????????????"
                    value={endTime}
                    inputFormat="a hh:mm"
                    onChange={(newValue) => {
                      setEndTime(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    disabled={strValue === checkArr ? true : false}
                  />
                </Grid>
              </Grid>
            </Box>
          </LocalizationProvider>
        </Grid>
      </Grid>
      {/* <p>??????????????? ?????????????????? ????????? ??? ?????? ????????? ???????????????.</p> */}

      {strValue === checkArr ? (
        <Button
          className={classes.button}
          variant="contained"
          style={{ height: 50 }}
          disableElevation
          disabled
        >
          ????????????
        </Button>
      ) : (
        <Button
          className={classes.button}
          variant="contained"
          style={{
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            height: 50,
          }}
          disableElevation
          onClick={checkHandler}
        >
          ????????????
        </Button>
      )}
    </Box>
  );
}
