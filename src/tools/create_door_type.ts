import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerCreateDoorTypeTool(server: McpServer) {
  server.tool(
    "create_door_type",
    "Create a new door type by duplicating an existing family symbol and setting width/height. Units in mm.",
    {
      familyName: z
        .string()
        .describe("Door family name to create the type in"),
      width: z
        .number()
        .describe("Door width in mm"),
      height: z
        .number()
        .describe("Door height in mm"),
    },
    async (args, extra) => {
      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("create_door_type", args);
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `create door type failed: ${error instanceof Error ? error.message : String(error)}` }],
        };
      }
    }
  );
}
