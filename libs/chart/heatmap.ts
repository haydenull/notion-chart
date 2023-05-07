import { createSVGWindow } from "svgdom";
import { SVG, registerWindow } from "@svgdotjs/svg.js";
import dayjs from "dayjs";
const window = createSVGWindow();
const document = window.document;
registerWindow(window, document);

enum LevelEnum {
  "level0",
  "level1",
  "level2",
  "level3",
  "level4",
}

const RECT_WIDTH = 13;
const RECT_RADIUS = 4;
const RECT_GAP = 4;
const RECT_BORDER_COLOR = "#0f172a";
const RECT_BORDER_WIDTH = 1.5;
const RECT_COLOR = {
  [LevelEnum.level0]: "#ebedf0",
  [LevelEnum.level1]: "#9be9a8",
  [LevelEnum.level2]: "#40c463",
  [LevelEnum.level3]: "#30a14e",
  [LevelEnum.level4]: "#216e39",
};

const DRAW_START_X = 20;
const DRAW_START_Y = 20;

export const genHeatMapSvg = (data: Record<string, number>, year: string) => {
  const draw = SVG();

  const firstDay = dayjs(year + "-01-01");
  const daysCount = firstDay.endOf("year").diff(firstDay, "day") + 1;

  const dataWithLevel = getDataWithLevel(data);

  Array.from({ length: daysCount }).forEach((_, index) => {
    const day = firstDay.add(index, "day");

    const weekYear = day.weekYear();
    const weekOfYear = `${weekYear}` === year ? day.week() : 53;
    const dayOfWeek = day.day();

    const isToday = dayjs().isSame(day, "day");
    if (isToday) {
      draw.rect().attr({
        x:
          DRAW_START_X +
          (RECT_WIDTH + RECT_GAP) * (weekOfYear - 1) -
          RECT_BORDER_WIDTH,
        y:
          DRAW_START_Y +
          (RECT_WIDTH + RECT_GAP) * dayOfWeek -
          RECT_BORDER_WIDTH,
        width: RECT_WIDTH + RECT_BORDER_WIDTH * 2,
        height: RECT_WIDTH + RECT_BORDER_WIDTH * 2,
        rx: RECT_RADIUS + RECT_BORDER_WIDTH,
        ry: RECT_RADIUS + RECT_BORDER_WIDTH,
        fill: RECT_BORDER_COLOR,
      });
    }

    const value = dataWithLevel[`${day.format("YYYYMMDD")}`];
    const valueLevel = value?.level ?? LevelEnum.level0;
    draw.rect().attr({
      x: DRAW_START_X + (RECT_WIDTH + RECT_GAP) * (weekOfYear - 1),
      y: DRAW_START_Y + (RECT_WIDTH + RECT_GAP) * dayOfWeek,
      width: RECT_WIDTH,
      height: RECT_WIDTH,
      rx: RECT_RADIUS,
      ry: RECT_RADIUS,
      fill: RECT_COLOR[valueLevel],
    });
  });

  return draw.svg();
};

function getDataWithLevel(
  data: Record<string, number>
): Record<string, { value: number; level: LevelEnum }> {
  const numbers = Object.values(data);

  const quartile1 = percentile(numbers, 25);
  const quartile2 = percentile(numbers, 50);
  const quartile3 = percentile(numbers, 75);

  const getLevel = (num?: number) => {
    if (num === 0 || typeof num !== "number") {
      return LevelEnum.level0;
    } else if (num <= quartile1) {
      return LevelEnum.level1;
    } else if (num <= quartile2) {
      return LevelEnum.level2;
    } else if (num <= quartile3) {
      return LevelEnum.level3;
    } else {
      return LevelEnum.level4;
    }
  };
  const dataWithLevel = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      { value, level: getLevel(value) },
    ])
  );

  return dataWithLevel;
}

function percentile(numbers: number[], percentile: number): number {
  const sortedNumbers = numbers.slice().sort((a, b) => a - b);
  const index = Math.floor((percentile / 100) * (sortedNumbers.length - 1));
  const value = sortedNumbers[index];
  return value;
}
