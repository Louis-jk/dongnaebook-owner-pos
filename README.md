# dongnaebook-owner-pos

dongnaebook-owner-pos (Desktop)

![image](https://user-images.githubusercontent.com/25785760/191441941-b61f5d59-fc45-48d1-9fef-8482cfeebbb5.png)
![image](https://user-images.githubusercontent.com/25785760/191442078-5be3f917-0858-4eb9-83eb-a4fc0111dd30.png)
![image](https://user-images.githubusercontent.com/25785760/191442259-72fc4708-932b-414a-b1a0-0077f9b6081f.png)
![image](https://user-images.githubusercontent.com/25785760/191442274-20b3e004-f019-4272-b483-e2963a55c7e3.png)

```javascript
// ▼ test
Printer.prototype.tableRow = function (data, options = {}) {
  // test
  options = options || { size: [], encoding: this.encoding };
  let [width = 1, height = 1] = options.size || [];
  /**
   * @param {number} baseWidth : Math.floor(this.width / width)
   *
   * default width = 1, or table options width
   */
  let baseWidth = Math.floor(this.width / width);
  /**
   * @param {number} cellWidth : Math.floor(baseWidth / data.length)
   *
   * (ex: baseWidth 300 -> table column 3 = cellWith 100)
   */
  let cellWidth = Math.floor(baseWidth / data.length); // ex baseWidth 300 -> table column 3 = cellWith 100
  /**
   * @param {number} leftoverSpace : baseWidth - cellWidth * data.length
   */
  let leftoverSpace = baseWidth - cellWidth * data.length;
  let lineStr = "";
  let secondLineEnabled = false;
  let secondLine = [];

  for (let i = 0; i < data.length; i++) {
    let obj = data[i];
    let align = (obj.align || "").toUpperCase();
    let tooLong = false;

    obj.text = obj.text.toString();
    let textLength = obj.text.length;

    if (obj.width) {
      cellWidth = baseWidth * obj.width;
    } else if (obj.cols) {
      cellWidth = obj.cols;
    }

    if (cellWidth < textLength) {
      tooLong = true;
      obj.originalText = obj.text;
      obj.text = obj.text.substring(0, cellWidth);
    }

    if (align === "CENTER") {
      let spaces = (cellWidth - textLength) / 2;
      for (let s = 0; s < spaces; s++) {
        lineStr += " ";
      }

      if (obj.text != "") {
        if (obj.style) {
          lineStr +=
            this._getStyle(obj.style) + obj.text + this._getStyle("NORMAL");
        } else {
          lineStr += obj.text;
        }
      }

      for (let s = 0; s < spaces - 1; s++) {
        lineStr += " ";
      }
    } else if (align === "RIGHT") {
      let spaces = cellWidth - textLength;
      if (leftoverSpace) {
        spaces += leftoverSpace;
        leftoverSpace = 0;
      }

      for (let s = 0; s < spaces; s++) {
        lineStr += " ";
      }

      if (obj.text !== "") {
        if (obj.style) {
          lineStr +=
            // this._getStyle(obj.style) +
            _.ESC + // <-- add
            _.TEXT_FORMAT.TXT_ALIGN_RT +
            obj.text +
            this._getStyle("NORMAL");
        } else {
          lineStr += obj.text;
        }
      }
    } else {
      if (obj.text !== "") {
        if (obj.style) {
          lineStr +=
            this._getStyle(obj.style) + obj.text + this._getStyle("NORMAL");
        } else {
          lineStr += obj.text;
        }
      }

      let spaces = Math.floor(cellWidth - textLength);
      if (leftoverSpace > 0) {
        spaces += leftoverSpace;
        leftoverSpace = 0;
      }

      for (let s = 0; s < spaces; s++) {
        lineStr += " ";
      }
    }

    if (tooLong) {
      secondLineEnabled = true;
      obj.text = obj.originalText.substring(cellWidth);
      secondLine.push(obj);
    } else {
      obj.text = "";
      secondLine.push(obj);
    }
  }

  // Set size to line
  if (width > 1 || height > 1) {
    lineStr =
      _.TEXT_FORMAT.TXT_CUSTOM_SIZE(width, height) +
      lineStr +
      _.TEXT_FORMAT.TXT_NORMAL;
  }

  // Write the line
  this.buffer.write(
    iconv.encode(lineStr + _.EOL, options.encoding || this.encoding)
  );

  if (secondLineEnabled) {
    return this.tableRow(secondLine, options);
  } else {
    return this;
  }
};
// ▲ test
```
