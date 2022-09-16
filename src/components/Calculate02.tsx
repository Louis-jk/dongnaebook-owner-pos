import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
// import { ko } from "date-fns/esm/locale";
import moment from 'moment';
import 'moment/locale/ko';
import { ko } from 'date-fns/locale';

// Material UI Components
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DateRangePicker, { DateRange } from '@material-ui/lab/DateRangePicker';
import TextField from '@material-ui/core/TextField';

// Local Component
import Api from '../Api';
import { baseStyles } from '../styles/base';


export default function CalculateTab02() {

  const base = baseStyles();
  const [value, setValue] = React.useState<DateRange<Date>>([null, null]);

  const calculateData = [
    {
      date: '2021.07.09',
      isCalculated: false,
      price: '5795000'
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

  return (
    <section style={{ flex: 1 }}>
      <Box mt={2} mb={3} display='flex' justifyContent='flex-start' alignItems='center'>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
          <DateRangePicker
            okText='확인'
            cancelText='취소'
            clearText='클리어'
            startText='시작날짜'
            endText='종료날짜'
            calendars={2}
            value={value}
            inputFormat='yyyy.MM.dd'
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <>
                <TextField
                  {...startProps}
                  placeholder='시작날짜'
                  label='시작날짜'
                  type='date'
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <Box sx={{ mx: 2 }}> ~ </Box>
                <TextField
                  {...endProps}
                  placeholder='종료날짜'
                  label='종료날짜'
                  type='date'
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </>
            )}
          />
        </LocalizationProvider>

        <Button
          variant='contained'
          color='primary'
          className={clsx(base.confirmBtn, base.ml20)}
          style={{ height: 55, minWidth: 100, fontSize: 16, fontWeight: 'bold', marginLeft: 20, boxShadow: 'none' }}>
          조회
        </Button>
      </Box>
      <List component='nav' aria-label='secondary mailbox folders'>
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
      </List>
    </section>
  );
}
