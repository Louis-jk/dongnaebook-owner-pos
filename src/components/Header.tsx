import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
// import { useReactToPrint } from "react-to-print";
import clsx from "clsx";

// Material UI Components
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PrintIcon from "@material-ui/icons/Print";
import CloseIcon from "@material-ui/icons/Close";
import MinimizeIcon from "@material-ui/icons/Minimize";
import Badge from "@material-ui/core/Badge";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Switch from "@material-ui/core/Switch";

// Material icons
import AccessTimeOutlinedIcon from "@material-ui/icons/AccessTimeOutlined";
import CalculateOutlinedIcon from "@material-ui/icons/CalculateOutlined";
import MenuOpenOutlinedIcon from "@material-ui/icons/MenuOpenOutlined";
import RestaurantMenuOutlinedIcon from "@material-ui/icons/RestaurantMenuOutlined";
import ConfirmationNumberOutlinedIcon from "@material-ui/icons/ConfirmationNumberOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import StorefrontOutlinedIcon from "@material-ui/icons/StorefrontOutlined";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import LogoutOutlinedIcon from "@material-ui/icons/LogoutOutlined";
import StopCircleOutlinedIcon from "@material-ui/icons/StopCircleOutlined";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import SettingsIcon from "@mui/icons-material/Settings";

// Local Component
import PrintModal from "./PrintModal";
import * as storeAction from "../redux/actions/storeAction";
import * as loginAction from "../redux/actions/loginAction";
import * as orderAction from "../redux/actions/orderAction";
import * as menuControlAction from "../redux/actions/menuControlAction";
import {
  theme,
  baseStyles,
  ModalConfirmButton,
  ModalCancelButton,
} from "../styles/base";
import CloseStoreModal from "./CloseStoreModal"; // ???????????? ??????
import Api from "../Api";
import appRuntime from "../appRuntime";
import PosPrinterSettingModal from "./PosPrinterSettingModal";

