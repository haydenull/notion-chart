import { genHeatMapSvg } from "@/libs/chart/heatmap";
import notionClient from "@/libs/notion";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

export async function GET(
  req: Request,
  { params }: { params: { databaseId: string } }
) {
  const { databaseId } = params;

  const { searchParams } = new URL(req.url);
  const dateKey = searchParams.get("date");
  const valueKey = searchParams.get("value");
  const year = searchParams.get("year") ?? dayjs().format("YYYY");
  if (!dateKey || !valueKey) {
    return NextResponse.json({ code: 0, message: "invalid params" });
  }

  // https://developers.notion.com/reference/post-database-query
  const { results } = await notionClient.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: dateKey,
          date: {
            is_not_empty: true,
          },
        },
      ],
    },
  });
  const data = Object.fromEntries(
    (results as PageObjectResponse[])?.map((result) => {
      const properties = result.properties;
      // @ts-ignore properties[dateKey] is Notion Date type
      const date = properties[dateKey]?.date?.start;
      // @ts-ignore properties[valueKey] is Notion Number type
      const value = Number(properties[valueKey]?.number);
      return [dayjs(date).format("YYYYMMDD"), value];
    })
  );

  const svgString = genHeatMapSvg(data, year);
  return new Response(svgString, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}
