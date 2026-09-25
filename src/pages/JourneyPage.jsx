import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import JourneyLayer from '../components/JourneyLayer.jsx';

// V6 route #/journey — formerly Lifecycle 05 · Learn at the bottom of the lab page.
// It has no sim, so it could leave the page without breaking any bus reaction.
// The `layer-journey` id stays for the legacy anchor (redirected here by route.js).
const JourneyPage = () => (
  <>
    <PageHeader
      eyebrow="Learning Path"
      title="Enterprise modernization journey"
      intro="What has been built so far, phase by phase, and what is planned next."
    />
    <main className="max-w-[1300px] mx-auto px-6 py-12">
      <section id="layer-journey" className="scroll-mt-24">
        <JourneyLayer />
      </section>
    </main>
  </>
);

export default JourneyPage;
