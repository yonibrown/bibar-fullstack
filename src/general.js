export function writeToClipboard(htmlElm, type = "html") {
  if (type == "html") {
    const blob = new Blob([htmlElm], { type: "text/html" });
    const clipboardItem = new window.ClipboardItem({ "text/html": blob });
    navigator.clipboard.write([clipboardItem]);
    return;
    // var r = document.createRange();
    // r.selectNode(textRef.value);
    // window.getSelection().removeAllRanges();
    // window.getSelection().addRange(r);
    // document.execCommand("copy");
    // window.getSelection().removeAllRanges();
  }
  if (type == "png") {
    html2canvas(htmlElm).then((canvas) => {
      // var imgageData = canvas.targetURL("image/png");
      // var newData = imgageData.replace(
      //   /^data:image\/png/,
      //   "data:application/octet-stream"
      // );

      // download
      // var element = document.createElement("a");
      // element.setAttribute("href", newData);
      // element.setAttribute("download", "bar.png");
      // document.body.appendChild(element);
      // element.click();
      // document.body.removeChild(element);

      //copy to clipboard
      canvas.toBlob(function (blob) {
        navigator.clipboard
          .write([
            new ClipboardItem(
              Object.defineProperty({}, blob.type, {
                value: blob,
                enumerable: true,
              })
            ),
          ])
          .then(function () {
            // do something
          });
      });

      // barBodyRef.value.appendChild(canvas);
    });
    return;
  }
}

export class ordering {
  constructor(attr) {
    this._getSize = attr.getSize;
    this._getPosition = attr.getPosition;
    this._setTab = attr.setTab;
    this._commitChanges = attr.commitChanges;
    this._getItem = attr.getItem;
    this._setItemPosition = attr.setPosition;
  }

  move(attr) {
    // attr = {source: {tab: 0, idx: 0}, target: {tab: 0, idx: 1}, steps: 1}
    if (attr.steps) {
      attr.target = {
        idx: attr.source.idx + attr.steps,
      };
    }
    if (attr.target.tab == attr.source.tab) {
      // same tab
      const sourceItemPos = this._getPosition({tab:attr.source.tab, idx:attr.source.idx});
      const targetItemPos = this._getPosition({tab:attr.target.tab, idx:attr.target.idx});

      if (attr.target.idx == attr.source.idx) {
        // nothing to move
        return;
      }

      if (Math.abs(attr.target.idx - attr.source.idx) == 1) {
        // switch following items
        this.setPosition([
          { tab: attr.source.tab, idx: attr.source.idx, newPosition: targetItemPos },
          { tab: attr.target.tab, idx: attr.target.idx, newPosition: sourceItemPos },
        ]);
        this._commitChanges();
        return;
      }
    }

    this.setPosition([
      {
        tab: attr.source.tab,
        idx: attr.source.idx,
        newTab: attr.target.tab,
        newPosition: this.prevPos({tab:attr.target.tab, idx:attr.target.idx}),
      },
    ]);
    // this._setTab(attr.source.idx, attr.target.tab, attr.source.tab);
    this._commitChanges();
  }

  setPosition(parms) {
    let act = [];
    parms.forEach(({ idx, tab, newPosition, newTab }) => {
      act.push({ item: this._getItem({tab,idx}), newPosition, newTab });
    });
    act.forEach(({ item, newPosition, newTab }) => {
      this._setItemPosition(item, newPosition);
      if (typeof newTab !== 'undefined') {
        this._setTab(item, newTab);
      }
    });
  }

  prevPos(attr) {
    if (this._getSize({tab:attr.tab}) == 0) {
      return 1;
    }
    if (attr.idx == this._getSize({tab:attr.tab}) ) {
      return this.nextPos({tab:attr.tab, idx:attr.idx - 1});
    }
    const itemPos = this._getPosition({tab:attr.tab, idx:attr.idx});
    var prevItemPos = 0;
    if (attr.idx > 0) {
      prevItemPos = this._getPosition({tab:attr.tab, idx:attr.idx - 1});
    }
    return (itemPos - prevItemPos) / 2 + prevItemPos;
  }

  nextPos(attr) {
    const itemPos = this._getPosition({tab:attr.tab, idx:attr.idx});
    var nextItemPos = itemPos + 2;
    if (attr.idx < this._getSize({tab:attr.tab}) - 1) {
      nextItemPos = this._getPosition({tab:attr.tab, idx:attr.idx + 1});
    }
    return (nextItemPos - itemPos) / 2 + itemPos;
  }
}
