import React from "react";
import { Box, Typography, Tabs, Tab, AppBar } from "@material-ui/core";
import Header from "../components/Header";
import {
  theme,
  MainBox,
  baseStyles,
  ModalCancelButton,
  ModalConfirmButton,
} from "../styles/base";
import SetStoreTime01 from "../components/SetStoreTime01";
import SetStoreTime02 from "../components/SetStoreTime02";
import SetStoreTime03 from "../components/SetStoreTime03";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Box>
  );
}

function a11yProps(index: any) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
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

export default function SetStoreTime(props: TabPanelProps) {
  const base = baseStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box component="div" className={base.root}>
      <Header />
      <MainBox
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
        style={{ borderBottomLeftRadius: 10 }}
      >
        <AppBar
          position="static"
          style={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <Tabs
            variant="fullWidth"
            value={value}
            indicatorColor="primary"
            onChange={handleChange}
            aria-label="nav tabs example"
            className={base.noDrag}
          >
            <LinkTab label="????????????" href="/tab01" {...a11yProps(0)} />
            <LinkTab label="???????????????" href="/tab02" {...a11yProps(1)} />
            <LinkTab label="?????????" href="/tab03" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <SetStoreTime01 />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SetStoreTime02 />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <SetStoreTime03 />
        </TabPanel>
      </MainBox>
    </Box>
  );
}
