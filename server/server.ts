import express, { Request, Response } from 'express';
import 'dotenv/config';
import { Client } from '@notionhq/client';

// Initialize Notion client with the API key from environment variables
const notion = new Client({auth: process.env.VITE_NOTION_API_KEY});

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());


const fetchBlockChildren = async (blockId: string): Promise<Record<string, any>> => {
  try {
    // Fetch the children of the given block ID
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100
    });

    // Flattened object to hold all blocks
    const blockMap: Record<string, any> = {};

    // Function to recursively fetch and add blocks to the map
    const addBlocks = async (blocks: any[]) => {
      await Promise.all(
        blocks.map(async (block: any) => {
          // Add the current block to the map
          blockMap[block.id] = {
            value: {
              id: block.id,
              type: block.type,
              properties: block[block.type]
            }
          };

          // Recursively fetch and add children if the block has children
          if (block.has_children) {
            const children = await fetchBlockChildren(block.id);
            // Add each child to the map
            Object.assign(blockMap, children);
          }
        })
      );
    };

    // Start processing blocks
    await addBlocks(response.results);

    return blockMap;
  } catch (error) {
    console.error('Error fetching block children:', error);
    return {};
  }
};

// API route for fetching Notion blocks
app.use('/api', async (req: Request, res: Response) => {
  const pageId = req.query.pageId as string;
  console.log(pageId);
  try {
    // Fetch the block children of the page
    const blocks = await fetchBlockChildren(pageId);
    // const resp = removeNullUndefined(blocks[0]);
    console.log('Blocks:', blocks);
    res.json({block: blocks});

  } catch (error: any) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
