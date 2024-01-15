import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import { items } from "./data";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  WindowScroller,
} from "react-virtualized";
function App() {
  const [withScrollElement, setWithScrollElement] = useState(false);
  const mainRef = useRef(null);
  const infiniteLoaderRef = useRef(null);

  const displayCount = 20;
  const [displayedCount, setDisplayedCount] = useState(displayCount);

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 52,
  });

  const isRowLoaded = ({ index }) => {
    return index < displayedCount - 1;
  };

  const loadMoreRow = () => {
    return new Promise((resolve) => {
      setDisplayedCount(
        displayedCount + displayCount < items.length
          ? displayedCount + displayCount
          : items.length,
      );
      resolve();
    });
  };

  const rowRenderer = ({ key, index, style, parent, isScrolling }) => {
    const item = items[index];
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
        style={style}
      >
        <div key={key} style={style}>
          Item numéro : {item}
        </div>
      </CellMeasurer>
    );
  };

  return (
    <div className="App">
      <header>This is a sticky header</header>

      <main ref={mainRef}>
        <hr />
        Activate scrollElement="mainRef.current" :
        <input
          type="checkbox"
          checked={withScrollElement}
          onChange={() => setWithScrollElement(!withScrollElement)}
        />
        <hr />
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRow}
          rowCount={displayedCount}
          ref={infiniteLoaderRef}
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller
              scrollElement={withScrollElement ? mainRef.current : window}
            >
              {({ height, isScrolling, scrollTop }) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      ref={registerChild}
                      onRowsRendered={onRowsRendered}
                      width={width}
                      height={height}
                      autoHeight
                      overscanRowCount={20}
                      rowCount={displayedCount}
                      rowHeight={52}
                      rowRenderer={rowRenderer}
                      scrollTop={scrollTop}
                      isScrolling={isScrolling}
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      </main>
    </div>
  );
}

export default App;
