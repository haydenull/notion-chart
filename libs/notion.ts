import { Client } from "@notionhq/client";

const client = new Client({ auth: process.env.NOTION_KEY });

export const getNotionData = async (databaseId: string) => {
  const response = await client.databases.query({
    database_id: databaseId,
    // sorts: [{ property: "created_time", direction: "descending" }],
  });
};
