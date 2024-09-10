import React, { useState, useEffect } from 'react';
import { NotionRenderer } from 'react-notion-x';

import { ExtendedRecordMap } from 'notion-types';
import './notion.scss';
import fetchNotionPage from '../../services/fetchNotionPage.tsx';
import { GetPageResponse, PageObjectResponse, PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints';


const NotionLikePage: React.FC<{ pageId: string }> = ({pageId}) => {
  const [pageData, setPageData] = useState<PageObjectResponse | PartialPageObjectResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      try {
        // Simulate data loading
        const data: GetPageResponse = await fetchNotionPage(pageId);
        console.log(data);
        setPageData(data);
      } catch (error) {
        setError(error);
        console.error('Error setting up page data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (isLoading) {
    return <div className='notion-page'>Loading...</div>;
  }

  if (error) {
    return <div className='notion-page'>{error as string}</div>;
  }
  if (!pageData || typeof pageData !== 'object') {
    return <div>Invalid data</div>;
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
        }}
      />
    </div>
  );
};

export default NotionLikePage;
