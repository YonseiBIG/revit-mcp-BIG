import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerFindElementsByLevelTool(server: McpServer) {
  server.tool(
    "find_elements_by_level",
    "Find elements associated with specific levels. Supports walls, beams, columns, and floors.",
    {
      levelNames: z
        .array(z.string())
        .describe("List of level names to search"),
      category: z
        .enum(["wall", "beam", "column", "floor"])
        .describe("Element category to filter"),
    },
    async (args, extra) => {
      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("find_elements_by_level", args);
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
              text: `find elements by level failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
