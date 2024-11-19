const API_URL = 'https://fluxxer-backend.vercel.app';

document.addEventListener('DOMContentLoaded', async () => {
  const feed = document.getElementById('feed');
  const form = document.getElementById('new-post-form');
  const postContent = document.getElementById('post-content');

  async function fetchPosts() {
    const response = await fetch('https://fluxxer-backend.vercel.app/api/posts.js', {
      method: 'GET', // GET method for fetching data
      headers: {
      },
    });

    if (response.ok) {  // Check if the request was successful
      return response.json();  // Parse the response as JSON
    } else {
      console.error('Error fetching posts:', response.statusText);
      return [];  // Return an empty array in case of an error
    }
  }


  async function renderFeed() {
    const posts = await fetchPosts();
    feed.innerHTML = '';  // Clear the feed before rendering new posts

    // Loop through posts and render each post
    posts.forEach(post => {
      const postEl = document.createElement('div');
      postEl.classList.add('post');
      postEl.innerHTML = `
        <p>${post.content}</p>
        <div class="post-time">${new Date(post.time).toLocaleString()}</div>
      `;
      feed.appendChild(postEl);
    });
  }


  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (postContent.value.trim() !== '') {
      await fetch(`https://fluxxer-backend.vercel.app/api/posts.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: postContent.value.trim() }),
      });
      postContent.value = '';
      renderFeed();
    }
  });

  renderFeed();
});
