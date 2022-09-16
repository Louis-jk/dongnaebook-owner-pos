import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Api from '../Api';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import TextField from '@material-ui/core/TextField';
import DatePicker from '@material-ui/lab/DatePicker';
// import DatePicker, { registerLocale } from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import moment from 'moment';
import { baseStyles } from '../styles/base';
import clsx from 'clsx';

// registerLocale("ko", ko);
interface IYear {
  label: string;
  value: number;
}

export default function CalculateTab01() {

  const base = baseStyles();
  const [open, setOpen] = React.useState(false);
  const [year, setYear] = React.useState(new Date());
  const [month, setMonth] = React.useState<number | string>('');
  const [startDate, setStartDate] = React.useState(new Date());

  React.useEffect(() => {
    const getNow = new Date();
    const getNowMonth = getNow.getMonth() + 1;

    setMonth(getNowMonth);
  }, [])

  console.log("year", year);
  console.log("year format", moment(year).format('YYYY'));

  const monthArr = [
    {
      label: '1월',
      value: 1
    },
    {
      label: '2월',
      value: 2
    },
    {
      label: '3월',
      value: 3
    },
    {
      label: '4월',
      value: 4
    },
    {
      label: '5월',
      value: 5
    },
    {
      label: '6월',
      value: 6
    },
    {
      label: '7월',
      value: 7
    },
    {
      label: '8월',
      value: 8
    },
    {
      label: '9월',
      value: 9
    },
    {
      label: '10월',
      value: 10
    },
    {
      label: '11월',
      value: 11
    },
    {
      label: '12월',
      value: 12
    }
  ]

  const monthHandleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMonth(Number(event.target.value) || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const calculateData = [
    {
      date: '2021.07.09',
      isCalculated: false,
      price: '10795000'
    },
    {
      date: '2021.07.08',
      isCalculated: true,
      price: '5795000'
    },
    {
      date: '2021.07.07',
      isCalculated: true,
      price: '5795000'
    },
    {
      date: '2021.07.06',
      isCalculated: true,
      price: '5795000'
    },
    {
      date: '2021.07.05',
      isCalculated: true,
      price: '5795000'
    },
    {
      date: '2021.07.04',
      isCalculated: true,
      price: '5795000'
    }
  ]

  console.log("year", year);
  console.log("year type", typeof year);
  console.log("month", month);
  console.log("month type", typeof month);

  return (
    <section style={{ flex: 1 }}>
      <Box mt={2} mb={3}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            views={['year']}
            label="년 선택"
            value={year}
            onChange={(newValue: any) => {
              setYear(newValue);
            }}
            renderInput={(params) => <TextField {...params} helperText={null} />}
          />
        </LocalizationProvider>
        <TextField
          variant="outlined"
          select
          label="월 선택"
          InputLabelProps={{
            shrink: true
          }}
          SelectProps={{
            native: true
          }}
          style={{ minWidth: 200, marginLeft: 20, marginRight: 20 }}
        >
          {monthArr.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="primary"
          className={clsx(base.confirmBtn, base.ml20)}
          style={{ height: 55, minWidth: 100, fontSize: 16, fontWeight: 'bold', boxShadow: 'none' }}>
          조회
        </Button>
      </Box>
      <Box>
        {calculateData && calculateData.map((data, index) =>
          <ListItem key={index} button divider onClick={() => alert('클릭')}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ListItemText style={{ marginRight: 20 }}>
                {data.date}
              </ListItemText>
              <ListItemText>
                {data.isCalculated ? '정산완료' : '정산중'}
              </ListItemText>
            </div>
            <ListItemText style={{ textAlign: 'right' }}>
              {Api.comma(data.price)}원
            </ListItemText>
          </ListItem>
        )}
      </Box>
    </section>
  );
}
