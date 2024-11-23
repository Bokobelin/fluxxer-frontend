const API_URL = 'https://fluxxer-backend.vercel.app';

document.addEventListener('DOMContentLoaded', async () => {
  const feed = document.getElementById('feed');
  const form = document.getElementById('new-post-form');
  const postContent = document.getElementById('post-content');
  const loadMoreButton = document.getElementById('load-more');
  let currentIndex = 0; // Track the current post index

  // Function to fetch a single post by index
  async function fetchPostByIndex(index) {
    try {
      const response = await fetch(`${API_URL}/api/posts.js?index=${index}`, {
        method: 'GET',
      });

      if (response.ok) {
        return await response.json(); // Return the single post as JSON
      } else if (response.status === 404) {
        console.warn('No more posts available.');
        return null; // Return null if no more posts
      } else {
        console.error('Error fetching post:', response.statusText);
        return null; // Return null in case of an error
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      return null; // Handle network errors
    }
  }

  // Function to fetch the first post (for refreshing after a new post is added)
  async function fetchFirstPost() {
    try {
      const response = await fetch(`${API_URL}/api/posts.js?index=0`, {
        method: 'GET',
      });

      if (response.ok) {
        return await response.json(); // Return the single post as JSON
      } else {
        console.warn('No posts available.');
        return null; // Return null if no posts exist
      }
    } catch (error) {
      console.error('Error fetching first post:', error);
      return null; // Handle network errors
    }
  }

  // Function to render the feed
  async function renderFeed(posted = false) {
    let post = null;
    if (posted) {
      post = await fetchFirstPost(); // Fetch the first post after a new post is submitted
    } else {
      post = await fetchPostByIndex(currentIndex); // Fetch the next post by index
    }

    if (post != null) {
      const postEl = document.createElement('div');
      postEl.classList.add('post');
      postEl.innerHTML = `
        <p>${post.content}</p>
        <div class="post-time">${new Date(post.time).toLocaleString()}</div>
      `;
      feed.appendChild(postEl); // Append the new post to the feed

      if (!posted) {
        currentIndex++; // Increment the index for the next post if it's not a new post
      }
    } else {
      // If there are no posts to show and this is the first load
      const noMorePosts = feed.appendChild(document.createElement('p'));
      noMorePosts.style.textAlign = 'center';
      noMorePosts.textContent = 'No more posts available.';
      loadMoreButton.style.display = 'none';
    }
  }

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (postContent.value.trim() !== '') {
      await fetch(`${API_URL}/api/posts.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: postContent.value.trim() }),
      });
      postContent.value = '';
      feed.innerHTML = ''; // Clear feed to re-render with new posts
      currentIndex = 0; // Reset the index to start from the first post
      //renderFeed(true); // Fetch the latest post after submission
    }
  });

  // Load more posts manually with the button
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => renderFeed());
  }
});
