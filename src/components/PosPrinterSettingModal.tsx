import * as React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";

// Material UI Components
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { styled } from "@material-ui/core/styles";
import Switch, { SwitchProps } from "@material-ui/core/Switch";

// Local Component
import { theme, baseStyles, ModalCancelButton } from "../styles/base";
import * as storeAction from "../redux/actions/storeAction";
import Api from "../Api";
import { ButtonGroup, Select } from "@material-ui/core";
import { Button, FormControl, InputLabel, MenuItem } from "@mui/material";

interface IProps {
  isOpen: boolean;
  isClose: () => void;
}

interface Object {
  [key: string]: string;
}

export default function PosPrinterSettingModal(props: IProps) {
  const base = baseStyles();
  const dispatch = useDispatch();
  const { mt_jumju_key } = useSelector((state: any) => state.login);
  const { allStore, closedStore } = useSelector((state: any) => state.store);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={base.modal}
      open={props.isOpen}
      // onClose={props.isClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.isOpen}>
        <Box className={clsx(base.modalInner, base.colCenter)} p={5}>
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
            POS 프린터 설정
          </Typography>
          <Typography id="transition-modal-description">
            영수증 프린터기의 세부 정보를 설정해주세요.
          </Typography>
          <Box sx={{ m: 1 }} />
          <Box className={base.flexColumn}>
            <Box className={base.flexRowStartCenter}>
              <Typography
                style={{ minWidth: 75, flex: 1, textAlign: "left" }}
                sx={{ mr: 2 }}
              >
                Port
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  label="Port"
                >
                  <InputLabel id="demo-simple-select-helper-label">
                    Port
                  </InputLabel>
                  <MenuItem value="">NONE</MenuItem>
                  <MenuItem value="COM3">COM3</MenuItem>
                  <MenuItem value="COM4">COM4</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ m: 1 }} />
            <Box className={base.flexRowStartCenter}>
              <Typography
                style={{ minWidth: 75, flex: 1, textAlign: "left" }}
                sx={{ mr: 2 }}
              >
                BoudRate
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  label="BoudRate"
                >
                  <InputLabel id="demo-simple-select-helper-label">
                    Port
                  </InputLabel>
                  <MenuItem value="">NONE</MenuItem>
                  <MenuItem value="COM3">COM3</MenuItem>
                  <MenuItem value="COM4">COM4</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box
            style={{ height: 1, width: "100%", backgroundColor: "#d5d5d5" }}
            my={2}
          />
          <ButtonGroup fullWidth>
            <Button
              variant="outlined"
              style={{
                height: 50,
                minWidth: 100,
                fontSize: 14,
                fontWeight: "bold",
                boxShadow: "none",
              }}
            >
              테스트인쇄
            </Button>
            <Button
              color="primary"
              variant="contained"
              style={{
                height: 50,
                minWidth: 100,
                fontSize: 14,
                fontWeight: "bold",
                boxShadow: "none",
              }}
            >
              저장
            </Button>
          </ButtonGroup>
          <Box
            style={{ height: 1, width: "100%", backgroundColor: "#d5d5d5" }}
            mt={2}
          />
          <ModalCancelButton
            fullWidth
            color="primary"
            sx={{ fontSize: 16, marginTop: 3 }}
            style={{ boxShadow: "none", fontWeight: "bold" }}
            variant="contained"
            onClick={props.isClose}
          >
            닫기
          </ModalCancelButton>
        </Box>
      </Fade>
    </Modal>
  );
}