const drawerWidth = 180;
interface OptionalProps {
  type?: string;
  detail?: string | null;
  action?: () => void;
  action02?: () => void;
  window?: () => Window;
}

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    backgroundColor: "#656565 !important",
    borderRadius: 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function ResponsiveDrawer(props: OptionalProps) {
  const { window } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const base = baseStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false); // ?????? ?????????
  const { mt_id, mt_jumju_code, mt_store, mt_app_token, do_jumju_origin_use } =
    useSelector((state: any) => state.login);
  const { allStore } = useSelector((state: any) => state.store);
  const { newOrder, checkOrder, deliveryOrder, doneOrder } = useSelector(
    (state: any) => state.order
  );
  const { selectType } = useSelector((state: any) => state.menuContr);

  const [storeListOpen, setStoreListOpen] = React.useState(false); // ?????? ?????? ?????????
  const [value, setValue] = React.useState(""); // ?????? ?????? ???
  const [curPathName, setCurPathName] = React.useState("");

  const [closeStoreModalOpen, setCloseStoreModalOpen] = React.useState(false); // ???????????? ?????? ??????
  const [closePosPrinterModalOpen, setPosPrinterModalOpen] =
    React.useState(false); // POS ????????? ?????? ?????? ??????

  console.log("?????? props ??", props);

  // ?????????????????? ?????? ?????????
  const openCloseStoreModal = () => {
    setCloseStoreModalOpen(true);
  };
  const closeCloseStoreModal = () => {
    setCloseStoreModalOpen(false);
  };
  const openCloseStoreModalHandler = () => {
    openCloseStoreModal();
  };

  // Pos ????????? ?????? ?????? ?????????
  const closePosPrinterModal = () => {
    setPosPrinterModalOpen(false);
  };
  const openPosPrinterModalHandler = () => {
    setPosPrinterModalOpen(true);
  };

  React.useEffect(() => {
    let slice = location.pathname.slice(1);
    setCurPathName(slice);
  }, [location]);

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

  // ????????? ??????
  const [printOpen, setPrintOpen] = React.useState(false);
  const openPrintModal = () => {
    setPrintOpen(true);
  };

  const closePrintModal = () => {
    setPrintOpen(false);
  };

  const handlePrint02 = () => {
    openPrintModal();
  };

  // ????????????
  const logout = async () => {
    try {
      await dispatch(storeAction.closedStore([]));
      await localStorage.removeItem("userAccount");
      await localStorage.removeItem("ohjooStoreToken");
      await dispatch(menuControlAction.updateMenuSelect("order"));
      await history.push("/order_new");
      await history.push("/login");
    } catch (err) {
      console.log("???????????? ??? ????????????", err);
    }
  };

  // ????????? ?????? ??????
  // const componentRef = React.useRef(null);
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  // ???????????? ????????? ?????????
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // ?????? ???????????? ?????? ????????????
  const getNewOrderHandler = (id: string, code: string) => {
    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: id,
      jumju_code: code,
      od_process_status: "????????????",
    };
    Api.send("store_order_list", param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === "Y") {
        dispatch(
          dispatch(orderAction.updateNewOrder(JSON.stringify(arrItems)))
        );
        getCheckOrderHandler();
      } else {
        dispatch(dispatch(orderAction.updateNewOrder(null)));
        getCheckOrderHandler();
      }
    });
  };

  // ?????? ???????????? ?????? ????????????
  const getCheckOrderHandler = () => {
    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: "????????????",
    };
    Api.send("store_order_list", param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === "Y") {
        dispatch(
          dispatch(orderAction.updateCheckOrder(JSON.stringify(arrItems)))
        );
        getDeliveryOrderHandler();
      } else {
        dispatch(dispatch(orderAction.updateCheckOrder(null)));
        getDeliveryOrderHandler();
      }
    });
  };

  // ?????? ????????? ?????? ????????????
  const getDeliveryOrderHandler = () => {
    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: "?????????",
    };
    Api.send("store_order_list", param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === "Y") {
        dispatch(
          dispatch(orderAction.updateDeliveryOrder(JSON.stringify(arrItems)))
        );
        getDoneOrderHandler();
      } else {
        dispatch(dispatch(orderAction.updateDeliveryOrder(null)));
        getDoneOrderHandler();
      }
    });
  };

  // ?????? ???????????? ?????? ????????????
  const getDoneOrderHandler = () => {
    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: "????????????",
    };
    Api.send("store_order_list", param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === "Y") {
        dispatch(
          dispatch(orderAction.updateDoneOrder(JSON.stringify(arrItems)))
        );
      } else {
        dispatch(dispatch(orderAction.updateDoneOrder(null)));
      }
    });
  };

  React.useEffect(() => {
    getNewOrderHandler(mt_id, mt_jumju_code);

    return () => getNewOrderHandler(mt_id, mt_jumju_code);
  }, [mt_id, mt_jumju_code]);

  // ?????? ?????? ????????? ?????????
  const handleStoreDrawerToggle = () => {
    setStoreListOpen(!storeListOpen);
  };

  // ?????? ?????? ?????????
  const setStoreHandler = async (
    store: any,
    id: string,
    jumju_id: string,
    jumju_code: string,
    storeName: string,
    addr: string
  ) => {
    try {
      console.log("select store", store);
      await dispatch(
        storeAction.selectStore(id, jumju_id, jumju_code, storeName, addr)
      );
      await dispatch(loginAction.updateLogin(JSON.stringify(store)));
      await dispatch(loginAction.updateToken(mt_app_token));

      let param = {
        mt_id: jumju_id,
        mt_device: "pos",
        mt_pos_token: mt_app_token,
      };

      Api.send("store_login_token", param, (args: any) => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;
        console.log("?????? ???????????? ????????? resultItem::: ", resultItem);
        console.log("?????? ???????????? ?????????  arrItems::: ", arrItems);
        if (resultItem.result === "Y") {
          console.log("?????? ???????????? ?????? ????????? ::: ", arrItems);
        } else {
          console.log("?????? ???????????? ??????");
        }
      });
    } catch (err) {
      console.error("?????? ?????? ::", err);
    }
  };

  // ????????? ?????? ?????? ?????????
  const setOriginStoreHandler = async (result: string) => {
    try {
      await dispatch(loginAction.updateOriginPrint(result));
      await dispatch(storeAction.updateStoreOriginPrint(mt_id, result));
    } catch (err) {
      console.error(err);
    }
  };

  const setOriginPrintHandler = () => {
    let result = "";
    if (do_jumju_origin_use === "Y") {
      result = "N";
    } else {
      result = "Y";
    }

    setOriginStoreHandler(result);

    let param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      do_jumju_origin_use: result,
    };

    Api.send("store_origin_update", param, (args: any) => {
      let resultItem = args.resultItem;
      // let arrItems = args.arrItems;

      if (resultItem.result === "Y") {
        // console.log('origin update arrItems', arrItems);
        console.log("????????? ??????????????? ???????????? ??????.");
      } else {
        console.log("????????? ??????????????? ?????????????????? ???????????????.");
      }
    });
  };

  // ????????? ??????
  // const openPrint = () => {
  //   appRuntime.send("openPrint", "print info?");
  //   appRuntime.on("printInfo", (event: any, data: any) => {
  //     console.log("print info data ::", data);
  //   });
  // };

  const menuControlHandler = (payload: string) => {
    dispatch(menuControlAction.updateMenuSelect(payload));
    if (payload === "order") {
      history.push("/order_new");
    } else {
      history.push("/set_storetime");
    }
  };

  // ????????? ?????? ?????????
  const [winCloseModalOpen, setWinCloseModalOpen] = React.useState(false);
  const windowCloseHandler = () => {
    setWinCloseModalOpen(true);
  };
  const cancelWinCloseHandler = () => {
    setWinCloseModalOpen(false);
  };

  // ????????? ?????? ?????????
  const onCloseWinCloseHandler = () => {
    appRuntime.send("windowClose", "close");
  };

  // ????????? ?????? ?????????
  const windowMinimizeHandler = () => {
    appRuntime.send("windowMinimize", "minimize");
  };

  // const sendNotify = () => {
  //   appRuntime.send("notification", "test");
  // };

  // ?????? ?????????
  const drawer = (
    <div style={{ backgroundColor: theme.palette.info.main, height: "100%" }}>
      <Toolbar style={{ backgroundColor: theme.palette.info.main }}>
        <ButtonGroup
          variant="contained"
          color="inherit"
          style={{ width: "100%" }}
          aria-label="text button group"
        >
          <Button
            onClick={() => menuControlHandler("order")}
            style={{
              background:
                selectType === "order"
                  ? theme.palette.primary.main
                  : theme.palette.info.light,
            }}
          >
            <Typography
              style={{
                color:
                  selectType === "order"
                    ? theme.palette.info.main
                    : theme.palette.primary.main,
              }}
            >
              ??????
            </Typography>
          </Button>
          <Button
            onClick={() => menuControlHandler("store")}
            style={{
              background:
                selectType === "store"
                  ? theme.palette.primary.main
                  : theme.palette.info.light,
            }}
          >
            <Typography
              style={{
                color:
                  selectType === "store"
                    ? theme.palette.info.main
                    : theme.palette.primary.main,
              }}
            >
              ??????
            </Typography>
          </Button>
        </ButtonGroup>
      </Toolbar>
      {selectType === "order" ? (
        <List
          className={clsx(base.orderMenuWrap, base.noDrag)}
          sx={{ padding: 0 }}
        >
          {/* ???????????? ?????? */}
          {/* <OrderStepSideBar
            route="order_new"
            pathName="order_new"
            data={newOrder}
          /> */}
          <ListItem
            className={base.orderMenu}
            component={Link}
            to="/order_new"
            style={{
              color:
                curPathName === "order_new" || props.detail === "order_new"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor:
                curPathName === "order_new" || props.detail === "order_new"
                  ? "#fff"
                  : "transparent",
            }}
          >
            <Typography
              component="label"
              variant="body1"
              style={{
                color:
                  newOrder.length > 0 &&
                  curPathName !== "order_new" &&
                  props.detail !== "order_new"
                    ? theme.palette.secondary.main
                    : newOrder.length > 0 &&
                      (curPathName === "order_new" ||
                        props.detail === "order_new")
                    ? "#1c1b30"
                    : newOrder.length === 0 &&
                      (curPathName === "order_new" ||
                        props.detail === "order_new")
                    ? theme.palette.info.main
                    : "#fff",
              }}
            >
              ????????????
            </Typography>
            <Typography
              className="count"
              component="h3"
              variant="h4"
              style={{
                color:
                  newOrder.length > 0 &&
                  curPathName !== "order_new" &&
                  props.detail !== "order_new"
                    ? theme.palette.secondary.main
                    : newOrder.length > 0 &&
                      (curPathName === "order_new" ||
                        props.detail === "order_new")
                    ? theme.palette.info.main
                    : newOrder.length === 0 &&
                      (curPathName === "order_new" ||
                        props.detail === "order_new")
                    ? theme.palette.info.main
                    : "#fff",
              }}
            >
              {newOrder.length > 99 ? "99+" : newOrder.length}
            </Typography>
          </ListItem>
          {/* // ???????????? ?????? */}

          {/* ???????????? ?????? */}
          {/* <OrderStepSideBar
            route="order_check"
            pathName="order_check"
            data={checkOrder}
          /> */}
          <ListItem
            className={base.orderMenu}
            component={Link}
            to="/order_check"
            style={{
              color:
                curPathName === "order_check" ||
                props.detail === "order_check_delivery" ||
                props.detail === "order_check_takeout"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor:
                curPathName === "order_check" ||
                props.detail === "order_check_delivery" ||
                props.detail === "order_check_takeout"
                  ? "#fff"
                  : "transparent",
            }}
          >
            <Typography
              component="label"
              variant="body1"
              style={{
                color:
                  checkOrder.length > 0 &&
                  curPathName !== "order_check" &&
                  props.detail !== "order_check_delivery" &&
                  props.detail !== "order_check_takeout"
                    ? theme.palette.secondary.main
                    : checkOrder.length > 0 &&
                      (curPathName === "order_check" ||
                        props.detail === "order_check_delivery" ||
                        props.detail === "order_check_takeout")
                    ? theme.palette.info.main
                    : checkOrder.length === 0 &&
                      (curPathName === "order_check" ||
                        props.detail === "order_check_delivery" ||
                        props.detail === "order_check_takeout")
                    ? theme.palette.info.main
                    : "#fff",
              }}
            >
              ????????????
            </Typography>
            <Typography
              className="count"
              component="h3"
              variant="h4"
              style={{
                color:
                  checkOrder.length > 0 &&
                  curPathName !== "order_check" &&
                  props.detail !== "order_check_delivery" &&
                  props.detail !== "order_check_takeout"
                    ? theme.palette.secondary.main
                    : checkOrder.length > 0 &&
                      (curPathName === "order_check" ||
                        props.detail === "order_check_delivery" ||
                        props.detail === "order_check_takeout")
                    ? theme.palette.info.main
                    : checkOrder.length === 0 &&
                      (curPathName === "order_check" ||
                        props.detail === "order_check_delivery" ||
                        props.detail === "order_check_takeout")
                    ? theme.palette.info.main
                    : "#fff",
              }}
            >
              {checkOrder.length > 99 ? "99+" : checkOrder.length}
            </Typography>
          </ListItem>
          {/* // ???????????? ?????? */}

          {/* ????????? ?????? */}
          {/* <OrderStepSideBar
            route="order_delivery"
            pathName="order_delivery"
            data={deliveryOrder}
          /> */}
          <ListItem
            className={base.orderMenu}
            component={Link}
            to="/order_delivery"
            style={{
              color:
                curPathName === "order_delivery" ||
                props.detail === "order_delivery"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor:
                curPathName === "order_delivery" ||
                props.detail === "order_delivery"
                  ? "#fff"
                  : "transparent",
            }}
          >
            <Typography
              component="label"
              variant="body1"
              style={{
                color:
                  deliveryOrder.length > 0 &&
                  curPathName !== "order_delivery" &&
                  props.detail !== "order_delivery"
                    ? theme.palette.secondary.main
                    : deliveryOrder.length > 0 &&
                      (curPathName === "order_delivery" ||
                        props.detail === "order_delivery")
                    ? theme.palette.info.main
                    : deliveryOrder.length === 0 &&
                      (curPathName === "order_delivery" ||
                        props.detail === "order_delivery")
                    ? theme.palette.info.main
                    : "#fff",
              }}
            >
              ?????????
            </Typography>
            <Typography
              className="count"
              component="h3"
              variant="h4"
              style={{
                color:
                  deliveryOrder.length > 0 &&
                  curPathName !== "order_delivery" &&
                  props.detail !== "order_delivery"
                    ? theme.palette.secondary.main
                    : deliveryOrder.length > 0 &&
                      (curPathName === "order_delivery" ||
                        props.detail === "order_delivery")
                    ? theme.palette.info.main
                    : deliveryOrder.length === 0 &&
                      (curPathName === "order_delivery" ||
                        props.detail === "order_delivery")
                    ? theme.palette.info.main
                    : "#fff",
              }}
            >
              {deliveryOrder.length > 99 ? "99+" : deliveryOrder.length}
            </Typography>
          </ListItem>
          {/* // ????????? ?????? */}

          {/* ???????????? ?????? */}
          {/* <OrderStepSideBar
            route="order_done"
            pathName="order_done"
            data={doneOrder}
          /> */}
          <ListItem
            className={base.orderMenu}
            component={Link}
            to="/order_done"
            style={{
              color:
                curPathName === "order_done" || props.detail === "order_done"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor:
                curPathName === "order_done" || props.detail === "order_done"
                  ? "#fff"
                  : "transparent",
            }}
          >
            <Typography
              component="label"
              variant="body1"
              style={{
                color:
                  doneOrder.length > 0 &&
                  curPathName !== "order_done" &&
                  props.detail !== "order_done"
                    ? theme.palette.secondary.main
                    : doneOrder.length > 0 &&
                      (curPathName === "order_done" ||
                        props.detail === "order_done")
                    ? theme.palette.info.main
                    : doneOrder.length === 0 &&
                      (curPathName === "order_done" ||
                        props.detail === "order_done")
                    ? theme.palette.info.main
                    : "#fff",
              }}
            >
              ??????/????????????
            </Typography>
            <Typography
              className="count"
              component="h3"
              variant="h4"
              style={{
                color:
                  doneOrder.length > 0 &&
                  curPathName !== "order_done" &&
                  props.detail !== "order_done"
                    ? theme.palette.secondary.main
                    : doneOrder.length > 0 &&
                      (curPathName === "order_done" ||
                        props.detail === "order_done")
                    ? theme.palette.info.main
                    : doneOrder.length === 0 &&
                      (curPathName === "order_done" ||
                        props.detail === "order_done")
                    ? theme.palette.info.main
                    : "#fff",
              }}
            >
              {doneOrder.length > 99 ? "99+" : doneOrder.length}
            </Typography>
          </ListItem>
          {/* // ???????????? ?????? */}
        </List>
      ) : selectType === "store" ? (
        <List
          className={clsx(base.orderMenuWrap02, base.noDrag)}
          sx={{ padding: 0 }}
        >
          <ListItem
            className={base.orderMenu02}
            component={Link}
            to="/set_storetime"
            style={{
              color:
                curPathName === "set_storetime"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor:
                curPathName === "set_storetime" ? "#fff" : "transparent",
            }}
          >
            <Box display="flex" flexDirection="row">
              <AccessTimeOutlinedIcon />
              <Typography component="label" variant="body1" ml={1}>
                ????????? ??? ?????????
              </Typography>
            </Box>
          </ListItem>
          <ListItem
            className={base.orderMenu02}
            component={Link}
            to="/calculate"
            style={{
              color:
                curPathName === "calculate"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor:
                curPathName === "calculate" ? "#fff" : "transparent",
            }}
          >
            <Box display="flex" flexDirection="row">
              <CalculateOutlinedIcon />
              <Typography component="label" variant="body1" ml={1}>
                ????????????
              </Typography>
            </Box>
          </ListItem>
          <ListItem
            className={base.orderMenu02}
            component={Link}
            to="/category"
            style={{
              color:
                curPathName === "category"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor:
                curPathName === "category" ? "#fff" : "transparent",
            }}
          >
            <Box display="flex" flexDirection="row">
              <MenuOpenOutlinedIcon />
              <Typography component="label" variant="body1" ml={1}>
                ????????????
              </Typography>
            </Box>
          </ListItem>
          <ListItem
            className={base.orderMenu02}
            component={Link}
            to="/menu/all"
            style={{
              color:
                curPathName === "menu" ||
                props.type === "menu" ||
                props.type === "menuEdit" ||
                props.type === "menuAdd"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor:
                curPathName === "menu" ||
                props.type === "menu" ||
                props.type === "menuEdit" ||
                props.type === "menuAdd"
                  ? "#fff"
                  : "transparent",
            }}
          >
            <Box display="flex" flexDirection="row">
              <RestaurantMenuOutlinedIcon />
              <Typography component="label" variant="body1" ml={1}>
                ????????????
              </Typography>
            </Box>
          </ListItem>
          <ListItem
            className={base.orderMenu02}
            component={Link}
            to="/coupons"
            style={{
              color:
                curPathName === "coupons" ||
                props.type === "couponAdd" ||
                props.type === "couponEdit"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor:
                curPathName === "coupons" ||
                props.type === "couponAdd" ||
                props.type === "couponEdit"
                  ? "#fff"
                  : "transparent",
            }}
          >
            <Box display="flex" flexDirection="row">
              <ConfirmationNumberOutlinedIcon />
              <Typography component="label" variant="body1" ml={1}>
                ????????????
              </Typography>
            </Box>
          </ListItem>
          <ListItem
            className={base.orderMenu02}
            component={Link}
            to="/tips"
            style={{
              color:
                curPathName === "tips"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor: curPathName === "tips" ? "#fff" : "transparent",
            }}
          >
            <Box display="flex" flexDirection="row">
              <InfoOutlinedIcon />
              <Typography component="label" variant="body1" ml={1}>
                ?????????
              </Typography>
            </Box>
          </ListItem>
          <ListItem
            className={base.orderMenu02}
            component={Link}
            to="/store_info"
            style={{
              color:
                curPathName === "store_info"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor:
                curPathName === "store_info" ? "#fff" : "transparent",
            }}
          >
            <Box display="flex" flexDirection="row">
              <StorefrontOutlinedIcon />
              <Typography component="label" variant="body1" ml={1}>
                ????????????
              </Typography>
            </Box>
          </ListItem>
          <ListItem
            className={base.orderMenu02}
            component={Link}
            to="/store_setting"
            style={{
              color:
                curPathName === "store_setting"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor:
                curPathName === "store_setting" ? "#fff" : "transparent",
            }}
          >
            <Box display="flex" flexDirection="row">
              <SettingsIcon />
              <Typography component="label" variant="body1" ml={1}>
                ????????????
              </Typography>
            </Box>
          </ListItem>
          <ListItem
            className={base.orderMenu02}
            component={Link}
            to="/reviews"
            style={{
              color:
                curPathName === "reviews"
                  ? theme.palette.info.main
                  : theme.palette.info.contrastText,
              backgroundColor:
                curPathName === "reviews" ? "#fff" : "transparent",
            }}
          >
            <Box display="flex" flexDirection="row">
              <RateReviewOutlinedIcon />
              <Typography component="label" variant="body1" ml={1}>
                ????????????
              </Typography>
            </Box>
          </ListItem>
        </List>
      ) : null}
    </div>
  );

  // ?????? ?????? ?????????
  const storeListDrawer = (
    <Box style={{ display: "flex", flex: 1, flexDirection: "column" }}>
      {/* <div className={classes.toolbar} /> */}
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        py={0.5}
        px={1}
        style={{
          position: "fixed",
          width: "100%",
          zIndex: 100,
          backgroundColor: theme.palette.info.main,
          color: "#fff",
        }}
      >
        <Typography
          variant="h5"
          component="h5"
          style={{
            fontWeight: 500,
            color: theme.palette.info.contrastText,
            margin: "12px 20px",
          }}
        >
          ????????????
        </Typography>
      </Box>
      <Divider />
      <Box display="flex" flex={3}>
        <FormControl
          component="fieldset"
          style={{
            padding: 10,
            overflowY: "scroll",
            marginTop: 55,
            marginBottom: 55,
            zIndex: 5,
          }}
        >
          <RadioGroup
            aria-label="select_store"
            name="store"
            value={value}
            onChange={handleChange}
          >
            {allStore && allStore.length > 0 ? (
              allStore.map((store: any, index: number) => (
                <Box key={index}>
                  <FormControlLabel
                    value={store.mt_store}
                    control={<Radio color="primary" />}
                    label={store.mt_store}
                    style={{
                      marginTop: 15,
                      marginBottom: 15,
                      marginLeft: 10,
                      marginRight: 10,
                      color: "#222",
                    }}
                    onClick={() =>
                      setStoreHandler(
                        store,
                        store.id,
                        store.mt_id,
                        store.mt_jumju_code,
                        store.mt_store,
                        store.mt_addr
                      )
                    }
                    checked={store.mt_store === mt_store ? true : false}
                  />
                  <Divider />
                </Box>
              ))
            ) : (
              <Typography color="info" style={{ fontWeight: 500, margin: 20 }}>
                ????????? ????????? ????????????.
              </Typography>
            )}
          </RadioGroup>
        </FormControl>
      </Box>
      <Box
        justifySelf="flex-end"
        p={1}
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          zIndex: 100,
          backgroundColor: "#ececec",
        }}
      >
        <Button
          style={{ color: theme.palette.primary.contrastText }}
          onClick={logout}
        >
          <LogoutOutlinedIcon />
          <Typography ml={1}>????????????</Typography>
        </Button>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
      <PrintModal isOpen={printOpen} isClose={closePrintModal} />
      <CloseStoreModal
        isOpen={closeStoreModalOpen}
        isClose={closeCloseStoreModal}
      />

      <PosPrinterSettingModal
        isOpen={closePosPrinterModalOpen}
        isClose={closePosPrinterModal}
      />

      {/* ????????? ?????? ?????? ?????? */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={winCloseModalOpen}
        // onClose={props.isClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={winCloseModalOpen}>
          <Box className={clsx(base.modalInner, base.colCenter)}>
            <Typography
              id="transition-modal-title"
              component="h5"
              variant="h5"
              style={{
                fontWeight: "bold",
                marginBottom: 10,
                color: theme.palette.primary.main,
              }}
            >
              ???????????? ??????
            </Typography>
            <Typography id="transition-modal-description" mb={2}>
              ??????????????? ?????????????????????????
            </Typography>
            <ButtonGroup
              variant="text"
              color="primary"
              aria-label="text primary button group"
            >
              <ModalConfirmButton
                variant="contained"
                style={{ boxShadow: "none" }}
                onClick={onCloseWinCloseHandler}
              >
                ???, ????????????
              </ModalConfirmButton>
              <ModalCancelButton
                variant="outlined"
                onClick={cancelWinCloseHandler}
              >
                ?????????
              </ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* // ????????? ?????? ?????? ?????? */}

      {/* ?????? ?????????, ?????? ?????? ?????? */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: "none",
          flex: 1,
          backgroundColor: theme.palette.info.main,
        }}
      >
        <Toolbar
          id="toolbar"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 0,
            paddingLeft: 0,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box className={base.flexRowStartCenter}>
            {props.type === "menuAdd" ||
            props.type === "menuEdit" ||
            props.type === "couponAdd" ||
            props.type === "couponEdit" ||
            props.detail === "order_new" ||
            props.detail === "order_check" ||
            props.detail === "order_delivery" ||
            props.detail === "order_done" ? (
              <IconButton
                style={{ color: "#fff" }}
                aria-label="open drawer"
                edge="start"
                onClick={() => history.goBack()}
                // sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <ArrowBackIcon />
              </IconButton>
            ) : null}
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="baseline"
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                {allStore &&
                allStore
                  .filter((store: any) => store.mt_id === mt_id)
                  .find((state: any) => state.do_end_state === "N") ? (
                  <StopCircleOutlinedIcon
                    style={{ color: "#F8485E", marginRight: 5 }}
                  />
                ) : (
                  <RadioButtonCheckedIcon
                    style={{ color: "#9FE6A0", marginRight: 5 }}
                  />
                )}
                <Typography
                  noWrap
                  fontSize="1.1rem"
                  fontWeight="bold"
                  style={{ color: "#fff" }}
                  mr={0.3}
                >
                  {mt_store}
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* <Box>
            <Button variant='contained' color='primary' onClick={sendNotify}>NOTIFICATION</Button>
          </Box> */}
          <Box className={base.flexRowStartCenter}>
            <Button
              color="primary"
              style={{
                color: theme.palette.info.contrastText,
                marginRight: 30,
              }}
              onClick={openPosPrinterModalHandler}
            >
              <Typography ml={0.5}>???????????????</Typography>
            </Button>
            {props.detail === "order_new" ||
            location.pathname === "/order_new" ||
            props.detail === "order_check" ||
            location.pathname === "/order_check" ||
            props.detail === "order_delivery" ||
            location.pathname === "/order_delivery" ||
            props.detail === "order_done" ||
            location.pathname === "/order_done" ? (
              <Box
                className={base.noDrag}
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
                mr={2}
              >
                <Android12Switch
                  color="primary"
                  onChange={() => setOriginPrintHandler()}
                  checked={do_jumju_origin_use === "Y" ? true : false}
                />
                <Typography color="#fff" ml={0.5}>
                  ???????????????{/*  {do_jumju_origin_use === 'Y' ? 'O' : 'X'} */}
                </Typography>
              </Box>
            ) : null}
            {props.detail !== "order_new" &&
            props.detail !== "order_check" &&
            props.detail !== "order_delivery" &&
            props.detail !== "order_done" &&
            props.type !== "menuAdd" &&
            props.type !== "menuEdit" &&
            props.type !== "couponAdd" ? (
              <Button
                color="primary"
                style={{
                  color: theme.palette.info.contrastText,
                  marginRight: 30,
                }}
                onClick={openCloseStoreModalHandler}
              >
                <Badge
                  badgeContent={
                    allStore
                      ? allStore.filter(
                          (state: any) => state.do_end_state === "N"
                        ).length
                      : 0
                  }
                  color="primary"
                >
                  <StopCircleOutlinedIcon
                    style={{
                      color:
                        allStore &&
                        allStore.filter(
                          (state: any) => state.do_end_state === "N"
                        ).length > 0
                          ? "#F8485E"
                          : "#fff",
                    }}
                  />
                </Badge>
                <Typography ml={0.5}>??????????????????</Typography>
              </Button>
            ) : null}
            {props.detail === "order_new" ? (
              <Box style={{ marginRight: 10 }}>
                <Button
                  variant="contained"
                  style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                  onClick={props.action}
                >
                  <Typography color="info">????????????</Typography>
                </Button>
                <Button
                  variant="outlined"
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderWidth: 2,
                    marginRight: 10,
                  }}
                  onClick={props.action02}
                >
                  <Typography color="primary">????????????</Typography>
                </Button>
                <IconButton
                  color="primary"
                  aria-label="list"
                  component="button"
                  onClick={handlePrint02}
                >
                  <PrintIcon />
                </IconButton>
                {/* <Box style={{ display: 'none' }}>
                  <OrderPrint ref={componentRef} />
                </Box> */}
              </Box>
            ) : props.detail === "order_check_delivery" ? (
              <Box>
                <Button
                  variant="contained"
                  style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                  onClick={props.action}
                >
                  <Typography color="info">????????????</Typography>
                </Button>
                <Button
                  variant="outlined"
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderWidth: 2,
                    marginRight: 10,
                  }}
                  onClick={props.action02}
                >
                  <Typography color="primary">????????????</Typography>
                </Button>
                <IconButton
                  color="primary"
                  aria-label="list"
                  component="button"
                  onClick={handlePrint02}
                >
                  <PrintIcon />
                </IconButton>
                {/* <Box style={{ display: 'none' }}>
                    <OrderPrint ref={componentRef} />
                  </Box> */}
              </Box>
            ) : props.detail === "order_check_takeout" ? (
              <Box>
                <Button
                  variant="contained"
                  style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                  onClick={props.action}
                >
                  <Typography color="info">????????????</Typography>
                </Button>
                <Button
                  variant="outlined"
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderWidth: 2,
                    marginRight: 10,
                  }}
                  onClick={props.action02}
                >
                  <Typography color="primary">????????????</Typography>
                </Button>
                <IconButton
                  color="primary"
                  aria-label="list"
                  component="button"
                  onClick={handlePrint02}
                >
                  <PrintIcon />
                </IconButton>
                {/* <Box style={{ display: 'none' }}>
                     <OrderPrint ref={componentRef} />
                   </Box> */}
              </Box>
            ) : props.detail === "order_delivery" ? (
              <Box>
                <Button
                  variant="contained"
                  style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                  onClick={props.action}
                >
                  <Typography color="info">????????????</Typography>
                </Button>
                <IconButton
                  color="primary"
                  aria-label="list"
                  component="button"
                  onClick={handlePrint02}
                >
                  <PrintIcon />
                </IconButton>
                {/* <Box style={{ display: 'none' }}>
                      <OrderPrint ref={componentRef} />
                    </Box> */}
              </Box>
            ) : props.detail === "order_done" ? (
              <Box style={{ marginRight: 20 }}>
                <IconButton
                  color="primary"
                  aria-label="list"
                  component="button"
                  onClick={handlePrint02}
                >
                  <PrintIcon />
                </IconButton>
                {/* <Box style={{ display: 'none' }}>
                      <OrderPrint ref={componentRef} />
                    </Box> */}
              </Box>
            ) : props.type === "menu" ? (
              <Button
                color="primary"
                variant="contained"
                style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                onClick={() => history.push("/menu_add")}
              >
                <Typography variant="body1" fontSize={16} fontWeight="bold">
                  ????????????
                </Typography>
              </Button>
            ) : props.type === "menuAdd" ? (
              <Button
                color="primary"
                variant="contained"
                style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                onClick={props.action}
              >
                <Typography variant="body1" fontSize={16} fontWeight="bold">
                  ????????????
                </Typography>
              </Button>
            ) : props.type === "menuEdit" ? (
              <Button
                color="primary"
                variant="contained"
                style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                onClick={props.action}
              >
                <Typography variant="body1" fontSize={16} fontWeight="bold">
                  ????????????
                </Typography>
              </Button>
            ) : props.type === "category" ? (
              <Button
                color="primary"
                variant="contained"
                style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                onClick={props.action}
              >
                <Typography variant="body1" fontSize={16} fontWeight="bold">
                  ???????????? ????????????
                </Typography>
              </Button>
            ) : props.type === "coupon" ? (
              <Button
                color="primary"
                variant="contained"
                style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                onClick={() => history.push("/coupon_add")}
              >
                <Typography variant="body1" fontSize={16} fontWeight="bold">
                  ????????????
                </Typography>
              </Button>
            ) : props.type === "couponAdd" ? (
              <Button
                color="primary"
                variant="contained"
                style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                onClick={props.action}
              >
                <Typography variant="body1" fontSize={16} fontWeight="bold">
                  ????????????
                </Typography>
              </Button>
            ) : props.type === "couponEdit" ? (
              <Button
                color="primary"
                variant="contained"
                style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                onClick={props.action}
              >
                <Typography variant="body1" fontSize={16} fontWeight="bold">
                  ????????????
                </Typography>
              </Button>
            ) : props.type === "tips" ? (
              <Button
                color="primary"
                variant="contained"
                style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                onClick={props.action}
              >
                <Typography variant="body1" fontSize={16} fontWeight="bold">
                  ????????????
                </Typography>
              </Button>
            ) : props.type === "storeInfo" ? (
              <Button
                color="primary"
                variant="contained"
                style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                onClick={props.action}
              >
                <Typography variant="body1" fontSize={16} fontWeight="bold">
                  ????????????
                </Typography>
              </Button>
            ) : props.type === "storeSetting" ? (
              <Button
                color="primary"
                variant="contained"
                style={{ paddingLeft: 10, paddingRight: 10, marginRight: 10 }}
                onClick={props.action}
              >
                <Typography variant="body1" fontSize={16} fontWeight="bold">
                  ????????????
                </Typography>
              </Button>
            ) : null}
            {/* <IconButton
              color="info"
              aria-label="list"
              component="span"
              onClick={handleStoreDrawerToggle}
            >
              <AppsIcon />
            </IconButton> */}
            <Button
              variant="outlined"
              color="primary"
              style={{ paddingLeft: 10, paddingRight: 10, borderWidth: 2 }}
              onClick={handleStoreDrawerToggle}
            >
              <Typography color="primary">????????????</Typography>
            </Button>
            {/* <BootstrapTooltip title="???????????? ????????? ????????? ???????????? ??? ????????????." placement='bottom-start'>
              <IconButton className='dragBtn' style={{ marginLeft: 20 }}>
                <DragHandleIcon style={{ color: '#fff' }} />
              </IconButton>
            </BootstrapTooltip> */}
            <BootstrapTooltip title="?????????" placement="bottom-start">
              <IconButton onClick={windowMinimizeHandler}>
                <MinimizeIcon style={{ color: "#fff" }} />
              </IconButton>
            </BootstrapTooltip>
            <BootstrapTooltip title="??????" placement="bottom-start">
              <IconButton onClick={windowCloseHandler}>
                <CloseIcon style={{ color: "#fff" }} />
              </IconButton>
            </BootstrapTooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ?????? ???????????? */}
      <Box
        component="nav"
        sx={{ flex: 1, width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
        <Drawer
          container={container}
          variant="temporary"
          anchor="right"
          open={storeListOpen}
          onClose={handleStoreDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {storeListDrawer}
        </Drawer>
      </Box>
    </Box>
  );
}
