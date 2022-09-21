import React, { useEffect, useState } from "react";
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
import toast, { Toaster } from 'react-hot-toast';

// Local Component
import { theme, baseStyles, ModalCancelButton } from "../styles/base";
import * as storeAction from "../redux/actions/storeAction";
import * as printerSettingAction from '../redux/actions/printerSettingAction';
import Api from "../Api";
import { ButtonGroup, Select } from "@material-ui/core";
import { Button, FormControl, InputLabel, MenuItem, SelectChangeEvent } from "@mui/material";
import appRuntime from "../appRuntime";

interface IProps {
  isOpen: boolean;
  isClose: () => void;
}

interface Object {
  [key: string]: string;
}

const BAUD_RATE = [110, 300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200];

export default function PosPrinterSettingModal(props: IProps) {
  const base = baseStyles();
  const dispatch = useDispatch();
  const { port, baudRate } = useSelector((state: any) => state.printerSetting);
  // const { allStore, closedStore } = useSelector((state: any) => state.store);

  const [getPortsList, setPortsList] = useState([]);

  const getSerialPorts = () => {
    appRuntime.send('requestPortsList', null);
  }

  appRuntime.on('responsePortList', (event: any, data: any) => {
    console.log('responsePortList data', data)
    setPortsList(data);
  })

  useEffect(() => {
    getSerialPorts();

    return () => getSerialPorts();
  }, []);


  const changePortHandler = (event: SelectChangeEvent) => {
    // setPort(event.target.value as string)
    let selectPort = event.target.value as string
    dispatch(printerSettingAction.updatePrinterPort(selectPort))
  }

  const changeBaudRateHandler = (event: SelectChangeEvent) => {
    // setBaudRate(event.target.value as string)
    let selectBaudRate = event.target.value as string
    dispatch(printerSettingAction.updatePrinterBaudRate(selectBaudRate))
  }

  const printTest = () => {
    console.log('print test!')
    console.log('select port ::', port);
    console.log('select baud rate ::', baudRate);
    let data = {
      port,
      baudRate
    }
    appRuntime.send('testPrint', data);
  }

  // 프린터 설정 리덕스 연동
  const setPrinterToRedux = () => {

    if(port !== '' && baudRate !== '') {
      let data = {
        port,
        baudRate
      }
  
      dispatch(printerSettingAction.updatePrinter(data))
      
      toast.success('저장하였습니다.', {
        duration: 4000,
        position: 'bottom-center',
      });
      
    } else {
      toast.error('Port와 BaudRate를 지정해주세요.', {
        duration: 4000,
        position: 'bottom-center'
      });
    }   
  }

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
          <Box
            style={{ height: 1, width: "100%", backgroundColor: "#d5d5d5" }}
            my={2}
          />

          <Box className={base.flexColumn}>
            <Box className={base.flexRowStartCenter}>
              <Typography
                style={{
                  minWidth: 75,
                  flex: 1,
                  textAlign: "left",
                  fontWeight: "bold",
                }}
                sx={{ mr: 2 }}
              >
                Port
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={port}
                  onChange={changePortHandler}
                >
                  {getPortsList?.map((port: any, index: number) => (
                    <MenuItem key={`port-${index}`} value={port.path}>{port.path}</MenuItem>  
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ m: 1 }} />
            <Box className={base.flexRowStartCenter}>
              <Typography
                style={{
                  minWidth: 75,
                  flex: 1,
                  textAlign: "left",
                  fontWeight: "bold",
                }}
                sx={{ mr: 2 }}
              >
                BaudRate
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={baudRate}
                  onChange={changeBaudRateHandler}
                >
                  {BAUD_RATE.map((rate, index) => (
                    <MenuItem key={index} value={rate}>{rate}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box mb={2} />
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
              onClick={printTest}
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
              onClick={setPrinterToRedux}
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