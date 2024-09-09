import React, { useState, useEffect } from 'react';
import { NotionRenderer } from 'react-notion-x';
import { Code } from 'react-notion-x/build/third-party/code';
import { Collection } from 'react-notion-x/build/third-party/collection';
import { Equation } from 'react-notion-x/build/third-party/equation';
import { Pdf } from 'react-notion-x/build/third-party/pdf';
import { Modal } from 'react-notion-x/build/third-party/modal';
import { ExtendedRecordMap } from 'notion-types';

import './notion.scss';

interface Block {
  value: {
    id: string;
    type: string;
    properties?: {
      title?: string[][];
      language?: string[][];
    };
    content?: string[];
  };
}

interface PageData {
  block: {
    [key: string]: Block;
  };
}

const generateUniqueId = () => `block_${Math.random().toString(36).substr(2, 9)}`;

const NotionLikePage: React.FC = () => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [newBlockType, setNewBlockType] = useState<string>('text');

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      try {
        // Simulate data loading
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Set your custom page data here
        setPageData({
          block: {
            page1: {
              value: {
                id: 'page1',
                type: 'page',
                properties: {
                  title: [['Sample Notion Page']],
                },
                content: ['block1', 'block2', 'block3'],
              },
            },
            block1: {
              value: {
                id: 'block1',
                type: 'header',
                properties: {
                  title: [['Getting Started']],
                },
              },
            },
            block2: {
              value: {
                id: 'block2',
                type: 'text',
                properties: {
                  title: [['This is a sample Notion-like page created from scratch. You can add more blocks and customize the content as needed.']],
                },
              },
            },
            block3: {
              value: {
                id: 'block3',
                type: 'code',
                properties: {
                  language: [['javascript']],
                  title: [['console.log("Hello, Notion-like world!");']],
                },
              },
            },
          },
        });
      } catch (error) {
        console.error('Error setting up page data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const handleAddBlock = (type: string) => {
    if (!pageData) return;
    const newBlockId = generateUniqueId();

    const newBlock: Block = {
      value: {
        id: newBlockId,
        type: type,
        properties: {
          title: type === 'code' ? [['']] : [['New ' + type]],
          ...(type === 'code' && { language: [['javascript']] }),
        },
      },
    };

    setPageData((prevData) => {
      if (!prevData) return null;

      const updatedContent = prevData.block.page1.value.content || []; // Initialize content if undefined
      return {
        ...prevData,
        block: {
          ...prevData.block,
          [newBlockId]: newBlock,
          page1: {
            ...prevData.block.page1,
            value: {
              ...prevData.block.page1.value,
              content: [...updatedContent, newBlockId], // Update content
            },
          },
        },
      };
    });
  };

  const handleEditBlock = (blockId: string, newContent: string) => {
    if (!pageData) return;

    setPageData((prevData) => ({
      ...prevData!,
      block: {
        ...prevData!.block,
        [blockId]: {
          ...prevData!.block[blockId],
          value: {
            ...prevData!.block[blockId].value,
            properties: {
              title: [[newContent]],
            },
          },
        },
      },
    }));
    setEditingBlockId(null); // Finish editing
  };

  const handleRemoveBlock = (blockId: string) => {
    if (!pageData) return;

    const updatedBlocks = { ...pageData.block };
    delete updatedBlocks[blockId];

    const updatedContent = pageData.block.page1.value.content?.filter((id) => id !== blockId) || [];

    setPageData({
      block: {
        ...updatedBlocks,
        page1: {
          ...pageData.block.page1,
          value: {
            ...pageData.block.page1.value,
            content: updatedContent,
          },
        },
      },
    });
  };

  if (isLoading) {
    return <div className='notion-page'>Loading...</div>;
  }

  if (!pageData) {
    return (
      <div className='notion-page'>
        <h1 className='notion-title'>Welcome to My Notion-like Page</h1>
        <p className='notion-text'>This is a default empty page. Start adding your content here!</p>
      </div>
    );
  }

  return (
    <div>
      <NotionRenderer
        recordMap={pageData as unknown as ExtendedRecordMap}
        fullPage={true}
        darkMode={false}
        components={{
          Code: Code,
          Collection: Collection,
          Equation: Equation,
          Pdf: Pdf,
          Modal: Modal,
        }}
      />

      {/* Block controls */}
      <div className='block-controls'>
        <h3>Add a new block:</h3>
        <select value={newBlockType} onChange={(e) => setNewBlockType(e.target.value)}>
          <option value='text'>Text</option>
          <option value='header'>Header</option>
          <option value='code'>Code</option>
        </select>
        <button onClick={() => handleAddBlock(newBlockType)}>Add Block</button>
      </div>

      {/* Edit controls for blocks */}
      {pageData.block.page1.value.content?.map((blockId) => {
        const block = pageData.block[blockId];
        const isEditing = editingBlockId === blockId;

        return (
          <div key={blockId} className='block-edit'>
            {isEditing ? (
              <div>
                <input
                  type='text'
                  defaultValue={block.value.properties?.title?.[0][0]}
                  onBlur={(e) => handleEditBlock(blockId, e.target.value)}
                />
              </div>
            ) : (
              <div onDoubleClick={() => setEditingBlockId(blockId)}>
                <strong>{block.value.type}:</strong> {block.value.properties?.title?.[0][0]}
              </div>
            )}

            <button onClick={() => handleRemoveBlock(blockId)}>Remove Block</button>
          </div>
        );
      })}
    </div>
  );
};

export default NotionLikePage;
