import { GoogleGenerativeAI, SchemaType, Content } from '@google/generative-ai';

const apiKey = Bun.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
});
/*
{
    type: "object",
    properties: {
      response: {
        type: "string"
      },
      "change-events": {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: {
              type: "string"
            },
            description: {
              type: "string"
            },
            start_date: {
              type: "string"
            },
            end_date: {
              type: "string"
            },
            repeat: {
              type: "boolean"
            },
            "repeat-duration": {
              type: "string",
              enum: [
                "daily",
                "weekly",
                "monthly",
                "yearly"
              ]
            },
            action: {
              type: "string",
              enum: [
                "add",
                "change",
                "remove"
              ]
            },
            list_id: {
              type: "string"
            },
            event_id: {
              type: "string"
            }
          },
          required: [
            "title",
            "start_date",
            "end_date",
            "repeat",
            "action",
            "list_id",
            "event_id"
          ]
        }
      },
      "change-todo-lists": {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: {
              type: "string"
            },
            description: {
              type: "string"
            },
            action: {
              type: "string",
              enum: [
                "add",
                "change",
                "remove"
              ]
            },
            list_id: {
              type: "string"
            }
          },
          required: [
            "title",
            "action",
            "list_id"
          ]
        }
      }
    },
    required: [
      "response",
      "change-events",
      "change-todo-lists"
    ]
  }*/

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  responseSchema: {
    type: SchemaType.OBJECT,
    properties: {
      response: {
        type: SchemaType.STRING,
      },
      'change-events': {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: {
              type: SchemaType.STRING,
            },
            description: {
              type: SchemaType.STRING,
            },
            start_date: {
              type: SchemaType.STRING,
            },
            end_date: {
              type: SchemaType.STRING,
            },
            repeat: {
              type: SchemaType.BOOLEAN,
            },
            'repeat-duration': {
              type: SchemaType.STRING,
              enum: ['daily', 'weekly', 'monthly', 'yearly'],
            },
            action: {
              type: SchemaType.STRING,
              enum: ['add', 'change', 'remove', 'nochange'],
            },
            list_id: {
              type: SchemaType.STRING,
            },
            event_id: {
              type: SchemaType.STRING,
            },
          },
          required: [
            'title',
            'start_date',
            'end_date',
            'repeat',
            'action',
            'list_id',
            'event_id',
          ],
        },
      },
      'change-todo-lists': {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: {
              type: SchemaType.STRING,
            },
            description: {
              type: SchemaType.STRING,
            },
            action: {
              type: SchemaType.STRING,
              enum: ['add', 'change', 'remove', 'nochange'],
            },
            list_id: {
              type: SchemaType.STRING,
            },
          },
          required: ['title', 'action', 'list_id'],
        },
      },
    },
    required: ['response', 'change-events', 'change-todo-lists'],
  },
};

