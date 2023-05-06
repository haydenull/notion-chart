import { createSVGWindow } from "svgdom";
import { SVG, registerWindow } from "@svgdotjs/svg.js";
import dayjs from "dayjs";
const window = createSVGWindow();
const document = window.document;
registerWindow(window, document);

const RECT_WIDTH = 13;
const RECT_RADIUS = 4;
const RECT_GAP = 4;
const RECT_COLOR = "#34d399";

const DRAW_START_X = 20;
const DRAW_START_Y = 20;

const year = "2023";

export const genHeatMapSvg = (data: Record<string, number>) => {
  console.log("=== genHeatMapSvg ===");
  const draw = SVG();
  // draw
  //   .rect(RECT_WIDTH, RECT_WIDTH)
  //   .radius(RECT_RADIUS)
  //   .fill(RECT_COLOR)
  //   .move(DRAW_START_X, DRAW_START_Y);
  draw.rect().attr({
    x: DRAW_START_X,
    y: DRAW_START_Y,
    width: RECT_WIDTH,
    height: RECT_WIDTH,
    fill: RECT_COLOR,
    borderRadius: RECT_RADIUS,
    rx: RECT_RADIUS,
    ry: RECT_RADIUS,
  });
  // draw
  //   .rect(RECT_WIDTH, RECT_WIDTH)
  //   .radius(RECT_RADIUS)
  //   .fill(RECT_COLOR)
  //   .opacity(0.5)
  //   .move(DRAW_START_X + RECT_WIDTH + RECT_GAP, DRAW_START_Y);

  const firstDay = dayjs(year + "-01-01");
  const daysCount = firstDay.endOf("year").diff(firstDay, "day") + 1;

  Array.from({ length: daysCount }).forEach((_, index) => {
    const day = firstDay.add(index, "day");

    const weekYear = day.weekYear();
    const weekOfYear = `${weekYear}` === year ? day.week() : 53;
    const dayOfWeek = day.day();

    draw.rect().attr({
      x: DRAW_START_X + (RECT_WIDTH + RECT_GAP) * (weekOfYear - 1),
      y: DRAW_START_Y + (RECT_WIDTH + RECT_GAP) * dayOfWeek,
      width: RECT_WIDTH,
      height: RECT_WIDTH,
      fill: RECT_COLOR,
      rx: RECT_RADIUS,
      ry: RECT_RADIUS,
      opacity: Math.random(),
    });
  });

  return draw.svg();
};
