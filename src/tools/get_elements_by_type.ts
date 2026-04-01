import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerGetElementsByTypeTool(server: McpServer) {
  server.tool(
    "get_elements_by_type",
    "Get all element instances that use a specific element type name within a category.",
    {
      typeName: z
        .string()
        .describe("Name of the element type to search for"),
      category: z
        .string()
        .describe("Revit category name (e.g., 'OST_Walls', 'OST_Doors', 'OST_Floors')"),
    },
    async (args, extra) => {
      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("get_elements_by_type", args);
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `get elements by type failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
