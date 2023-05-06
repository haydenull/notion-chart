import { genHeatMapSvg } from "@/libs/chart/heatmap";
import { getNotionData } from "@/libs/notion";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";

dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<circle cx="50" cy="50" r="50" />
</svg>
`;

type IOptions = {
  date: string;
  value: string;
};
export async function GET(
  req: Request,
  { params }: { params: { databaseId: string; chartType: string } }
) {
  const { databaseId, chartType } = params;

  const { searchParams } = new URL(req.url);
  const dateKey = searchParams.get("date");
  const valueKey = searchParams.get("value");
  if (!dateKey || !valueKey) {
    return NextResponse.json({ code: 0, message: "invalid params" });
  }

  // const data = await getNotionData(databaseId);

  const svgString = genHeatMapSvg({});
  return new Response(svgString, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}
