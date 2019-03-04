import React from "react";
import animation from "./animation";
import theme from "./nightOwl";
import Scroller from "./scroller";

const themeStylesByType = Object.create(null);
theme.styles.forEach(({ types, style }) => {
  types.forEach(type => {
    themeStylesByType[type] = Object.assign(
      themeStylesByType[type] || {},
      style
    );
  });
});

function getLineHeight(line, i, { styles }) {
  return styles[i].height != null ? styles[i].height : 15;
}

function getLine(line, i, { styles }) {
  const style = styles[i];
  return (
    <div
      style={Object.assign({ overflow: "hidden", height: "15px" }, style)}
      key={line.key}
    >
      {line.tokens.map((token, i) => {
        const style = themeStylesByType[token.type] || {};
        return (
          <span style={style} key={i}>
            {token.content}
          </span>
        );
      })}
    </div>
  );
}

function Slide({ lines, styles, changes }) {
  return (
    <pre
      style={{
        backgroundColor: theme.plain.backgroundColor,
        color: theme.plain.color,
        paddingTop: "100px",
        margin: 0,
        height: "100%",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <code
        style={{
          display: "block",
          width: "calc(100% - 20px)",
          maxWidth: "900px",
          margin: "auto",
          padding: "10px",
          height: "100%",
          boxSizing: "border-box"
        }}
      >
        <Scroller
          items={lines}
          getRow={getLine}
          getRowHeight={getLineHeight}
          data={{ styles }}
          snapAreas={changes}
        />
      </code>
    </pre>
  );
}

let lastLines = null;
let lastChanges = null;
function getChanges(lines) {
  if (lastLines === lines) {
    return lastChanges;
  }

  const changes = [];
  let currentChange = null;
  let i = 0;
  const isNewLine = i => !lines[i].left && lines[i].middle;
  while (i < lines.length) {
    if (isNewLine(i)) {
      if (!currentChange) {
        currentChange = { start: i };
      }
    } else {
      if (currentChange) {
        currentChange.end = i - 1;
        changes.push(currentChange);
        currentChange = null;
      }
    }
    i++;
  }

  lastLines = lines;
  console.log("changes", changes);
  return changes;
}

export default function SlideWrapper({ time, lines }) {
  const styles = animation((time + 1) / 2, lines);
  const changes = React.useMemo(() => getChanges(lines), [lines]);
  return <Slide lines={lines} styles={styles} changes={changes} />;
}
