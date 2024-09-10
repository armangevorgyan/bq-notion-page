const fetchNotionPage = async (pageId: string) => {
  try {
    const response = await fetch('/api?pageId=' + pageId );
    return response.json();
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    throw error;
  }
};

export default fetchNotionPage;
