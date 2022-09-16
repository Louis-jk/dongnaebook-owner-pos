import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import 'moment/locale/ko';

// Material UI Components
import Chip from '@material-ui/core/Chip';
import Stack from '@material-ui/core/Stack';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Component
import { MONTHS, WEEKDAYS_SHORT, LABELS } from '../assets/datas/calendar_locale';
import Api from '../Api';
import { theme, baseStyles } from '../styles/base';



export default function StoreTimeTab03() {

  const base = baseStyles();
  const [isLoading, setLoading] = useState(false);
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const [selectedDays, setSelectDays] = useState<Date[]>([]); // 새로운 캘린더
  const [dayFormatArray, setDayFormatArray] = useState<string[]>([]); // 리스트용 - Chip


  // 휴무일 가져오기 
  const getStoreClosedHandler = () => {

    setLoading(true);

    const param = {
      encodeJson: true,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'list'
    };

    Api.send('store_hoilday', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {

        console.log("휴무일 server resultItem :::", resultItem);
        console.log("휴무일 server arrItems:::", arrItems);

        let dateArr: Date[] = []; // 마커용 임시 배열
        let dateChipArr: string[] = []; // Chip 리스트용 임시 배열

        arrItems?.map((date: any, index: number) => {
          
          // 마커용 데이터 담기
          let result = new Date(date.sh_date);
          dateArr.push(result);

          // Chip용 데이터 담기
          let result02 = date.sh_date;
          dateChipArr.push(result02);
        })
        setSelectDays(dateArr); // 마커용 배열 담기
        setDayFormatArray(dateChipArr); // Chip용 배열 담기
        setLoading(false);
      } else {
        console.log("휴무일을 가져오지 못했습니다");
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    getStoreClosedHandler();
  }, [mt_id, mt_jumju_code]);

  
  // 휴무일 업데이트 핸들러
  const selectHolidayHandler = (date: string) => {

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      sh_date: date,
      mode: 'update'
    };

    console.log("휴무일 업데이트 param >>>", param);

    Api.send('store_hoilday', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log('업데이트 완료 result', resultItem);
        console.log('업데이트 완료', arrItems);
      } else {
        console.log('업데이트 실패');
      }
    });
  };

  // 데이트 Select 핸들러
  const handleDayClick = (day: Date, { selected }: any) => {

    console.log('day', day);
    console.log('selected', selected);

    let formatDate = moment(day).format('YYYY-MM-DD');
    console.log('formatDate', formatDate);

    selectHolidayHandler(formatDate);

    const result = selectedDays.concat(); // 캘린더용
    if (selected) {
      const selectedIndex = result.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      result.splice(selectedIndex, 1);
    } else {
      result.push(day);
    }
    console.log("result", result);
    setSelectDays(result);

    // Chip 리스트용
    let formatArr: string[] = []; // Chip 리스트용 

    result.map((arrDate: Date, index) => {
      let momentFormat = moment(arrDate).format('YYYY-MM-DD');
      formatArr.push(momentFormat);
    })

    setDayFormatArray(formatArr);
    
  }

  // 리스트 - Chip 에서 날짜 삭제 핸들러
  const handleDelete = (date: string) => {
    console.log("handleDelete date?", date);
    console.log("handleDelete date type?", typeof date);

    // 휴무일 업데이트 호출
    selectHolidayHandler(date);

    // 선택된 Chip날짜를 Chip 배열에서 찾아서 제거
    let filtered = dayFormatArray.filter((day: string) => day !== date);
    setDayFormatArray(filtered);

    // Chip의 날짜 형식을 마커용(캘린더) 형식으로 변경 및 적용
    let dateArr: Date[] = []; // 마커용 임시 배열

    filtered.map((fDate: string, index: number) => {
      
      // 마커용 데이터 담기
      let result = new Date(fDate);
      dateArr.push(result);
    })
    setSelectDays(dateArr); // 마커용 배열 담기
  };


  return (
    <>
      {isLoading ?
        <Box className={base.loadingWrap} style={{padding:0}}>
          <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
        </Box>
        :
      <Grid container spacing={1}>
        <Grid item md={7} style={{padding:0}}>
          <DayPicker
            months={MONTHS.ko}
            weekdaysShort={WEEKDAYS_SHORT.ko}
            labels={LABELS.ko}
            selectedDays={selectedDays}
            onDayClick={handleDayClick}
          />
        </Grid>
        <Grid item md={5} style={{padding:0}}>
          <Stack direction="row" justifyContent='flex-end' flexWrap='wrap'>
            {dayFormatArray?.map((date, index) => (
              <Chip key={date + index} label={date} variant='filled' color='primary' sx={{ m: 1, borderRadius:1 }} onDelete={() => handleDelete(date)} />
            ))}
          </Stack>
        </Grid>
      </Grid>
      }
    </>
  )
}