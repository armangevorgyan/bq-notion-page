import { FC, useEffect, useState } from 'react';
import { NotionRenderer } from 'react-notion-x';
import { ExtendedRecordMap } from 'notion-types';

interface PageData {
  recordMap: ExtendedRecordMap | null;
}

interface NotionPageProps {
  pageId: string;
}

const NotionPage: FC<NotionPageProps> = ({pageId}) => {
  const [pageData, setPageData] = useState<PageData | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {

      const notionData: PageData = {
        recordMap: null // Replace with actual structure
      };
      setPageData(notionData);
    };

    fetchPageData();
  }, [pageId]);

  if (!pageData) return <div>Loading...</div>;

  return (
    <NotionRenderer
      recordMap={pageData.recordMap as ExtendedRecordMap}
      fullPage={true}
      darkMode={false}
    />
  );
};

export default NotionPage;
