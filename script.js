const API_URL = 'https://fluxxer-backend.vercel.app'; // Your API URL

document.addEventListener('DOMContentLoaded', async () => {
  const feed = document.getElementById('feed');
  const form = document.getElementById('new-post-form');
  const postContent = document.getElementById('post-content');
  const loadMoreButton = document.getElementById('load-more');
  let posts = []; // Array to hold all posts
  let visiblePostsCount = 0; // Track the number of posts currently visible
  const postsPerLoad = 5; // Number of posts to load at a time

  // Fetch all posts from the server
  async function fetchAllPosts() {
    try {
      const response = await fetch(`${API_URL}/api/posts.js`, {
        method: 'GET',
      });
      if (response.ok) {
        posts = await response.json(); // Store all posts in memory
        posts.reverse(); // Ensure newest posts are shown first
      } else {
        console.error('Error fetching posts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  // Render a batch of posts to the feed
  function renderPosts() {
    const postsToShow = posts.slice(visiblePostsCount, visiblePostsCount + postsPerLoad);
    postsToShow.forEach((post) => {
      const postEl = document.createElement('div');
      postEl.classList.add('post');
      postEl.innerHTML = `
        <p>${post.content}</p>
        <div class="post-time">${new Date(post.time).toLocaleString()}</div>
      `;
      feed.appendChild(postEl);
    });
    visiblePostsCount += postsToShow.length;

    // Hide the "Load More" button if all posts are displayed
    if (visiblePostsCount >= posts.length) {
      loadMoreButton.style.display = 'none';
    }
  }

  // Handle form submission to create a new post
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (postContent.value.trim() !== '') {
      try {
        const response = await fetch(`${API_URL}/api/posts.js`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: postContent.value.trim() }),
        });

        if (response.ok) {
          postContent.value = ''; // Clear the input
          feed.innerHTML = ''; // Clear the feed to re-render
          visiblePostsCount = 0; // Reset visible posts count
          await fetchAllPosts(); // Fetch the updated posts
          renderPosts(); // Render the updated feed
        } else {
          console.error('Error submitting post:', response.statusText);
        }
      } catch (error) {
        console.error('Error submitting post:', error);
      }
    }
  });

  // Load more posts when the button is clicked
  loadMoreButton.addEventListener('click', () => {
    renderPosts();
  });

  // Initialize the feed
  await fetchAllPosts(); // Fetch all posts from the backend
  renderPosts(); // Render the initial batch of posts
});
