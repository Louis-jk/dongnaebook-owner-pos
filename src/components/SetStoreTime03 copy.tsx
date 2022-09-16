import React, { useState } from 'react';
import moment from 'moment';
import { theme, baseStyles } from '../styles/base';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Typography, IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


export default function StoreTimeTab03() {

  const base = baseStyles();
  const [getMoment, setMoment] = useState(moment());
  const today = getMoment;
  const firstWeek = today.clone().startOf('month').week();
  const lastWeek = today.clone().endOf('month').week() === 1 ? 53 : today.clone().endOf('month').week();
  const arr = [1, 2, 3, 4, 5];

  const calendarArr = () => {

    let result: any[] = [];
    let week = firstWeek;
    for (week; week <= lastWeek; week++) {
      result = result.concat(
        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', padding: 20 }} key={week}>
          {
            // eslint-disable-next-line no-loop-func
            Array(7).fill(0).map((data, index) => {
              let days = today.clone().startOf('year').week(week).startOf('week').add(index, 'day');

              if (moment().format('YYYYMMDD') === days.format('YYYYMMDD')) {
                return (
                  <Box key={index} style={{ color: '#fff', borderRadius: 50, minWidth: 80, minHeight: 50, backgroundColor: theme.palette.primary.main }} >
                    <Typography style={{ textAlign: 'center', lineHeight: '50px' }}>{days.format('D')}</Typography>
                  </Box>
                );
              } else if (days.format('MM') !== today.format('MM')) {
                return (
                  <Box key={index} style={{ color: '#ccc', minWidth: 80, minHeight: 50 }} >
                    <Typography style={{ textAlign: 'center', lineHeight: '50px' }}>{days.format('D')}</Typography>
                  </Box>
                );
              } else {
                return (
                  <Box key={index} style={{ minWidth: 80, minHeight: 50 }} onClick={() => console.log("days ?? ", days.format('D'))}>
                    <Typography style={{ textAlign: 'center', lineHeight: '50px' }}>{days.format('D')}</Typography>
                  </Box>
                );
              }
            })
          }
        </Box>);
    }
    return result;
  }

  console.log("getMoment ??", moment(getMoment).format('YYYY-MM-DD'));

  return (
    <Box style={{ display: 'flex', flex: 1, flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>

      <Box className={base.flexRowBetweenCenter} style={{ width: '90%', padding: 20 }}>
        {/* <button onClick={() => { setMoment(getMoment.clone().subtract(1, 'month')) }}>이전달</button> */}
        <IconButton style={{ color: theme.palette.primary.main }} onClick={() => { setMoment(getMoment.clone().subtract(1, 'month')) }}>
          <ArrowBackIosIcon />
        </IconButton>
        <Typography>{today.format('YYYY 년 MM 월')}</Typography>
        <IconButton style={{ color: theme.palette.primary.main }} onClick={() => { setMoment(getMoment.clone().add(1, 'month')) }}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <Grid container spacing={3} style={{ margin: 10 }}>
        <Grid item xs={12}>

          {calendarArr()}

        </Grid>
      </Grid>
    </Box>
  )
}