import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import KnowledgeLayer from '../components/KnowledgeLayer.jsx';

// V6 route #/writing. KnowledgeLayer keeps its `knowledge-base` section id so the
// legacy #knowledge-base anchor (redirected here by route.js) still means something.
const WritingPage = () => (
  <>
    <PageHeader
      eyebrow="Blog & Builds"
      title="Writing and shipped tools"
      intro="Multi-part series and field notes from reprodev.com, and the open-source software behind them."
    />
    <main className="max-w-[1300px] mx-auto px-6 py-12">
      <KnowledgeLayer />
    </main>
  </>
);

export default WritingPage;
