import React from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';

import Check from '../screens/Check'; // 로그인전 체크
import Login from '../screens/Login'; // 로그인
import Main from '../screens/Main'; // 메인
import OrderNew from '../screens/OrderNew'; // 신규주문
import OrderCheck from '../screens/OrderCheck'; // 주문 접수완료
import OrderDelivery from '../screens/OrderDelivery'; // 주문 배달중
import OrderDone from '../screens/OrderDone'; // 주문 배달완료
import OrderDetail from '../screens/OrderDetail'; // 주문 상세
import SetStoreTime from '../screens/SetStoreTime'; // 영업일 및 휴무일
import Caculate from '../screens/Caculate'; // 정산내역
import MenuList from '../screens/MenuList'; // 메뉴 리스트
import MenuEdit from '../screens/MenuEdit'; // 메뉴 수정
import MenuAdd from '../screens/MenuAdd'; // 메뉴 추가
import Category from '../screens/Category'; // 카테고리
import Reviews from '../screens/Reviews'; // 리뷰
import StoreInfo from '../screens/StoreInfo'; // 매장소개
import StoreSetting from '../screens/StoreSetting'; // 매장설정
import Coupons from '../screens/Coupons'; // 쿠폰
import CouponAdd from '../screens/CouponAdd'; // 쿠폰 등록
import CouponEdit from '../screens/CouponEdit'; // 쿠폰 수정
import Tips from '../screens/Tips'; // 배달팁


export default function Routes() {
  return (
    <HashRouter>
      <Switch>
        <Route path='/' component={Check} exact />
        <Route path='/login' component={Login} />
        <Route path='/main' component={Main} />
        <Route path='/order_new' component={OrderNew} />
        <Route path='/order_check' component={OrderCheck} />
        <Route path='/order_delivery' component={OrderDelivery} />
        <Route path='/order_done' component={OrderDone} />
        <Route path='/orderdetail/:id' component={OrderDetail} />
        <Route path='/set_storetime' component={SetStoreTime} />
        <Route path='/caculate' component={Caculate} />
        <Route path='/menu/:categoryId' component={MenuList} />
        <Route path='/menu_edit/:id' component={MenuEdit} />
        <Route path='/menu_add' component={MenuAdd} />
        <Route path='/category' component={Category} />
        <Route path='/store_info' component={StoreInfo} />
        <Route path='/store_setting' component={StoreSetting} />
        <Route path='/reviews' component={Reviews} />
        <Route path='/coupons' component={Coupons} />
        <Route path='/coupon_add' component={CouponAdd} />
        <Route path='/coupon_edit/:id' component={CouponEdit} />
        <Route path='/tips' component={Tips} />
        <Route render={({ location }) => (
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ color: 'red' }}>존재하지 않는 페이지입니다.</h2>
            <p>{location.pathname}</p>
          </div>
        )}
        />
      </Switch>
    </HashRouter>
  )
}