const defaultHistory: Content[] = [
  {
    role: 'user',
    parts: [{ text: 'Create a List Which contain taiwan holiday' }],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [\n    {\n      "action": "add",\n      "end_date": "2024-01-01",\n      "event_id": "taiwan-new-year-2024",\n      "list_id": "taiwan-holiday",\n      "repeat": false,\n      "start_date": "2024-01-01",\n      "title": "New Year\'s Day",\n       "description": "The first day of the year"\n    },\n     {\n      "action": "add",\n      "end_date": "2024-02-08",\n      "event_id": "taiwan-lunar-new-year-eve-2024",\n      "list_id": "taiwan-holiday",\n      "repeat": false,\n      "start_date": "2024-02-08",\n      "title": "Lunar New Year\'s Eve",\n       "description": "The eve of the Lunar New Year"\n    },\n    {\n      "action": "add",\n      "end_date": "2024-02-09",\n      "event_id": "taiwan-lunar-new-year-2024",\n      "list_id": "taiwan-holiday",\n      "repeat": false,\n       "start_date": "2024-02-09",\n      "title": "Lunar New Year",\n       "description": "The first day of the Lunar New Year"\n    },\n    {\n      "action": "add",\n      "end_date": "2024-02-28",\n      "event_id": "taiwan-peace-memorial-day-2024",\n      "list_id": "taiwan-holiday",\n      "repeat": false,\n      "start_date": "2024-02-28",\n      "title": "Peace Memorial Day",\n       "description": "Commemorating the February 28 Incident"\n    },\n     {\n      "action": "add",\n      "end_date": "2024-04-04",\n      "event_id": "taiwan-children-day-2024",\n      "list_id": "taiwan-holiday",\n      "repeat": false,\n      "start_date": "2024-04-04",\n      "title": "Children\'s Day",\n       "description": "A day to celebrate children"\n    },\n     {\n      "action": "add",\n      "end_date": "2024-04-04",\n      "event_id": "taiwan-tomb-sweeping-day-2024",\n      "list_id": "taiwan-holiday",\n      "repeat": false,\n       "start_date": "2024-04-04",\n      "title": "Tomb Sweeping Day",\n       "description": "A day for honoring ancestors"\n    },\n    {\n      "action": "add",\n      "end_date": "2024-05-01",\n      "event_id": "taiwan-labor-day-2024",\n      "list_id": "taiwan-holiday",\n      "repeat": false,\n      "start_date": "2024-05-01",\n      "title": "Labor Day",\n       "description": "A day to celebrate workers"\n    },\n      {\n      "action": "add",\n      "end_date": "2024-06-10",\n      "event_id": "taiwan-dragon-boat-festival-2024",\n      "list_id": "taiwan-holiday",\n      "repeat": false,\n      "start_date": "2024-06-10",\n      "title": "Dragon Boat Festival",\n       "description": "A traditional holiday with dragon boat races"\n    },\n    {\n      "action": "add",\n       "end_date": "2024-09-17",\n      "event_id": "taiwan-mid-autumn-festival-2024",\n      "list_id": "taiwan-holiday",\n       "repeat": false,\n      "start_date":"2024-09-17",\n      "title": "Mid-Autumn Festival",\n       "description": "A harvest festival"\n    },\n    {\n      "action": "add",\n       "end_date": "2024-10-10",\n      "event_id": "taiwan-national-day-2024",\n      "list_id": "taiwan-holiday",\n       "repeat": false,\n      "start_date": "2024-10-10",\n      "title": "National Day",\n      "description": "A day to commemorate the founding of the Republic of China"\n    }\n  ],\n  "change-todo-lists": [\n    {\n      "action": "add",\n      "list_id": "taiwan-holiday",\n      "title": "Taiwan Holiday",\n      "description": "List of Taiwan holiday"\n    }\n  ],\n  "response": "Create a list for you which contain holiday in taiwan in 2025"\n}```',
      },
    ],
  },
  {
    role: 'user',
    parts: [{ text: 'Create a List Which contain taiwan holiday in 2025' }],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [\n    {\n      "action": "add",\n      "end_date": "2025-01-01",\n      "event_id": "taiwan-new-year-2025",\n      "list_id": "taiwan-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-01-01",\n      "title": "New Year\'s Day",\n      "description": "The first day of the year"\n    },\n     {\n      "action": "add",\n      "end_date": "2025-01-28",\n      "event_id": "taiwan-lunar-new-year-eve-2025",\n      "list_id": "taiwan-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-01-28",\n       "title": "Lunar New Year\'s Eve",\n       "description": "The eve of the Lunar New Year"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-01-29",\n      "event_id": "taiwan-lunar-new-year-2025",\n      "list_id": "taiwan-holiday-2025",\n      "repeat": false,\n       "start_date": "2025-01-29",\n      "title": "Lunar New Year",\n      "description": "The first day of the Lunar New Year"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-02-28",\n      "event_id": "taiwan-peace-memorial-day-2025",\n      "list_id": "taiwan-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-02-28",\n      "title": "Peace Memorial Day",\n      "description": "Commemorating the February 28 Incident"\n    },\n     {\n      "action": "add",\n      "end_date": "2025-04-04",\n      "event_id": "taiwan-children-day-2025",\n      "list_id": "taiwan-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-04-04",\n       "title": "Children\'s Day",\n       "description": "A day to celebrate children"\n    },\n     {\n      "action": "add",\n      "end_date": "2025-04-04",\n      "event_id": "taiwan-tomb-sweeping-day-2025",\n      "list_id": "taiwan-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-04-04",\n       "title": "Tomb Sweeping Day",\n      "description": "A day for honoring ancestors"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-05-01",\n      "event_id": "taiwan-labor-day-2025",\n      "list_id": "taiwan-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-05-01",\n       "title": "Labor Day",\n      "description": "A day to celebrate workers"\n    },\n      {\n      "action": "add",\n      "end_date": "2025-05-31",\n      "event_id": "taiwan-dragon-boat-festival-2025",\n      "list_id": "taiwan-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-05-31",\n      "title": "Dragon Boat Festival",\n      "description": "A traditional holiday with dragon boat races"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-10-06",\n      "event_id": "taiwan-mid-autumn-festival-2025",\n      "list_id": "taiwan-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-10-06",\n      "title": "Mid-Autumn Festival",\n       "description": "A harvest festival"\n    },\n    {\n      "action": "add",\n       "end_date": "2025-10-10",\n      "event_id": "taiwan-national-day-2025",\n      "list_id": "taiwan-holiday-2025",\n       "repeat": false,\n      "start_date": "2025-10-10",\n      "title": "National Day",\n      "description": "A day to commemorate the founding of the Republic of China"\n    }\n  ],\n  "change-todo-lists": [\n    {\n      "action": "add",\n      "list_id": "taiwan-holiday-2025",\n      "title": "Taiwan Holiday 2025",\n       "description": "List of Taiwan holiday in 2025"\n    }\n  ],\n  "response": "Create a list for you which contain holiday in taiwan in 2025"\n}\n```',
      },
    ],
  },
  {
    role: 'user',
    parts: [{ text: '請幫我建立一個新的 2025年的台灣的重要節日 list' }],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [\n    {\n      "action": "add",\n      "end_date": "2025-01-01",\n      "event_id": "taiwan-new-year-2025",\n      "list_id": "taiwan-major-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-01-01",\n      "title": "元旦",\n      "description": "新的一年的第一天"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-01-28",\n      "event_id": "taiwan-lunar-new-year-eve-2025",\n      "list_id": "taiwan-major-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-01-28",\n      "title": "除夕",\n       "description": "農曆新年前一天"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-02-12",\n      "event_id": "taiwan-lunar-new-year-2025",\n      "list_id": "taiwan-major-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-01-29",\n      "title": "農曆新年",\n      "description": "農曆新年直到元宵"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-02-28",\n      "event_id": "taiwan-peace-memorial-day-2025",\n      "list_id": "taiwan-major-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-02-28",\n      "title": "和平紀念日",\n      "description": "紀念二二八事件"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-04-04",\n      "event_id": "taiwan-children-day-2025",\n      "list_id": "taiwan-major-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-04-04",\n      "title": "兒童節",\n      "description": "慶祝兒童的節日"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-04-04",\n      "event_id": "taiwan-tomb-sweeping-day-2025",\n      "list_id": "taiwan-major-holiday-2025",\n       "repeat": false,\n      "start_date": "2025-04-04",\n      "title": "清明節",\n      "description": "懷念祖先"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-05-01",\n      "event_id": "taiwan-labor-day-2025",\n      "list_id": "taiwan-major-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-05-01",\n      "title": "勞動節",\n       "description": "辛苦的勞工放假一天!"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-05-31",\n      "event_id": "taiwan-dragon-boat-festival-2025",\n      "list_id": "taiwan-major-holiday-2025",\n      "repeat": false,\n       "start_date": "2025-05-31",\n      "title": "端午節",\n       "description": "粽子節"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-10-06",\n      "event_id": "taiwan-mid-autumn-festival-2025",\n      "list_id": "taiwan-major-holiday-2025",\n      "repeat": false,\n       "start_date": "2025-10-06",\n      "title": "中秋節",\n       "description": "還記得嫦娥的故事嗎"\n    },\n    {\n      "action": "add",\n      "end_date": "2025-10-10",\n      "event_id": "taiwan-national-day-2025",\n      "list_id": "taiwan-major-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-10-10",\n      "title": "國慶日",\n       "description": "紀念中華民國成立的節日"\n    }\n  ],\n  "change-todo-lists": [\n    {\n      "action": "add",\n      "list_id": "taiwan-major-holiday-2025",\n      "title": "2025 台灣主要節日",\n      "description": "2025 年台灣主要節日列表"\n    }\n  ],\n  "response": "已建立 2025 年台灣主要節日列表"\n}\n```',
      },
    ],
  },
  {
    role: 'user',
    parts: [
      { text: '幫我在台灣主要節日的 list 裡面加上 聖誕節 和 行憲紀念日' },
    ],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [\n    {\n      "action": "add",\n      "end_date": "2025-12-25",\n      "event_id": "taiwan-christmas-2025",\n      "list_id": "taiwan-major-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-12-25",\n      "title": "聖誕節",\n      "description": "慶祝耶穌誕生的節日"\n    },\n     {\n      "action": "add",\n      "end_date": "2025-12-25",\n      "event_id": "taiwan-constitution-day-2025",\n      "list_id": "taiwan-major-holiday-2025",\n      "repeat": false,\n      "start_date":"2025-12-25",\n      "title": "行憲紀念日",\n      "description": "紀念中華民國憲法實施的節日"\n    }\n  ],\n  "change-todo-lists": [],\n  "response": "已將聖誕節和行憲紀念日加入台灣主要節日列表"\n}\n```',
      },
    ],
  },
  {
    role: 'user',
    parts: [{ text: '幫我移除掉 兒童節' }],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [\n    {\n      "action": "remove",\n      "end_date": "2025-04-04",\n      "event_id": "taiwan-children-day-2025",\n      "list_id": "taiwan-major-holiday-2025",\n      "repeat": false,\n      "start_date": "2025-04-04",\n      "title": "兒童節",\n      "description": "慶祝兒童的節日"\n    }\n  ],\n  "change-todo-lists": [],\n  "response": "已將兒童節從台灣主要節日列表中移除"\n}\n```',
      },
    ],
  },
  {
    role: 'user',
    parts: [
      {
        text: '幫我建立一個 重要事項的 list 並且在裡面加上一個 todo 提醒我要看 2025 的蘋果發表會 以及 在 2026 年 1 月換電腦',
      },
    ],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [\n    {\n      "action": "add",\n      "end_date": "2025-12-31",\n      "event_id": "apple-event-2025",\n      "list_id": "important-todos",\n      "repeat": false,\n      "start_date": "2025-01-01",\n      "title": "看 2025 蘋果發表會",\n      "description": "提醒查看蘋果公司 2025 年的發表會"\n    },\n      {\n      "action": "add",\n      "end_date": "2026-01-31",\n      "event_id": "replace-computer-2026",\n      "list_id": "important-todos",\n      "repeat": false,\n      "start_date": "2026-01-01",\n      "title": "2026 年 1 月換電腦",\n      "description": "提醒在 2026 年 1 月更換電腦"\n    }\n  ],\n  "change-todo-lists": [\n    {\n      "action": "add",\n      "list_id": "important-todos",\n      "title": "重要事項",\n      "description": "包含重要事項的列表"\n    }\n  ],\n  "response": "已建立重要事項列表，並新增提醒事項"\n}\n```',
      },
    ],
  },
  {
    role: 'user',
    parts: [
      { text: '幫我建立一個 7月到7月中要把 打程式專案製作完成的代辦事項' },
    ],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [\n    {\n      "action": "add",\n      "end_date": "2024-07-15",\n      "event_id": "program-project-finish-202407",\n      "list_id": "program-project-todos",\n      "repeat": false,\n      "start_date": "2024-07-01",\n      "title": "完成程式專案",\n      "description": "在 7 月 1 日至 7 月 15 日間完成程式專案"\n    }\n  ],\n  "change-todo-lists": [\n    {\n      "action": "add",\n      "list_id": "program-project-todos",\n      "title": "程式專案代辦事項",\n      "description": "關於程式專案的代辦事項"\n    }\n  ],\n  "response": "已建立程式專案代辦事項列表，並加入完成程式專案的提醒"\n}\n```',
      },
    ],
  },
  {
    role: 'user',
    parts: [{ text: '更正 應該是 1 月中旬到 2月' }],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [\n    {\n      "action": "remove",\n      "end_date": "2024-07-15",\n      "event_id": "program-project-finish-202407",\n      "list_id": "program-project-todos",\n      "repeat": false,\n      "start_date": "2024-07-01",\n      "title": "完成程式專案",\n      "description": "在 7 月 1 日至 7 月 15 日間完成程式專案"\n    },\n    {\n      "action": "add",\n      "end_date": "2024-02-28",\n      "event_id": "program-project-finish-202401-2",\n      "list_id": "program-project-todos",\n      "repeat": false,\n      "start_date": "2024-01-15",\n      "title": "完成程式專案",\n      "description": "在 1 月中旬至 2 月間完成程式專案"\n    }\n  ],\n  "change-todo-lists": [],\n  "response": "已更新程式專案代辦事項的起迄時間為 1 月中旬至 2 月"\n}\n```',
      },
    ],
  },
  {
    role: 'user',
    parts: [{ text: '幫我刪掉所有剛剛建立的 list' }],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [],\n  "change-todo-lists": [\n    {\n      "action": "remove",\n      "list_id": "taiwan-holiday",\n      "title": "Taiwan Holiday",\n      "description": "List of Taiwan holiday"\n    },\n    {\n      "action": "remove",\n      "list_id": "taiwan-holiday-2025",\n      "title": "Taiwan Holiday 2025",\n      "description": "List of Taiwan holiday in 2025"\n    },\n    {\n      "action": "remove",\n      "list_id": "taiwan-major-holiday-2025",\n      "title": "2025 台灣主要節日",\n      "description": "2025 年台灣主要節日列表"\n    },\n      {\n      "action": "remove",\n      "list_id": "important-todos",\n      "title": "重要事項",\n      "description": "包含重要事項的列表"\n     },\n    {\n      "action": "remove",\n      "list_id": "program-project-todos",\n      "title": "程式專案代辦事項",\n      "description": "關於程式專案的代辦事項"\n    }\n  ],\n  "response": "已刪除所有建立的列表"\n}\n```',
      },
    ],
  },
  {
    role: 'user',
    parts: [
      {
        text: '我每天都有數學作業 每天 10頁 麻煩幫我建立到下一周的作業 (2025/1/6)',
      },
    ],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [\n    {\n      "action": "add",\n      "end_date": "2025-1-6",\n      "event_id": "math-homework-20241230",\n      "list_id": "math-homework",\n      "repeat": true,\n      "start_date": "2025-1-6",\n       "title": "數學作業",\n       "description": "每天寫10頁數學作業",\n       "repeat-duration": "daily"\n    },\n  ],\n  "response": "已建立數學作業列表，並加入每日作業提醒"\n}\n```',
      },
    ],
  },
  {
    role: 'user',
    parts: [{ text: '列出所有列表' }],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [],\n  "change-todo-lists": [],\n  "response": "There are no lists"\n}\n```',
      },
    ],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [],\n  "change-todo-lists": [],\n  "response": "There are no lists"\n}\n```',
      },
    ],
  },
  {
    role: 'user',
    parts: [{ text: '新增一個數學作業列表' }],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [],\n  "change-todo-lists": [\n    {\n      "action": "add",\n      "list_id": "math-homework-list",\n      "title": "數學作業列表",\n      "description": "數學作業相關的列表"\n    }\n  ],\n  "response": "已新增數學作業列表"\n}\n```',
      },
    ],
  },
  {
    role: 'user',
    parts: [{ text: '顯示所有 list' }],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [],\n  "change-todo-lists": [\n    {\n      "action": "nochange",\n      "list_id": "math-homework-list",\n      "title": "數學作業列表",\n      "description": "數學作業相關的列表"\n    }\n  ],\n  "response": "Here are all the lists"\n}\n```',
      },
    ],
  },
  {
    role: 'user',
    parts: [{ text: '刪除數學作業' }],
  },
  {
    role: 'model',
    parts: [
      {
        text: '```json\n{\n  "change-events": [],\n  "change-todo-lists": [\n    {\n      "action": "remove",\n      "list_id": "math-homework-list",\n      "title": "數學作業列表",\n      "description": "數學作業相關的列表"\n    }\n  ],\n  "response": "已刪除數學作業列表"\n}\n```',
      },
    ],
  },
];

export async function generateChange(
  input: string,
  data: {
    current: {
      todoLists: string;
      todos: string;
    };
    change: {
      todoLists: string;
      todos: string;
    };
  },
  history?: Content[],
) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: defaultHistory.concat(history || []),
    });

    const result = await chatSession.sendMessage(
      `現在時間 : ${new Date().toLocaleString()}\n代辦事項清單 : \n${
        data.current.todoLists
      }\n待辦事項 : \n${data.current.todos}\n當前代辦事項清單變更:${
        data.change.todoLists
      }\n當前代辦事項變更:${data.change.todos}\n輸入 : ${input}`,
    );
    const resultJSON = await JSON.parse(result.response.text());
    return resultJSON;
  } catch (e) {
    console.log(e);
    return {
      error: 'An error occured',
    };
  }
}
