import NotionPage from './components/NotionPage/NotionPage.tsx';

function App() {
  const notionPageId = import.meta.env.VITE_NOTION_PAGE_ID || '';

  return (
    <div className='App'>
      <NotionPage pageId={notionPageId} />
    </div>
  );
}

export default App;
