import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerCreateWallTypeTool(server: McpServer) {
  server.tool(
    "create_wall_type",
    "Create a new WallType with compound structure layers. Each layer is defined by material name, thickness (mm), and function. The material must exist in the current Revit project.",
    {
      wallTypeName: z
        .string()
        .describe("Name for the new wall type"),
      layers: z
        .array(
          z.object({
            materialName: z
              .string()
              .describe("Material name (must exist in the project)"),
            thickness: z
              .number()
              .describe("Layer thickness in mm (0 for Membrane layers)"),
            function: z
              .enum([
                "Structure",
                "Substrate",
                "Insulation",
                "Finish1",
                "Finish2",
                "Membrane",
                "StructuralDeck",
              ])
              .describe("Layer function assignment"),
          })
        )
        .min(1)
        .describe(
          "Layers ordered from exterior to interior"
        ),
    },
    async (args, extra) => {
      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("create_wall_type", args);
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
              text: `create wall type failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
