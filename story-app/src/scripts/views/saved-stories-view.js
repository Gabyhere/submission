import { getSavedStories, deleteSavedStory } from '../utils/idb.js';

const SavedStoriesView = {
  async render() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <section>
        <h2>Saved Stories</h2>
        <div id="saved-stories" class="story-grid"></div>
      </section>
    `;

    const storiesContainer = document.getElementById('saved-stories');
    const stories = await getSavedStories();

    if (stories.length === 0) {
      storiesContainer.innerHTML = '<p>No saved stories.</p>';
      return;
    }

    stories.forEach((story) => {
      const storyItem = document.createElement('div');
      storyItem.classList.add('story-item');
      storyItem.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.name}">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <button class="remove-bookmark" data-id="${story.id}">Hapus Bookmark</button>
      `;
      storiesContainer.appendChild(storyItem);
    });

    storiesContainer.addEventListener('click', async (e) => {
      if (e.target.classList.contains('remove-bookmark')) {
        const id = e.target.getAttribute('data-id');
        await deleteSavedStory(id);
        this.render(); // Refresh halaman
      }
    });
  },
};

export default SavedStoriesView;
