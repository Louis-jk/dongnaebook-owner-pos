import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Material UI Components
import { styled } from "@mui/material/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/core/Alert";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import InputAdornment from "@material-ui/core/InputAdornment";

// Local Component
import Header from "../components/Header";
import Api from "../Api";
import {
  theme,
  MainBox,
  baseStyles,
  ModalCancelButton,
  ModalConfirmButton,
} from "../styles/base";
import appRuntime from "../appRuntime";
import clsx from "clsx";
import * as loginAction from "../redux/actions/loginAction";
import * as checkOrderAction from "../redux/actions/checkOrderAction";
import { ButtonGroup, Divider } from "@material-ui/core";

interface IProps {
  props: object;
}
interface IOption {
  [key: string]: string;
}

interface IStoreSetting {
  [key: string]: string;
}

type RangeType = "all" | "curr";

export default function StoreInfo(props: IProps) {
  const { mt_id, mt_jumju_code, mt_alarm_vol } = useSelector(
    (state: any) => state.login
  );
  const { isChecked } = useSelector((state: any) => state.checkOrder);
  const base = baseStyles();
  const [isLoading, setLoading] = React.useState(true);
  const dispatch = useDispatch();
  const [range, setRange] = useState<RangeType>("curr");
  const [audio] = useState(
    new Audio("https://dongnaebook.app/api/dongnaebook_sound_1.mp3")
  ); // ?????????
  const [volume, setVolume] = React.useState<number>(50);

  const volumeHandleChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  // ????????? :: ??????????????? ?????? ??????
  // useEffect(() => {
  //   audio.pause();
  //   audio.currentTime = 0;
  // }, [isChecked])

  // useEffect(() => {
  //   if (mt_alarm_vol && typeof mt_alarm_vol === 'number') {
  //     setVolume(mt_alarm_vol * 100);
  //   }
  // }, [mt_alarm_vol])

  // ?????? ?????? ?????????
  const playAudioHandler = () => {
    const alarmVol = volume / 100;
    audio.volume = alarmVol;
    audio.play();
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

  // ???????????? ??????
  const [storeInit, setStoreInit] = React.useState(false); // ?????? ?????? ????????? ??????
  const [setting, setSetting] = React.useState<IStoreSetting>({
    do_coupon_use: "", // ?????? ?????? ?????? ?????? 'Y' | 'N'
    do_take_out: "", // ?????? ?????? ?????? 'Y' | 'N'
    do_for_here: "", // ???????????? ?????? ?????? 'Y' | 'N'
    do_delivery: "", // ?????? ?????? ?????? 'Y' | 'N'
    mt_print: "", // ???????????? '1', ???????????? '0'
    mt_sound: "", // ????????? ?????? ??????
    do_min_price: "0", // ?????? ?????? ?????? ??????
    do_min_price_wrap: "0", // ?????? ?????? ?????? ??????
    do_take_out_discount: "0", // ?????? ?????? ??????
    do_min_price_for_here: "0", // ???????????? ?????? ?????? ??????
    do_for_here_discount: "0", // ???????????? ?????? ??????
    do_for_here_minimum: "0", // ???????????? ????????????
  });

  const getStoreSetting = () => {
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
    };

    Api.send("store_guide", param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      console.log("???????????? resultItem", resultItem);
      console.log("???????????? arrItems", arrItems);

      if (resultItem.result === "Y") {
        console.log("arrItems", arrItems);
        setStoreInit(true);
        setSetting({
          do_delivery: arrItems.do_delivery,
          do_take_out: arrItems.do_take_out,
          do_coupon_use: arrItems.do_coupon_use,
          do_for_here: arrItems.do_for_here,
          mt_sound: arrItems.mt_sound,
          mt_print: arrItems.mt_print,
          do_min_price: arrItems.do_min_price,
          do_min_price_wrap: arrItems.do_min_price_wrap,
          do_take_out_discount: arrItems.do_take_out_discount,
          do_min_price_for_here: arrItems.do_min_price_for_here,
          do_for_here_discount: arrItems.do_for_here_discount,
          do_for_here_minimum: arrItems.do_for_here_minimum,
        });
        setVolume(arrItems.mt_alarm_vol * 100);
        setLoading(false);
      } else {
        setStoreInit(false);
        setSetting({
          do_delivery: "",
          do_take_out: "",
          do_coupon_use: "",
          do_for_here: "",
          mt_sound: "",
          mt_print: "",
          do_min_price: "",
          do_min_price_wrap: "",
          do_take_out_discount: "",
          do_min_price_for_here: "",
          do_for_here_discount: "",
          do_for_here_minimum: "",
        });
        setVolume(0);
        setLoading(false);
      }
    });
  };

  React.useEffect(() => {
    // window.addEventListener('getStoreSettings', getStoreSetting());
    // return () => {
    //   window.removeEventListener('getStoreSettings', getStoreSetting);
    // }
    getStoreSetting();
  }, [mt_id, mt_jumju_code]);

  console.log("setting", setting);
  console.log("range", range);

  const updateStoreSetting = () => {
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: storeInit ? "update" : "insert",
      do_take_out: setting.do_take_out,
      do_coupon_use: setting.do_coupon_use,
      mt_sound: setting.mt_sound,
      mt_print: setting.mt_print,
      RangeType: range,
      mt_alarm_vol: volume / 100,
      do_min_price: setting.do_min_price,
      do_delivery: setting.do_delivery,
      do_min_price_wrap: setting.do_min_price_wrap,
      do_take_out_discount: setting.do_take_out_discount,
      do_min_price_for_here: setting.do_min_price_for_here,
      do_for_here: setting.do_for_here,
      do_for_here_discount: setting.do_for_here_discount,
      do_for_here_minimum: setting.do_for_here_minimum,
    };

    console.log("???????????? ???????????? param", param);
    // return false;

    Api.send("store_setting_update", param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      console.log("???????????? ???????????? resultItem", resultItem);

      if (resultItem.result === "Y") {
        console.log("???????????? ???????????? arrItems", arrItems);

        dispatch(loginAction.updateNotify(setting.mt_sound));
        dispatch(loginAction.updateAutoPrint(setting.mt_print));
        dispatch(loginAction.updateAlarmVol(volume / 100));
        appRuntime.send("sound_volume", volume / 100);
        appRuntime.send("sound_count", setting.mt_sound);

        if (storeInit) {
          setToastState({
            msg: "??????????????? ?????? ???????????????.",
            severity: "success",
          });
          handleOpenAlert();
        } else {
          setToastState({
            msg: "??????????????? ?????? ???????????????.",
            severity: "success",
          });
          handleOpenAlert();
        }
      } else {
        if (storeInit) {
          setToastState({
            msg: "??????????????? ???????????? ?????? ????????? ?????????????????????.\n??????????????? ??????????????????.",
            severity: "error",
          });
          handleOpenAlert();
        } else {
          setToastState({
            msg: "??????????????? ???????????? ?????? ????????? ?????????????????????.\n??????????????? ??????????????????.",
            severity: "error",
          });
          handleOpenAlert();
        }
      }
    });
  };

  return (
    <Box component="div" className={base.root}>
      <Header type="storeSetting" action={updateStoreSetting} />
      <Box className={base.alert}>
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
          {/* <p>{mt_id}</p>
          <p>{mt_jumju_code}</p> */}
          <Box className={clsx(base.mb10, base.mt20)}></Box>
          <Grid item xs={12} md={12} mb={2}>
            <Typography fontWeight="bold">?????? ??????</Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="position"
                name="position"
                defaultValue="N"
              >
                <FormControlLabel
                  value={"1"}
                  checked={setting.mt_sound === "1" ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="1??? ??????"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: "row" }}
                  onChange={(e) => {
                    setSetting({
                      ...setting,
                      mt_sound: "1",
                    });
                    appRuntime.send("sound_count", "1");
                  }}
                />
                <FormControlLabel
                  value={"2"}
                  checked={setting.mt_sound === "2" ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="2??? ??????"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: "row" }}
                  onChange={(e) => {
                    setSetting({
                      ...setting,
                      mt_sound: "2",
                    });
                    appRuntime.send("sound_count", "2");
                  }}
                />
                {/* <FormControlLabel
                  value={"3"}
                  checked={setting.mt_sound === "3" ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="30??? ??????"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: "row" }}
                  onChange={(e) => {
                    setSetting({
                      ...setting,
                      mt_sound: "3",
                    });
                    // appRuntime.send('sound_count', '3');
                  }}
                /> */}
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={12} mb={2}>
            <Typography fontWeight="bold" mb={1}>
              ?????? ?????? ?????? ??????
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Stack
                spacing={2}
                sx={{ mr: 3 }}
                direction="row"
                alignItems="center"
                width={215}
                color="ButtonShadow"
              >
                {volume !== 0 ? (
                  <VolumeDown
                    style={{ cursor: "pointer" }}
                    onClick={() => setVolume(0)}
                  />
                ) : (
                  <VolumeOffIcon color="disabled" />
                )}
                <Slider
                  aria-label="Volume"
                  value={volume}
                  onChange={volumeHandleChange}
                  color="primary"
                  valueLabelDisplay="auto"
                  aria-labelledby="non-linear-slider"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? "#fff"
                        : "rgba(0,0,0,0.87)",
                    "& .MuiSlider-track": {
                      border: "none",
                    },
                    "& .MuiSlider-thumb": {
                      width: 24,
                      height: 24,
                      backgroundColor: "#fff",
                      "&:before": {
                        boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                      },
                      "&:hover, &.Mui-focusVisible, &.Mui-active": {
                        boxShadow: "none",
                      },
                    },
                    "& .MuiSlider-valueLabel": {
                      lineHeight: 1.2,
                      fontSize: 12,
                      background: "unset",
                      padding: 0,
                      width: 32,
                      height: 32,
                      borderRadius: "50% 50% 50% 0",
                      backgroundColor: "#52af77",
                      transformOrigin: "bottom left",
                      transform:
                        "translate(50%, -100%) rotate(-45deg) scale(0)",
                      "&:before": { display: "none" },
                      "&.MuiSlider-valueLabelOpen": {
                        transform:
                          "translate(50%, -100%) rotate(-45deg) scale(1)",
                      },
                      "& > *": {
                        transform: "rotate(45deg)",
                      },
                    },
                  }}
                />
                {volume !== 100 ? (
                  <VolumeUp
                    style={{ cursor: "pointer" }}
                    onClick={() => setVolume(100)}
                  />
                ) : (
                  <VolumeUp color="primary" />
                )}
              </Stack>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
                style={{ cursor: "pointer" }}
                onClick={playAudioHandler}
              >
                <PlayCircleOutlineRoundedIcon />
                <Typography fontSize={14} ml={0.5}>
                  ????????????
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} mb={2}>
            <Typography fontWeight="bold">
              ?????? ????????? ?????? ????????? ?????? ??????
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="position"
                name="position"
                defaultValue="N"
              >
                <FormControlLabel
                  value={"1"}
                  checked={setting.mt_print === "1" ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="????????????"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: "row" }}
                  onChange={(e) => {
                    setSetting({
                      ...setting,
                      mt_print: "1",
                    });
                  }}
                />
                <FormControlLabel
                  value={"0"}
                  checked={setting.mt_print === "0" ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="????????????"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: "row" }}
                  onChange={(e) => {
                    setSetting({
                      ...setting,
                      mt_print: "0",
                    });
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* ?????? ?????? ?????? */}
          <Grid container>
            <Grid item xs={12} md={5} mb={2}>
              <Typography fontWeight="bold">?????? ?????? ??????</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="N"
                >
                  <FormControlLabel
                    value={"Y"}
                    checked={setting.do_delivery === "Y" ? true : false}
                    control={
                      <Radio color="primary" style={{ paddingLeft: 0 }} />
                    }
                    label="????????????"
                    labelPlacement="start"
                    style={{ width: 150, margin: 0, flexDirection: "row" }}
                    onChange={(e) =>
                      setSetting({
                        ...setting,
                        do_delivery: "Y",
                      })
                    }
                  />
                  <FormControlLabel
                    value={"N"}
                    checked={setting.do_delivery === "N" ? true : false}
                    control={
                      <Radio color="primary" style={{ paddingLeft: 0 }} />
                    }
                    label="???????????????"
                    labelPlacement="start"
                    style={{ width: 150, margin: 0, flexDirection: "row" }}
                    onChange={(e) =>
                      setSetting({
                        ...setting,
                        do_delivery: "N",
                      })
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            {setting.do_delivery === "Y" && (
              <Grid item xs={12} md={2} mb={2}>
                {/* <Typography fontWeight="bold">?????? ?????? ?????? ??????</Typography> */}
                <TextField
                  value={!setting.do_min_price ? "0" : setting.do_min_price}
                  fullWidth
                  id="outlined-basic"
                  variant="outlined"
                  label="?????? ?????? ?????? ??????"
                  placeholder="?????? ?????? ?????? ????????? ??????????????????."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">???</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === "" || re.test(e.target.value)) {
                      let changed = e.target.value.replace(/(^0+)/, "");
                      setSetting({
                        ...setting,
                        do_min_price: changed,
                      });
                    }
                  }}
                />
              </Grid>
            )}
          </Grid>
          {/* // ?????? ?????? ?????? */}

          {/* ?????? ?????? ?????? ?????? */}
          <Grid container>
            <Grid item xs={12} md={5} mb={2}>
              <Typography fontWeight="bold">?????? ?????? ?????? ??????</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="N"
                >
                  <FormControlLabel
                    value={"Y"}
                    checked={setting.do_take_out === "Y" ? true : false}
                    control={
                      <Radio color="primary" style={{ paddingLeft: 0 }} />
                    }
                    label="????????????"
                    labelPlacement="start"
                    style={{ width: 150, margin: 0, flexDirection: "row" }}
                    onChange={(e) =>
                      setSetting({
                        ...setting,
                        do_take_out: "Y",
                      })
                    }
                  />
                  <FormControlLabel
                    value={"N"}
                    checked={setting.do_take_out === "N" ? true : false}
                    control={
                      <Radio color="primary" style={{ paddingLeft: 0 }} />
                    }
                    label="???????????????"
                    labelPlacement="start"
                    style={{ width: 150, margin: 0, flexDirection: "row" }}
                    onChange={(e) =>
                      setSetting({
                        ...setting,
                        do_take_out: "N",
                      })
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            {setting.do_take_out === "Y" && (
              <>
                <Grid item xs={12} md={2} mb={2} sx={{ mr: 2 }}>
                  {/* <Typography fontWeight="bold">?????? ?????? ?????? ??????</Typography> */}
                  <TextField
                    value={
                      !setting.do_min_price_wrap
                        ? "0"
                        : setting.do_min_price_wrap
                    }
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    label="?????? ?????? ?????? ??????"
                    placeholder="?????? ?????? ?????? ????????? ??????????????????."
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">???</InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === "" || re.test(e.target.value)) {
                        let changed = e.target.value.replace(/(^0+)/, "");
                        setSetting({
                          ...setting,
                          do_min_price_wrap: changed,
                        });
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2} mb={2}>
                  {/* <Typography fontWeight="bold">?????? ??????</Typography> */}
                  <TextField
                    value={
                      !setting.do_take_out_discount
                        ? "0"
                        : setting.do_take_out_discount
                    }
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    label="?????? ??????"
                    placeholder="?????? ?????? ????????? ??????????????????."
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">???</InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === "" || re.test(e.target.value)) {
                        let changed = e.target.value.replace(/(^0+)/, "");
                        setSetting({
                          ...setting,
                          do_take_out_discount: changed,
                        });
                      }
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
          {/* // ?????? ?????? ?????? ?????? */}

          {/* ???????????? ?????? ?????? */}
          <Grid container>
            <Grid item xs={12} md={5} mb={2}>
              <FormControl component="fieldset">
                <Typography fontWeight="bold">???????????? ?????? ??????</Typography>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="N"
                >
                  <FormControlLabel
                    value={"Y"}
                    checked={setting.do_for_here === "Y" ? true : false}
                    control={
                      <Radio color="primary" style={{ paddingLeft: 0 }} />
                    }
                    label="???????????? ??????"
                    labelPlacement="start"
                    style={{ width: 150, margin: 0, flexDirection: "row" }}
                    onChange={(e) =>
                      setSetting({
                        ...setting,
                        do_for_here: "Y",
                      })
                    }
                  />
                  <FormControlLabel
                    value={"N"}
                    checked={setting.do_for_here === "N" ? true : false}
                    control={
                      <Radio color="primary" style={{ paddingLeft: 0 }} />
                    }
                    label="???????????? ?????????"
                    labelPlacement="start"
                    style={{ width: 150, margin: 0, flexDirection: "row" }}
                    onChange={(e) =>
                      setSetting({
                        ...setting,
                        do_for_here: "N",
                      })
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            {setting.do_for_here === "Y" && (
              <>
                {/* sx={{ mr: 5 }} */}
                <Grid item xs={12} md={2} mb={2} sx={{ mr: 2 }}>
                  {/* <Typography fontWeight="bold">
                    ???????????? ?????? ?????? ??????
                  </Typography> */}
                  <TextField
                    value={
                      !setting.do_min_price_for_here
                        ? "0"
                        : setting.do_min_price_for_here
                    }
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    label="???????????? ?????? ?????? ??????"
                    placeholder="???????????? ?????? ?????? ????????? ??????????????????."
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">???</InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === "" || re.test(e.target.value)) {
                        let changed = e.target.value.replace(/(^0+)/, "");
                        setSetting({
                          ...setting,
                          do_min_price_for_here: changed,
                        });
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2} mb={2} sx={{ mr: 2 }}>
                  {/* <Typography fontWeight="bold">???????????? ??????</Typography> */}
                  <TextField
                    value={
                      !setting.do_for_here_discount
                        ? "0"
                        : setting.do_for_here_discount
                    }
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    label="???????????? ??????"
                    placeholder="???????????? ?????? ????????? ??????????????????."
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">???</InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === "" || re.test(e.target.value)) {
                        let changed = e.target.value.replace(/(^0+)/, "");
                        setSetting({
                          ...setting,
                          do_for_here_discount: changed,
                        });
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2} mb={2}>
                  {/* <Typography fontWeight="bold">???????????? ????????????</Typography> */}
                  <TextField
                    value={
                      !setting.do_for_here_minimum
                        ? "0"
                        : setting.do_for_here_minimum
                    }
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    label="???????????? ????????????"
                    placeholder="??????????????? ??????????????????."
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">???</InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === "" || re.test(e.target.value)) {
                        let changed = e.target.value.replace(/(^0+)/, "");
                        setSetting({
                          ...setting,
                          do_for_here_minimum: changed,
                        });
                      }
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
          {/* // ???????????? ?????? ?????? */}

          {/* ?????? ?????? ?????? ?????? */}
          <Grid item xs={12} md={6} mb={2}>
            <FormControl component="fieldset">
              <Typography fontWeight="bold">?????? ?????? ?????? ??????</Typography>
              <RadioGroup
                row
                aria-label="position"
                name="position"
                defaultValue="N"
              >
                <FormControlLabel
                  value={"Y"}
                  checked={setting.do_coupon_use === "Y" ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="?????? ?????? ??????"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: "row" }}
                  onChange={(e) =>
                    setSetting({
                      ...setting,
                      do_coupon_use: "Y",
                    })
                  }
                />
                <FormControlLabel
                  value={"N"}
                  checked={setting.do_coupon_use === "N" ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="?????? ?????? ?????????"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: "row" }}
                  onChange={(e) =>
                    setSetting({
                      ...setting,
                      do_coupon_use: "N",
                    })
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {/* // ?????? ?????? ?????? ?????? */}

          {/* <Box onClick={() => {
            dispatch(checkOrderAction.updateChecked(!isChecked));
          }}>
            <p>?????????</p>
          </Box> */}

          {/* mt={7} */}
          <Grid item xs={12} md={6} mb={2} mt={3}>
            <ButtonGroup variant="outlined">
              <Button
                variant={range === "all" ? "contained" : "outlined"}
                sx={{ px: 5, py: 1.5, boxShadow: "none !important" }}
                onClick={() => setRange("all")}
              >
                ?????? ?????? ??????
              </Button>
              <Button
                variant={range === "curr" ? "contained" : "outlined"}
                sx={{ px: 5, py: 1.5, boxShadow: "none !important" }}
                onClick={() => setRange("curr")}
              >
                ?????? ????????? ??????
              </Button>
            </ButtonGroup>
          </Grid>
        </MainBox>
      )}
    </Box>
  );
}
