import jwt_decode from 'jwt-decode';
import Axios from 'axios';
// import ImageEditor from "@react-native-community/image-editor";
// var RNFS = require('react-native-fs');

//var jwt = require('jwt-simple');
//var payload = { foo: 'bar' };
//var secret = 'xxx';
//var token = jwt.encode(payload, secret);

/*
const sign = require('jwt-encode');
const secret = 'secret';
const data = {
  sub: '1234567890',
  name: 'John Doe',
  iat: 1516239022
};
const jwt = sign(data, secret);
console.log(jwt);
*/

class Api {
  constructor() {
    //super(props);

    this.state = {
      isLoading: false,
      SERVER_NAME: 'ohjoo_server',
      SECRETKEY: '1111882EAD94E9C493CEF089E1B023A2122BA778',
      url: 'https://dmonster1452.cafe24.com',
      path: '',
      option: {
        method: 'POST',
        headers: {
          //Accept: 'application/json',
          'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
        body: null,
      },
      dataSource: {},
    };
  }

  //formdata 로 변경
  makeFormData(method = '', datas) {
    let formdata = new FormData();
    formdata.append('method', method);
    formdata.append('secretKey', this.state.SECRETKEY);
    formdata.append('jwt_data', datas);

    this.state.path = '/api/proc_' + method + '.php';
    this.state.option.body = formdata;
  }

  //기본
  send(method, datas, callback) {
    const jwt = require('jwt-encode');
    const jwt_secret = this.state.SECRETKEY;
    const jwt_data = jwt(datas, jwt_secret);

    this.makeFormData(method, jwt_data);

    this.state.isLoading = true;

    return Axios.post(
      this.state.url + this.state.path,
      this.state.option.body,
      this.state.option.headers
    )
      .then((response) => {
        // console.log("Axios response :: ", response);
        const decoded_jwt = jwt_decode(response.data.jwt, jwt_secret);
        //console.warn(decoded_jwt);
        /*
                let resultItem = response.data.resultItem.result;
                let message = response.data.resultItem.message;
                let arrItems = response.data.arrItems;
                */
        let resultItem = decoded_jwt.resultItem.result;
        let message = decoded_jwt.resultItem.message;
        let total_cnt = decoded_jwt.resultItem.total_cnt;
        let sql = decoded_jwt.resultItem.sql;
        let arrItems = decoded_jwt.arrItems;

        let returnJson = {
          resultItem: {
            result: resultItem === 'false' ? 'N' : 'Y',
            total_cnt: total_cnt,
            message: message,
            sql: sql,
          },
          arrItems: arrItems,
        };
        this.state.isLoading = false;
        // this.state.dataSource = arrItems;
        //각 메소드별로 값을 저장해둠.

        if (resultItem === 'N' && message) {
          //console.log(method, message);
          if (!(method === 'proc_check_reserve')) {
            // cusToast(message);
            console.log(message);
          }
        }

        if (typeof callback == 'function') {
          callback(returnJson);
        } else {
          return returnJson;
        }
      })
      .catch(function (error) {
        console.log(
          'Axios catch!!!>>',
          'method ::',
          method,
          ', error ::',
          error
        );
      });
  }

  //formdata 로 변경 jwt없이
  makeFormData2(method = '', datas) {
    let formdata = new FormData();
    formdata.append('method', method);
    formdata.append('secretKey', '1111882EAD94E9C493CEF089E1B023A2122BA778');
    for (let [key, value] of Object.entries(datas)) {
      formdata.append(key, value);
      // console.log('form key', key);
      // console.log('form value', value);
    }

    this.state.path = '/api/proc_' + method + '.php';
    this.state.option.body = formdata;
  }

  //기본02
  send2(method, datas, callback) {
    this.makeFormData2(method, datas);

    // console.log('api method', method);
    // console.log('api datas', datas);

    this.state.isLoading = true;

    // console.log(
    //   'this.state.url + this.state.path,',
    //   this.state.url + this.state.path
    // );
    // console.log('  this.state.option.body', this.state.option.body);
    // console.log('this.state.option.headers', this.state.option.headers);

    return Axios.post(
      this.state.url + this.state.path,
      this.state.option.body,
      this.state.option.headers
    )
      .then((response) => {
        let resultItem = response.data.resultItem.result;
        let message = response.data.resultItem.message;
        let sql = response.data.resultItem.sql;
        let arrItems = response.data.arrItems;

        console.log('api resultItem', resultItem);
        console.log('api message', message);
        console.log('api sql', sql);
        console.log('api arrItems', arrItems);

        let returnJson = {
          resultItem: {
            result: resultItem === 'false' ? 'N' : 'Y',
            message: message,
            sql: sql,
          },
          arrItems: arrItems,
        };
        this.state.isLoading = false;
        // this.state.dataSource = arrItems;
        //각 메소드별로 값을 저장해둠.

        if (resultItem === 'N' && message) {
          //console.log(method, message);
          if (!(method === 'proc_check_reserve')) {
            // cusToast(message);
            console.log(message);
          }
        }

        if (typeof callback == 'function') {
          callback(returnJson);
        } else {
          return returnJson;
        }
      })
      .catch(function (error) {
        console.log('Axios catch!!!>>', method, error);
        console.log('Axios catch!!! error >>', error);
        console.log('Axios catch!!! method >>', method);
      });
  }

  //formdata 로 변경
  makeFormData3(method = '', datas, filedatas) {
    console.log(datas);
    let formdata = new FormData();
    formdata.append('method', method);
    formdata.append('secretKey', '1111882EAD94E9C493CEF089E1B023A2122BA778');
    formdata.append('jwt_data', datas);

    for (let [key, value] of Object.entries(filedatas)) {
      formdata.append(key, value);
    }

    this.state.path = '/api/proc_' + method + '.php';
    this.state.option.body = formdata;

    console.log('formdata3', formdata);
  }

  // 기본03
  send3(method, datas, filedatas, callback) {
    //console.log(datas);
    const jwt = require('jwt-encode');
    const jwt_secret = this.state.SECRETKEY;
    const jwt_data = jwt(datas, jwt_secret);
    //console.log("jwtData : " + jwt_data);

    console.log('send3 method', method);
    console.log('send3 datas', datas);
    console.log('send3 filedatas', filedatas);

    this.makeFormData3(method, jwt_data, filedatas);

    this.state.isLoading = true;

    console.log(this.state.url + this.state.path);
    return Axios.post(
      this.state.url + this.state.path,
      this.state.option.body,
      this.state.option.headers
    )
      .then((response) => {
        //console.log(response);
        const decoded_jwt = jwt_decode(response.data.jwt, jwt_secret);

        let resultItem = decoded_jwt.resultItem.result;
        let message = decoded_jwt.resultItem.message;
        let sql = decoded_jwt.resultItem.sql;
        let arrItems = decoded_jwt.arrItems;

        let returnJson = {
          resultItem: {
            result: resultItem === 'false' ? 'N' : 'Y',
            message: message,
            sql: sql,
          },
          arrItems: arrItems,
        };
        this.state.isLoading = false;
        // this.state.dataSource = arrItems;
        //각 메소드별로 값을 저장해둠.

        //console.log(resultItem);

        if (resultItem === 'N' && message) {
          //console.log(method, message);
          if (!(method === 'proc_check_reserve')) {
            console.log(message);
            // cusToast(message);
          }
        }

        if (typeof callback == 'function') {
          callback(returnJson);
        } else {
          return returnJson;
        }
      })
      .catch(function (error) {
        console.log('Axios catch!!!>>', method, error);
      });
  }

  comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }
  //콤마풀기
  uncomma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
  }
  //--------------------------------------------------------------------------------------------------
  // 전화번호 포맷
  phoneFomatter(num, type) {
    let formatNum = '';
    let stringNum = String(num);

    if (stringNum.length === 11) {
      if (type === 0) {
        formatNum = stringNum.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
      } else {
        formatNum = stringNum.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      }
    } else if (stringNum.length === 8) {
      formatNum = stringNum.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else {
      if (stringNum.indexOf('02') === 0) {
        if (type === 0) {
          formatNum = stringNum.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
        } else {
          formatNum = stringNum.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
        }
      } else {
        if (type === 0) {
          formatNum = stringNum.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
        } else {
          formatNum = stringNum.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
      }
    }
    return formatNum;
  }

  // imgResize(imgWidth, imgHeight, maxWidth) {
  //     let width = 0, height = 0;
  //     if (imgWidth > maxWidth) {
  //         width = maxWidth;
  //         height = imgHeight * (maxWidth / imgWidth);
  //     } else {
  //         width = imgWidth;
  //         height = imgHeight;
  //     }
  //     width = parseInt(width);
  //     height = parseInt(height);

  //     return width + ',' + height;
  // }
  //--------------------------------------------------------------------------------------------------
  // imgCrop(items){
  //   let newArray = items;
  //   let newArrayCrop = [];
  //   var maxWidth = 1200;

  //   items.map((item, i) => {
  //     Image.getSize(item, (width, height) => {

  //       let cropData = {
  //         offset: {x: 0, y: 0},
  //         size: {width: width, height: height},
  //         // displaySize: {width: maxWidth, height: maxWidth},
  //         resizeMode: 'cover'
  //       };

  //       if (width > maxWidth) {
  //         cropData.size.width = maxWidth;
  //         cropData.size.height = parseInt((maxWidth*height)/width);

  //         ImageEditor.cropImage(item, cropData).then(url => {
  //           console.log("Cropped image uri", url);
  //           newArray[i] = url;
  //           newArrayCrop.push(url);
  //         });

  //       } else {
  //         cropData.size.width = width;
  //         cropData.size.height = height;
  //       }
  //       console.log(cropData);
  //     });
  //   });

  //   return [newArray, newArrayCrop];
  // }
  //--------------------------------------------------------------------------------------------------
  // imgRemove(item) {
  //     if (item.indexOf('/cache/') !== -1) {

  //         RNFS.exists(item)
  //             .then((result) => {
  //                 // console.log("file exists: ", result);
  //                 if (result) {
  //                     return RNFS.unlink(item)
  //                         .then(() => {
  //                             console.log('FILE DELETED');
  //                         })
  //                         // `unlink` will throw an error, if the item to unlink does not exist
  //                         .catch((err) => {
  //                             console.log('RNFS', err.message);
  //                         });
  //                 }
  //             })
  //             .catch((err) => {
  //                 console.log('RNFS', err.message);
  //             });
  //     }
  // }
  //--------------------------------------------------------------------------------------------------
  // dialCall = (number) => {
  //     let phoneNumber = '';

  //     if (Platform.OS === 'ios') { phoneNumber = `telprompt:${number}`; }
  //     else { phoneNumber = `tel:${number}`; }
  //     Linking.openURL(phoneNumber);
  // };
  //--------------------------------------------------------------------------------------------------
  // arrSearch = (nameKey, myArray) => {
  //     for (var i = 0; i < myArray.length; i++) {
  //         if (myArray[i].name === nameKey) {
  //             return myArray[i];
  //         }
  //     }
  // }
  //--------------------------------------------------------------------------------------------------
}

export default Api = new Api();
