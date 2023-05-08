# Notion-Chart

Transform Notion database into a chart image easily with Notion-Chart. Currently, it supports heatmap chart type, and more chart types will be added in the future. You can use Notion-Chart as a self-hosted solution.

## Deployment
### Prerequisites

1. Create your Notion integration and copy your integration secret. 
2. Invite your integration to your database. 

### Vercel deployed

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/import?repository-url=https%3A%2F%2Fgithub.com%2Fhaydenull%2Fnotion-chart&env=NOTION_KEY&project-name=notion-chart&repository-name=notion-chart)

1. Fork this repository. 
2. Click the "Vercel Deploy" button. 
3. Add an environment variable `NOTION_KEY` with the value of your integration secret. 

## Usage

Suppose your host URL is https://notion-chart.vercel.app

### Heatmap

![heatmap](./screenshot/heatmap.png)

URL: `https://notion-chart.vercel.app/api/your_notion_database_id/heatmap?date=DateKeyName&value=valueKeyName`

|parameter|required|description|
|---|---|---|
|date|Yes|Notion database dateKeyName|
|value|Yes|Notion database valueKeyName|
|year|No|Year (default is current year)|