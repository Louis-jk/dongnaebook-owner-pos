import * as React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

// Material UI Components
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

// Material UI Icons
import CloseIcon from "@material-ui/icons/Close";
import MinimizeIcon from "@material-ui/icons/Minimize";

// Local Component
import Logo from "../assets/images/logo.png";
import Api from "../Api";
import * as loginAction from "../redux/actions/loginAction";
import { getToken } from "../firebaseConfig";
import { LoginContainer, baseStyles, LoginButton } from "../styles/base";
import appRuntime from "../appRuntime";

interface State {
  email: string;
  password: string;
  isAutoLogin: boolean;
  showPassword: boolean;
}

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const base = baseStyles();

  const [token, setToken] = React.useState("");
  const [values, setValues] = React.useState<State>({
    email: "",
    password: "",
    isAutoLogin: false,
    showPassword: false,
  });

  // tooltip
  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#222",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#222",
    },
  }));

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickAutoLogin = () => {
    setValues({ ...values, isAutoLogin: !values.isAutoLogin });
  };

  // ?????? ????????? ??????
  const storeData = async () => {
    try {
      const jsonValue = JSON.stringify({
        userId: values.email,
        userPwd: values.password,
      });
      await localStorage.setItem("userAccount", jsonValue);
    } catch (e) {
      alert(`${e} :: ??????????????? ???????????????.`);
    }
  };

  //  ?????? ?????? ??????
  const storeAddToken = async (token: string) => {
    try {
      const jsonValue = JSON.stringify({ token: token });
      await localStorage.setItem("ohjooStoreToken", jsonValue);
    } catch (e) {
      alert(`${e} :: ??????????????? ???????????????.`);
    }
  };

  const onLoginHandler = () => {
    // setLoading(true);

    const param = {
      mt_id: values.email,
      mt_pwd: values.password,
      mt_device: "pos",
      mt_pos_token: token,
    };

    // console.log("????????? params", param);

    Api.send("store_login", param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === "Y") {
        if (values.isAutoLogin) {
          storeData();
        }
        console.log("login arrItems", arrItems);
        storeAddToken(token);
        dispatch(loginAction.updateLogin(JSON.stringify(arrItems)));
        dispatch(loginAction.updateToken(token));
        appRuntime.send("sound_count", arrItems.mt_sound); // ?????? ????????? ?????? ????????? : web ???????????? ??????
        appRuntime.send("sound_volume", arrItems.mt_alarm_vol); // ?????? ????????? VOLUME ????????? : web ???????????? ??????`
        history.replace("/main");
        setValues({
          ...values,
          email: "",
          password: "",
        });
        // setLoading(false);
      } else {
        // setLoading(false);
        alert("??????????????? ???????????? ????????????.");
      }
    });
  };

  const getElectronToken = () => {
    // ?????? ???????????? ?????? ??????
    appRuntime.send("callToken", "call");

    // ??????????????????????????? ?????? ??? ??????
    appRuntime.on("electronToken", (event: any, data: any) => {
      setToken(data);
      console.log("token", data);
    });
  };

  React.useEffect(() => {
    getToken(setToken);
    getElectronToken(); // ???????????? ????????? ?????? ???????????? : web ???????????? ??????

    return () => {
      getToken(setToken);
      getElectronToken(); // ???????????? ????????? ?????? ???????????? : web ???????????? ??????
    };
  }, []);

  // ????????? ?????? ?????????
  const windowCloseHandler = () => {
    appRuntime.send("windowClose", "close");
  };

  // ????????? ?????? ?????????
  const windowMinimizeHandler = () => {
    appRuntime.send("windowMinimize", "minimize");
  };

  return (
    <Box>
      <Box style={{ position: "absolute", top: 0, right: 0 }}>
        <BootstrapTooltip title="?????????" placement="bottom">
          <IconButton onClick={windowMinimizeHandler}>
            <MinimizeIcon />
          </IconButton>
        </BootstrapTooltip>
        <BootstrapTooltip title="??????" placement="bottom">
          <IconButton onClick={windowCloseHandler}>
            <CloseIcon />
          </IconButton>
        </BootstrapTooltip>
      </Box>

      <LoginContainer component="section">
        <Box
          className={base.noDrag}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={5}
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            boxShadow: "0 0 15px 2px rgba(0,0,0,0.17)",
          }}
        >
          <img
            src={Logo}
            alt="????????? ?????? ??????"
            style={{ width: 150, marginBottom: 30 }}
          />
          {/* <Typography variant="h6">?????????</Typography> */}
          <Box mb={2} style={{ minWidth: 300 }}>
            <TextField
              value={values.email}
              label="???????????? ??????????????????."
              variant="outlined"
              className={base.loginInput}
              onChange={handleChange("email")}
            />
          </Box>

          <Box mb={2} style={{ minWidth: 300 }}>
            <TextField
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              label="??????????????? ??????????????????."
              variant="outlined"
              className={base.loginInput}
              onChange={handleChange("password")}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </Box>

          <LoginButton
            variant="contained"
            className={base.w100}
            onClick={onLoginHandler}
          >
            ?????????
          </LoginButton>

          <BootstrapTooltip
            title="?????? ??? ??????????????? ????????? ?????? ?????? ?????? ?????? ??????????????????."
            placement="bottom"
          >
            <FormControlLabel
              value="end"
              style={{ marginTop: 20 }}
              control={<Checkbox color="primary" />}
              checked={values.isAutoLogin ? true : false}
              label="???????????????"
              labelPlacement="end"
              onClick={handleClickAutoLogin}
            />
          </BootstrapTooltip>
        </Box>
      </LoginContainer>
    </Box>
  );
}
