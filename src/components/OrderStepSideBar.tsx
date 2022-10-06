import * as React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { theme, baseStyles } from "../styles/base";

interface OrderStepSideBar {
  route: string;
  pathName: string;
  data: any[];
}

export default function OrderStepSideBar(props: OrderStepSideBar) {
  const { route, pathName, data } = props;
  const base = baseStyles();
  const location = useLocation();
  const [currentPathName, setCurrentPathName] = React.useState("");

  console.log("location ? ", location);

  React.useEffect(() => {
    let slice = location.pathname.slice(1);
    setCurrentPathName(slice);
  }, [location]);

  return (
    <ListItem
      className={base.orderMenu}
      component={Link}
      to={`/${route}`}
      style={{
        color:
          currentPathName === pathName
            ? theme.palette.info.main
            : theme.palette.info.contrastText,
        backgroundColor: currentPathName === pathName ? "#fff" : "transparent",
      }}
    >
      <Typography
        component="label"
        variant="body1"
        style={{
          color:
            data.length > 0 && currentPathName !== pathName
              ? theme.palette.secondary.main
              : data.length > 0 && currentPathName === pathName
              ? "#1c1b30"
              : data.length === 0 && currentPathName === pathName
              ? theme.palette.info.main
              : "#fff",
        }}
      >
        {pathName === "order_new"
          ? "신규주문"
          : pathName === "order_check"
          ? "접수완료"
          : pathName === "order_delivery"
          ? "배달중"
          : pathName === "order_done"
          ? "처리완료"
          : null}
      </Typography>
      <Typography
        className="count"
        component="h3"
        variant="h4"
        style={{
          color:
            data.length > 0 && currentPathName !== pathName
              ? theme.palette.secondary.main
              : data.length > 0 && currentPathName === pathName
              ? theme.palette.info.main
              : data.length === 0 && currentPathName === pathName
              ? theme.palette.info.main
              : "#fff",
        }}
      >
        {data.length > 99 ? "99+" : data.length}
      </Typography>
    </ListItem>
  );
}
