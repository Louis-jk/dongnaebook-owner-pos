import React from 'react';
import { Box, Typography, Tabs, Tab, AppBar, Divider } from '@material-ui/core';
import Header from '../components/Header';
import Calculate01 from '../components/Calculate01';
import Calculate02 from '../components/Calculate02';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

interface LinkTabProps {
  label?: string;
  href?: string;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

// const useStyles = makeStyles((theme: Theme) => ({
//   root: {
//     display: 'flex',
//   },
//   content: {
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     marginTop: 60,
//     backgroundColor: theme.palette.background.paper,

//     '& a': {
//       textDecoration: 'none'
//     }

//   },
//   appBar: {
//     backgroundColor: theme.palette.background.paper,
//     color: theme.palette.text.secondary,
//     fontSize: 15,
//     boxShadow: 'none',
//   }
// }));

export default function Calculate(props: any) {

  const base = baseStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box component="div" className={base.root}>
      <Header type="calculate" />
      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
        <AppBar position="static" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <div>
            <h3 style={{ color: '#222' }}>7월 정산 금액</h3>
            <p style={{ fontSize: 24, color: '#222' }}>5,795,000원</p>
          </div>
          <Divider style={{ background: theme.palette.secondary.main, height: 2, marginTop: 10, marginBottom: 10 }} />
          <Tabs
            variant="fullWidth"
            value={value}
            className={base.noDrag}
            indicatorColor="primary"
            onChange={handleChange}
            aria-label="nav tabs example"
          >
            <LinkTab label="월별조회" href="/drafts" {...a11yProps(0)} />
            <LinkTab label="기간조회" href="/trash" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Calculate01 />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Calculate02 />
        </TabPanel>
      </MainBox>
    </Box>
  );
}
