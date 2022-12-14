import React, { useState } from "react";
import { useSelector } from "react-redux";
import Draggable from "react-draggable";

// Material UI Components
import Paper, { PaperProps } from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@mui/material/Checkbox";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/core/Alert";
import InputAdornment from "@material-ui/core/InputAdornment";

// Material icons
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import QueueIcon from "@material-ui/icons/Queue";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AddPhotoAlternateOutlinedIcon from "@material-ui/icons/AddPhotoAlternateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

// Local Component
import Api from "../Api";
import Header from "../components/Header";
import { baseStyles, theme, MainBox } from "../styles/base";
import { MenuStyles } from "../styles/custom";

interface IOption {
  [key: string]: string;
}
interface MenuOption {
  name: string;
  select: IOption[];
}
interface ICategory {
  label: string;
  value: string;
}
interface IMenu {
  ca_name: string;
  ca_code: string;
}

type OptionType = "default" | "add"; // ???????????? | ?????? ??????
type CheckedType = "1" | "0"; // ??????(true) | ?????????(false)

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function MenuAdd(props: any) {
  const base = baseStyles();
  const menu = MenuStyles();
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);

  const [category, setCategory] = useState(""); // ???????????? ?????????
  const [menuName, setMenuName] = useState(""); // ?????????
  const [menuInfo, setMenuInfo] = useState(""); // ?????? ????????????
  const [menuPrice, setMenuPrice] = useState(""); // ?????? ????????????
  const [menuDescription, setMenuDescription] = useState(""); // ?????? ????????????
  const [options, setOptions] = useState<MenuOption[]>([]); // ????????????
  const [addOptions, setAddOptions] = useState<MenuOption[]>([]); // ????????????
  const [open, setOpen] = useState(false); // ?????? ?????? ????????? ?????? on/off
  const [delModalOpen, setDelModalOpen] = useState(false); // ????????? ????????? ?????? on/off
  const [delImageModalOpen, setDelImageModalOpen] = useState(false); // ?????? ????????? ????????? ?????? on/off

  const [mainOptionType, setMainOptionType] = useState<OptionType>("default"); // ?????? ?????? ??????
  const [mainIndex, setMainIndex] = useState(0); // ?????? ?????? ?????????
  const [optionType, setOptionType] = useState<OptionType>("default"); // ?????? ??????('default' : ???????????? | 'add' : ????????????)
  const [parentIndex, setParentIndex] = useState(0); // ?????? index
  const [childIndex, setChildIndex] = useState(0); // ???????????? index
  const [checked01, setChecked01] = useState<CheckedType>("0"); // ????????????('1' : ?????? | '0': ????????????)
  const [checked03, setChecked03] = useState<CheckedType>("0"); // ??????('1' : ?????? | '0': ????????????)
  const [checked04, setChecked04] = useState<CheckedType>("0"); // ?????????('1' : ?????? | '0': ????????????)
  const [checked05, setChecked05] = useState<CheckedType>("0"); // ??????('1' : ?????? | '0': ????????????)
  const [checked07, setChecked07] = useState<CheckedType>("0"); // 1?????? ??????('1' : ?????? | '0': ????????????)
  const [checked08, setChecked08] = useState<CheckedType>("0"); // ????????????('1' : ?????? | '0': ????????????)

  const [checked02, setChecked02] = useState<CheckedType>("1"); // ????????????('1' : ?????? | '0': ??????)
  const [soldOut, setSoldOut] = useState<CheckedType>("0"); // ????????????('1' : ?????? | '0': ????????????)
  const [image, setImage] = useState(""); // ?????? ????????? URL

  const optionUsage = [
    { value: "Y", label: "?????????" },
    { value: "N", label: "????????????" },
  ];

  // ????????????, ???????????? ???
  const [value, setValue] = React.useState("default");

  // ????????? ?????????
  const [source, setSource] = React.useState({});
  const [imageUsable, setImageUsable] = React.useState(true); // ????????? ???????????? ??????

  const onChange = (evt: any) => {
    const img = evt.target.files[0];

    console.log("img detail", img);
    let typeArr: string[] = img.type.split("/");
    console.log("img typeArr", typeArr);
    if (typeArr[0] !== "image") {
      setToastState({
        msg: "????????? ????????? ????????? ?????? ??? ????????????.",
        severity: "error",
      });
      handleOpenAlert();
      setImage("");
      return false;
    } else if (
      typeArr[1] !== "jpg" &&
      typeArr[1] !== "jpeg" &&
      typeArr[1] !== "png" &&
      typeArr[1] !== "bmp"
    ) {
      setToastState({
        msg: "????????? ???????????? ??????????????????.",
        severity: "error",
      });
      handleOpenAlert();
      setImageUsable(false);
      setImage("");
    } else {
      setImageUsable(true);
      setSource(img);

      if (evt.target.files.length) {
        let file = evt.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          setImage(e.target.result);
        };
      } else {
        setImage("");
      }
    }
  };

  // (?????????)???????????? ????????????
  const [menuCategory, setMenuCategory] = React.useState<ICategory[]>([]);

  const getCategoryHandler = () => {
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: "select",
    };

    Api.send("store_item_category", param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === "Y") {
        arrItems.map((menu: IMenu) => {
          return setMenuCategory((prev) => [
            ...prev,
            {
              label: menu.ca_name,
              value: menu.ca_code,
            },
          ]);
        });
      } else {
        return console.log("????????? ???????????? ???????????????.");
      }
    });
  };

  React.useEffect(() => {
    getCategoryHandler();

    return () => getCategoryHandler();
  }, [mt_id, mt_jumju_code]);

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

  const createOption = () => {
    return {
      multiple: false,
      name: "",
      select: [
        {
          value: "",
          price: "",
          status: "Y",
        },
      ],
    };
  };

  const optionAddHandler = (payload: OptionType) => {
    if (payload === "default") {
      if (options.length < 10) {
        setOptions((options) => {
          const result = [...options];
          result.push(createOption());
          return result;
        });
      } else {
        setToastState({
          msg: "??????????????? ?????? 10??? ???????????? ??? ????????????.",
          severity: "error",
        });
        handleOpenAlert();
      }
    } else {
      setAddOptions((options) => {
        const result = [...options];
        result.push(createOption());
        return result;
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // ?????? ????????? ?????? ??? ??????
  const delImageHandler = () => {
    setDelImageModalOpen(!delImageModalOpen);
  };

  // ?????? ????????? '????????????' ?????? ?????????
  const deleteMainImage = () => {
    setSource({});
    setImage("");
    setDelImageModalOpen(false);
  };

  // ?????? ?????? ????????? ?????? ??????
  const handleClickOpen02 = (type: OptionType, index: number) => {
    setMainOptionType(type);
    setMainIndex(index);
    setDelModalOpen(true);
  };

  // ?????? ?????? ?????? ??????
  const handleClose02 = () => {
    setDelModalOpen(false);
  };

  // ?????? ?????? ?????? ??????
  const deleteMainOption = () => {
    console.log("mainOptionType", mainOptionType);
    console.log("mainIndex", mainIndex);
    setDelModalOpen(!delModalOpen);
    // return false;

    if (mainOptionType === "default") {
      setOptions((options) => {
        const result = [...options];
        result.splice(mainIndex, 1);
        return result;
      });
    } else {
      setAddOptions((options) => {
        const result = [...options];
        result.splice(mainIndex, 1);
        return result;
      });
    }
  };

  // ?????? ?????? ?????? ??? ?????????
  const handleClickOpen = (type: OptionType, parent: number, child: number) => {
    setOptionType(type);
    setParentIndex(parent);
    setChildIndex(child);
    setOpen(true);
  };

  // ?????? ?????? ?????? ?????????
  const deleteOption = () => {
    if (optionType === "default") {
      setOptions((options) => {
        const result = [...options];
        result[parentIndex].select.splice(childIndex, 1);
        return result;
      });
    } else {
      setAddOptions((options) => {
        const result = [...options];
        result[parentIndex].select.splice(childIndex, 1);
        return result;
      });
    }
    setOpen(false);
  };

  const addMenuHandler = () => {
    if (category === "") {
      setToastState({ msg: "??????????????? ??????????????????.", severity: "error" });
      handleOpenAlert();
    } else if (menuName === "") {
      setToastState({ msg: "???????????? ??????????????????.", severity: "error" });
      handleOpenAlert();
    } else if (menuPrice === "" || menuPrice === "0") {
      setToastState({ msg: "??????????????? ??????????????????.", severity: "error" });
      handleOpenAlert();
    } else {
      let isExistDefaultDetailOption: boolean = true; // ???????????? - ???????????? ??????
      let isExistAddDetailOption: boolean = true; // ???????????? - ???????????? ??????

      // ???????????? - ???????????? ?????? ??????
      if (options && options.length > 0) {
        options.map((option: MenuOption) => {
          if (option.name === "" || option.name === null) {
            setToastState({
              msg: "??????????????? ???????????? ????????????.",
              severity: "error",
            });
            handleOpenAlert();
            isExistDefaultDetailOption = false;
            return false;
          }

          option.select.map((item: IOption) => {
            if (item.value === "" || item.value === null) {
              setToastState({
                msg: "??????????????? ?????????????????? ????????????.",
                severity: "error",
              });
              handleOpenAlert();
              isExistDefaultDetailOption = false;
              return;
            } else {
              isExistDefaultDetailOption = true;
              return;
            }
          });
        });
      }

      // ???????????? - ???????????? ?????? ??????
      if (addOptions && addOptions.length > 0) {
        addOptions.map((option: MenuOption) => {
          if (option.name === "" || option.name === null) {
            setToastState({
              msg: "??????????????? ???????????? ????????????.",
              severity: "error",
            });
            handleOpenAlert();
            isExistDefaultDetailOption = false;
            return false;
          }

          option.select.map((item: IOption) => {
            if (item.value === "" || item.value === null) {
              setToastState({
                msg: "??????????????? ?????????????????? ????????????.",
                severity: "error",
              });
              handleOpenAlert();
              isExistAddDetailOption = false;
            } else {
              isExistAddDetailOption = true;
            }
          });

          return;
        });
      }

      let filterNameArr: string[] = []; // ???????????? name?????? ?????? ??? ??????
      let isExistSameValue: boolean = false; // ???????????? ?????? ????????? ????????? ??????

      let filterNameArr02: string[] = []; // ???????????? name?????? ?????? ??? ??????
      let isExistSameValue02: boolean = false; // ???????????? ?????? ????????? ????????? ??????

      options?.map((option: any, i: number) => filterNameArr.push(option.name));

      addOptions?.map((option: any, i: number) =>
        filterNameArr02.push(option.name)
      );

      // ???????????? ?????? ??? ??????
      for (let i = 0; i < filterNameArr.length; i++) {
        for (let j = 0; j < filterNameArr.length; j++) {
          if (i !== j) {
            console.log("filterNameArr[i]", filterNameArr[i]);
            console.log("filterNameArr[j]", filterNameArr[j]);

            if (filterNameArr[i] === filterNameArr[j]) {
              setToastState({
                msg: "?????????????????? ?????? ???????????? ????????????.",
                severity: "error",
              });
              handleOpenAlert();
              isExistSameValue = true;
            } else {
              isExistSameValue = false;
            }
          }
        }
      }

      // ???????????? ?????? ??? ??????
      for (let i = 0; i < filterNameArr02.length; i++) {
        for (let j = 0; j < filterNameArr02.length; j++) {
          if (i !== j) {
            console.log("filterNameArr02[i]", filterNameArr02[i]);
            console.log("filterNameArr02[j]", filterNameArr02[j]);

            if (filterNameArr02[i] === filterNameArr02[j]) {
              setToastState({
                msg: "?????????????????? ?????? ???????????? ????????????.",
                severity: "error",
              });
              handleOpenAlert();
              isExistSameValue02 = true;
            } else {
              isExistSameValue02 = false;
            }
          }
        }
      }

      // console.log('????????? ??????');
      // console.log('isExistSameValue', isExistSameValue);
      // console.log('isExistSameValue02', isExistSameValue02);
      // console.log('isExistDefaultDetailOption', isExistDefaultDetailOption);
      // console.log('isExistAddDetailOption', isExistAddDetailOption);
      if (
        !isExistSameValue &&
        !isExistSameValue02 &&
        isExistDefaultDetailOption &&
        isExistAddDetailOption
      ) {
        let param = {
          jumju_id: mt_id,
          jumju_code: mt_jumju_code,
          mode: "insert",
          ca_id2: category,
          menuName: menuName,
          menuInfo: menuInfo,
          menuPrice: menuPrice,
          menuDescription: menuDescription,
          it_type1: checked01,
          it_type3: checked03,
          it_type4: checked04,
          it_type5: checked05,
          it_type7: checked07,
          it_type8: checked08,
          it_soldout: soldOut,
          it_use: checked02,
          menuOption: JSON.stringify(options),
          menuAddOption: JSON.stringify(addOptions),
          it_img1: source,
        };

        console.log("?????? ?????? param", param);

        Api.send2("store_item_input", param, (args: any) => {
          let resultItem = args.resultItem;
          let arrItems = args.arrItems;

          console.log("?????? ?????? resultItem", resultItem);
          console.log("?????? ?????? arrItems", arrItems);

          if (resultItem.result === "Y") {
            setToastState({
              msg: "????????? ?????????????????????.",
              severity: "success",
            });
            handleOpenAlert();
            // setTimeout(() => {
            //   history.push('/menu');
            // }, 700);
          } else {
            setToastState({
              msg: "????????? ?????? ?????? ????????? ?????????????????????.",
              severity: "error",
            });
            handleOpenAlert();
          }
        });
      }
    }
  };

  console.log("image ??", image);

  return (
    <Box component="div" className={base.root}>
      <Header type="menuAdd" action={addMenuHandler} />
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
      <MainBox
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
        style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box className={base.mb10} style={{ position: "relative" }}>
              {image ? (
                <img
                  id="menuImg"
                  src={image}
                  className={menu.menuImg}
                  alt="???????????????"
                />
              ) : (
                <Box
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 350,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#ececec",
                  }}
                >
                  <p style={{ color: "#666" }}>????????? ?????????</p>
                </Box>
              )}
              <input
                accept="image/*"
                className={menu.menuInput}
                id="contained-button-file"
                multiple
                type="file"
                onChange={onChange}
                // onChange={handleUploadClick}
              />
              <label htmlFor="contained-button-file">
                <Fab
                  component="span"
                  variant="circular"
                  color="primary"
                  style={{
                    position: "absolute",
                    right: 70,
                    bottom: 10,
                    color: theme.palette.primary.contrastText,
                  }}
                  className={menu.photoSelectIcon}
                >
                  <AddPhotoAlternateOutlinedIcon />
                </Fab>
              </label>
              <Fab
                component="span"
                variant="circular"
                color="default"
                style={{
                  position: "absolute",
                  right: 5,
                  bottom: 10,
                  color: theme.palette.primary.contrastText,
                }}
                className={menu.photoSelectIcon}
                onClick={delImageHandler}
              >
                <DeleteOutlineOutlinedIcon />
              </Fab>
            </Box>

            {/* <div className={base.mb20}></div> */}
            <Box mb={3}>
              <small>
                ????????? ????????? ????????? ???????????? <mark>jpg, jpeg, png, bmp</mark>
                ?????????.
              </small>
              {!imageUsable && (
                <>
                  <br />
                  <small style={{ color: "red" }}>
                    ???????????? ???????????? ????????? ???????????? ??????????????????.
                  </small>
                </>
              )}
            </Box>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="position"
                name="position"
                defaultValue="0"
              >
                <FormControlLabel
                  value={"0"}
                  checked={checked01 === "1" ? true : false}
                  control={
                    <Checkbox color="primary" style={{ paddingLeft: 0 }} />
                  }
                  label="??????"
                  labelPlacement="start"
                  style={{ width: 80, margin: 0, flexDirection: "row" }}
                  onChange={() =>
                    checked01 === "1" ? setChecked01("0") : setChecked01("1")
                  }
                />
                <FormControlLabel
                  value={"0"}
                  checked={checked03 === "1" ? true : false}
                  control={
                    <Checkbox color="primary" style={{ paddingLeft: 0 }} />
                  }
                  label="??????"
                  labelPlacement="start"
                  style={{ width: 80, margin: 0, flexDirection: "row" }}
                  onChange={() =>
                    checked03 === "1" ? setChecked03("0") : setChecked03("1")
                  }
                />
                <FormControlLabel
                  value={"0"}
                  checked={checked04 === "1" ? true : false}
                  control={
                    <Checkbox color="primary" style={{ paddingLeft: 0 }} />
                  }
                  label="?????????"
                  labelPlacement="start"
                  style={{ width: 95, margin: 0, flexDirection: "row" }}
                  onChange={() =>
                    checked04 === "1" ? setChecked04("0") : setChecked04("1")
                  }
                />
                <FormControlLabel
                  value={"0"}
                  checked={checked05 === "1" ? true : false}
                  control={
                    <Checkbox color="primary" style={{ paddingLeft: 0 }} />
                  }
                  label="??????"
                  labelPlacement="start"
                  style={{ width: 80, margin: 0, flexDirection: "row" }}
                  onChange={() =>
                    checked05 === "1" ? setChecked05("0") : setChecked05("1")
                  }
                />
                <FormControlLabel
                  value={"0"}
                  checked={checked07 === "1" ? true : false}
                  control={
                    <Checkbox color="primary" style={{ paddingLeft: 0 }} />
                  }
                  label="1?????? ??????"
                  labelPlacement="start"
                  style={{ width: 120, margin: 0, flexDirection: "row" }}
                  onChange={() =>
                    checked07 === "1" ? setChecked07("0") : setChecked07("1")
                  }
                />
                <FormControlLabel
                  value={"0"}
                  checked={checked08 === "1" ? true : false}
                  control={
                    <Checkbox color="primary" style={{ paddingLeft: 0 }} />
                  }
                  label="????????????"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: "row" }}
                  onChange={() =>
                    checked08 === "1" ? setChecked08("0") : setChecked08("1")
                  }
                />
              </RadioGroup>
            </FormControl>
            <div className={base.mb20}></div>
            {/* {checked01 === '1' ?
              <div className={base.mb20}>
                <Typography variant="body1" component="p" color="primary">
                  ??? ??????????????? ?????????????????????.
                </Typography>
              </div>
              :
              <div className={base.mb40}>
              </div>
            } */}
            {/* <div className={base.mb20}>
                <Typography variant="body1" component="p" color="textinfo">
                  ??? ??????????????? ?????????????????????.
                </Typography>
              </div>
            */}
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="position"
                name="position"
                defaultValue="0"
              >
                <FormControlLabel
                  value={"1"}
                  checked={checked02 === "1" ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="????????????"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: "row" }}
                  onChange={() => setChecked02("1")}
                />
                <FormControlLabel
                  value={"0"}
                  checked={checked02 === "0" ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="????????????"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: "row" }}
                  onChange={() => setChecked02("0")}
                />
              </RadioGroup>
            </FormControl>
            {checked02 === "1" ? (
              <div className={base.mb20}>
                <Typography variant="body1" component="p" color="primary">
                  ??? ?????? ?????? ????????? ?????????????????????.
                </Typography>
              </div>
            ) : (
              <div className={base.mb20}>
                <Typography variant="body1" component="p" color="textinfo">
                  ??? ?????? ?????? ????????? ?????????????????????.
                </Typography>
              </div>
            )}
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="position"
                name="position"
                defaultValue="0"
              >
                <FormControlLabel
                  value={"0"}
                  checked={soldOut === "1" ? true : false}
                  control={
                    <Checkbox color="primary" style={{ paddingLeft: 0 }} />
                  }
                  label="??????"
                  labelPlacement="start"
                  style={{ width: 80, margin: 0, flexDirection: "row" }}
                  onChange={(e) =>
                    soldOut === "1" ? setSoldOut("0") : setSoldOut("1")
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              variant="outlined"
              className={base.formControl}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                ???????????? ??????
              </InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as string)}
                label="????????????"
                required
              >
                {menuCategory && menuCategory.length > 0 ? (
                  menuCategory.map((category, index) => (
                    <MenuItem key={index} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>????????? ??????????????? ????????????.</em>
                  </MenuItem>
                )}
              </Select>
              <div className={base.mb30}></div>
              <TextField
                value={menuName}
                label="?????????"
                variant="outlined"
                required
                placeholder="???????????? ??????????????????."
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setMenuName(e.target.value as string)}
              />
              <div className={base.mb30}></div>
              <TextField
                value={menuInfo}
                label="????????????"
                variant="outlined"
                placeholder="??????????????? ??????????????????."
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setMenuInfo(e.target.value as string)}
              />
              <div className={base.mb30}></div>
              <TextField
                label="????????????"
                value={menuPrice}
                variant="outlined"
                required
                placeholder="0"
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
                    setMenuPrice(changed);
                  }
                }}
              />
              <div className={base.mb30}></div>
              <TextField
                value={menuDescription}
                fullWidth
                className={base.multiTxtField}
                label="??????????????????"
                multiline
                rows={10}
                placeholder="?????? ??????????????? ??????????????????."
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={(e) => setMenuDescription(e.target.value as string)}
              />
            </FormControl>
          </Grid>
        </Grid>
        <div className={base.mb30}></div>

        <Box sx={{ width: "100%", typography: "body1" }}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              onClick={() => setValue("default")}
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{
                flex: 1,
                maxWidth: "inherit",
                color: value === "default" ? "#000" : "#c4c4c4",
                borderWidth: value === "default" ? 1 : 0,
                borderStyle: "solid",
                borderColor: "#c4c4c4",
                borderBottom: value === "default" ? "none" : 1,
                borderBottomColor:
                  value === "default" ? "transparent" : "#c4c4c4",
                borderBottomStyle: value === "default" ? "none" : "solid",
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              }}
            >
              <p>????????????</p>
            </Box>
            <Box
              onClick={() => setValue("add")}
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{
                flex: 1,
                maxWidth: "inherit",
                color: value === "add" ? "#000" : "#c4c4c4",
                borderWidth: value === "add" ? 1 : 0,
                borderStyle: "solid",
                borderColor: "#c4c4c4",
                borderBottom: value === "add" ? "none" : 1,
                borderBottomColor: value === "add" ? "transparent" : "#c4c4c4",
                borderBottomStyle: value === "add" ? "none" : "solid",
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              }}
            >
              <p>????????????</p>
            </Box>
          </Box>

          <Box py={1} />
          {value === "default" && (
            <Grid item xs={12} md={12}>
              <div className={base.mb30}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" component="h6">
                    ????????????
                  </Typography>
                  <Button
                    variant="contained"
                    style={{ boxShadow: "none" }}
                    onClick={() => optionAddHandler("default")}
                    color="primary"
                    startIcon={<QueueIcon />}
                  >
                    ????????????
                  </Button>
                </div>
              </div>
              {options &&
                options.length > 0 &&
                options.map((option, index) => (
                  <FormControl key={index} fullWidth>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      key={index}
                      style={{ marginBottom: 20 }}
                    >
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        style={{ width: "70%" }}
                      >
                        <TextField
                          value={
                            option.name === null || option.name === undefined
                              ? ""
                              : option.name
                          }
                          id="outlined-basic"
                          label={`?????? ????????? ${index < 9 ? "0" : ""}${
                            index + 1
                          }`}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          placeholder="???????????? ???: ????????? or ??? ???"
                          variant="outlined"
                          className={base.fieldMargin}
                          style={{ width: "100%", marginRight: "1%" }}
                          onChange={(e) => {
                            setOptions((options) => {
                              const result = [...options];
                              result[index].name = e.target.value as string;
                              return result;
                            });
                          }}
                        />
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        style={{ width: "30%" }}
                      >
                        <Button
                          className={base.formControl02}
                          variant="outlined"
                          color="info"
                          startIcon={<PostAddIcon />}
                          onClick={() =>
                            setOptions((options) => {
                              const result = [...options];
                              result[index].select.push({
                                value: "",
                                price: "",
                                status: "Y",
                              });
                              return result;
                            })
                          }
                        >
                          ??????
                        </Button>
                        <Button
                          className={base.optionDeleteBtn}
                          variant="outlined"
                          color="info"
                          startIcon={<HighlightOffIcon />}
                          onClick={() => handleClickOpen02("default", index)}
                        >
                          ??????
                        </Button>
                      </Box>
                    </Box>
                    {option.select &&
                      option.select.map((item, selectIndex) => (
                        <Box
                          className={base.fieldMargin}
                          display="flex"
                          flexDirection="row"
                          justifyContent="flex-start"
                          alignItems="center"
                          key={selectIndex}
                          style={{ height: 50 }}
                        >
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            style={{ width: "70%" }}
                          >
                            <Typography fontSize={18} color="#ffc739" mr={1}>
                              ???
                            </Typography>
                            <TextField
                              style={{ width: "69%", marginRight: "1%" }}
                              value={
                                item.value === null || item.value === undefined
                                  ? ""
                                  : item.value
                              }
                              id="outlined-basic"
                              // label={`?????? ${index < 9 ? '0' : ''}${index + 1} - ?????????`}
                              label="?????????"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              placeholder="???????????? ??????????????????."
                              variant="outlined"
                              onChange={(e) => {
                                setOptions((options) => {
                                  const result = [...options];
                                  result[index].select[selectIndex].value = e
                                    .target.value as string;
                                  return result;
                                });
                              }}
                            />
                            <TextField
                              style={{ width: "29%", marginRight: "1%" }}
                              value={
                                item.price === null || item.price === undefined
                                  ? ""
                                  : item.price
                              }
                              id="outlined-basic"
                              // label={`?????? ${index < 9 ? '0' : ''}${index + 1} - ????????????`}
                              label="????????????"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              placeholder="0"
                              variant="outlined"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    ???
                                  </InputAdornment>
                                ),
                              }}
                              onChange={(e) => {
                                const re = /^[0-9\b]+$/;
                                if (
                                  e.target.value === "" ||
                                  re.test(e.target.value)
                                ) {
                                  let changed = e.target.value.replace(
                                    /(^0+)/,
                                    ""
                                  );
                                  setOptions((options) => {
                                    const result = [...options];
                                    result[index].select[selectIndex].price =
                                      changed;
                                    return result;
                                  });
                                }
                              }}
                            />
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            style={{ width: "30%" }}
                          >
                            <FormControl
                              variant="outlined"
                              className={base.formControl02}
                            >
                              <InputLabel>????????????</InputLabel>
                              <Select
                                value={item.status}
                                style={{ width: "100%" }}
                                onChange={(e) => {
                                  setOptions((options) => {
                                    const result = [...options];
                                    result[index].select[selectIndex].status = e
                                      .target.value as string;
                                    return result;
                                  });
                                }}
                                label="????????????"
                                required
                              >
                                {optionUsage.map((usage, index) => (
                                  <MenuItem key={index} value={usage.value}>
                                    {usage.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <Button
                              className={base.optionDeleteBtn}
                              startIcon={<HighlightOffIcon />}
                              variant="outlined"
                              // startIcon={<HighlightOffIcon />}
                              onClick={() =>
                                handleClickOpen("default", index, selectIndex)
                              }
                            >
                              ??????
                            </Button>
                          </Box>
                        </Box>
                      ))}
                    <div
                      style={{
                        marginTop: 10,
                        marginBottom: 23,
                        height: 1,
                        backgroundColor: "#e5e5e5",
                      }}
                    ></div>
                  </FormControl>
                ))}
            </Grid>
          )}

          {value === "add" && (
            <Grid item xs={12} md={12}>
              <div className={base.mb30}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" component="h6">
                    ????????????
                  </Typography>
                  <Button
                    variant="contained"
                    style={{ boxShadow: "none" }}
                    onClick={() => optionAddHandler("add")}
                    color="primary"
                    startIcon={<QueueIcon />}
                  >
                    ????????????
                  </Button>
                </div>
              </div>
              {addOptions &&
                addOptions.length > 0 &&
                addOptions.map((option, index) => (
                  <FormControl key={index} fullWidth>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      key={index}
                      style={{ marginBottom: 20 }}
                    >
                      <Box
                        display="flex"
                        flexDirection="row"
                        key={index}
                        style={{ width: "70%" }}
                      >
                        <TextField
                          value={
                            option.name === null || option.name === undefined
                              ? ""
                              : option.name
                          }
                          id="outlined-basic"
                          label={`?????? ????????? ${index < 9 ? "0" : ""}${
                            index + 1
                          }`}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          placeholder="?????????????????? ??????????????????."
                          variant="outlined"
                          className={base.fieldMargin}
                          style={{ width: "100%", marginRight: "1%" }}
                          onChange={(e) => {
                            setAddOptions((options) => {
                              const result = [...options];
                              result[index].name = e.target.value as string;
                              return result;
                            });
                          }}
                        />
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        style={{ width: "30%" }}
                      >
                        <Button
                          className={base.formControl02}
                          variant="outlined"
                          color="info"
                          startIcon={<PostAddIcon />}
                          onClick={() =>
                            setAddOptions((options) => {
                              const result = [...options];
                              result[index].select.push({
                                value: "",
                                price: "",
                                status: "Y",
                              });
                              return result;
                            })
                          }
                        >
                          ??????
                        </Button>
                        <Button
                          className={base.optionDeleteBtn}
                          variant="outlined"
                          color="info"
                          startIcon={<HighlightOffIcon />}
                          onClick={() => handleClickOpen02("add", index)}
                        >
                          ??????
                        </Button>
                      </Box>
                    </Box>
                    {option.select &&
                      option.select.map((item, selectIndex) => (
                        <Box
                          className={base.fieldMargin}
                          display="flex"
                          flexDirection="row"
                          justifyContent="flex-start"
                          alignItems="center"
                          key={selectIndex}
                          style={{ height: 50 }}
                        >
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            style={{ width: "70%" }}
                          >
                            <Typography fontSize={18} color="#ffc739" mr={1}>
                              ???
                            </Typography>
                            <TextField
                              style={{ width: "69%", marginRight: "1%" }}
                              value={
                                item.value === null || item.value === undefined
                                  ? ""
                                  : item.value
                              }
                              id="outlined-basic"
                              // label={`?????? ${index < 9 ? '0' : ''}${index + 1} - ?????????`}
                              label="?????????"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              placeholder="???????????? ??????????????????."
                              variant="outlined"
                              onChange={(e) => {
                                setAddOptions((options) => {
                                  const result = [...options];
                                  result[index].select[selectIndex].value = e
                                    .target.value as string;
                                  return result;
                                });
                              }}
                            />
                            <TextField
                              style={{ width: "29%", marginRight: "1%" }}
                              value={
                                item.price === null || item.price === undefined
                                  ? ""
                                  : item.price
                              }
                              id="outlined-basic"
                              // label={`?????? ${index < 9 ? '0' : ''}${index + 1} - ????????????`}
                              label="????????????"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              placeholder="0"
                              variant="outlined"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    ???
                                  </InputAdornment>
                                ),
                              }}
                              onChange={(e) => {
                                const re = /^[0-9\b]+$/;
                                if (
                                  e.target.value === "" ||
                                  re.test(e.target.value)
                                ) {
                                  let changed = e.target.value.replace(
                                    /(^0+)/,
                                    ""
                                  );
                                  setAddOptions((options) => {
                                    const result = [...options];
                                    result[index].select[selectIndex].price =
                                      changed;
                                    return result;
                                  });
                                }
                              }}
                            />
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            style={{ width: "30%" }}
                          >
                            <FormControl
                              variant="outlined"
                              className={base.formControl02}
                            >
                              <InputLabel>????????????</InputLabel>
                              <Select
                                value={item.status}
                                style={{ width: "100%" }}
                                onChange={(e) => {
                                  setAddOptions((options) => {
                                    const result = [...options];
                                    result[index].select[selectIndex].status = e
                                      .target.value as string;
                                    return result;
                                  });
                                }}
                                label="????????????"
                                required
                              >
                                {optionUsage.map((usage, index) => (
                                  <MenuItem key={index} value={usage.value}>
                                    {usage.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <Button
                              className={base.optionDeleteBtn}
                              startIcon={<HighlightOffIcon />}
                              variant="outlined"
                              color="info"
                              // startIcon={<HighlightOffIcon />}
                              onClick={() =>
                                handleClickOpen("add", index, selectIndex)
                              }
                            >
                              ??????
                            </Button>
                          </Box>
                        </Box>
                      ))}
                    <div
                      style={{
                        marginTop: 10,
                        marginBottom: 23,
                        height: 1,
                        backgroundColor: "#e5e5e5",
                      }}
                    ></div>
                  </FormControl>
                ))}
            </Grid>
          )}
        </Box>

        {/* ?????? ????????? ????????? ?????? */}
        <Dialog
          open={delImageModalOpen}
          onClose={delImageHandler}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle
            style={{ cursor: "move", width: 500 }}
            id="draggable-dialog-title"
          >
            ?????? ????????? ??????
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              ?????? ???????????? ?????????????????????????
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={delImageHandler} color="primary">
              ??????
            </Button>
            <Button onClick={deleteMainImage} color="primary">
              ????????????
            </Button>
          </DialogActions>
        </Dialog>
        {/* // ?????? ????????? ????????? ?????? */}

        {/* ???????????? ????????? ?????? */}
        <Dialog
          open={delModalOpen}
          onClose={handleClose02}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle
            style={{ cursor: "move", width: 500 }}
            id="draggable-dialog-title"
          >
            ?????? ?????????????????????????
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`???????????? ${
                mainOptionType === "default" ? "????????????" : "????????????"
              }??? ?????????????????????????`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose02} color="primary">
              ??????
            </Button>
            <Button onClick={deleteMainOption} color="primary">
              ????????????
            </Button>
          </DialogActions>
        </Dialog>
        {/* // ???????????? ????????? ?????? */}

        {/* ???????????? ????????? ?????? */}
        <Dialog
          open={open}
          onClose={handleClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle
            style={{ cursor: "move", width: 500 }}
            id="draggable-dialog-title"
          >
            ?????? ?????????????????????????
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              ???????????? ??????????????? ?????????????????????????
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
              ??????
            </Button>
            <Button onClick={deleteOption} color="primary">
              ????????????
            </Button>
          </DialogActions>
        </Dialog>
        {/* // ???????????? ????????? ?????? */}
      </MainBox>
    </Box>
  );
}
