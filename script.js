const API_URL = 'https://fluxxer-backend.vercel.app'; // Your API URL

document.addEventListener('DOMContentLoaded', async () => {
    const feed = document.getElementById('feed');
    const form = document.getElementById('new-post-form');
    const postContent = document.getElementById('post-content');
    const postCategory = document.getElementById('post-category');
    const loadMoreButton = document.getElementById('load-more');
    const navLinks = document.querySelectorAll('nav a');
    const toggleSidebarButton = document.getElementById('toggle-sidebar'); // Add this line
    const sidebar = document.querySelector('.sidebar'); // Add this line
    let posts = [];
    let visiblePostsCount = 0;
    const postsPerLoad = 5;
    let currentCategory = '';

    // Fetch all posts from the server
    async function fetchAllPosts() {
      try {
        const response = await fetch(`${API_URL}/api/posts.js`, {
          method: 'GET',
        });
        if (response.ok) {
          posts = await response.json();
          //posts.reverse() //posts are reversed on the backend
        } else {
          console.error('Error fetching posts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    // Render a batch of posts to the feed
    function renderPosts() {
      const filteredPosts = posts.filter(post => currentCategory === '' || post.category === currentCategory);
      const postsToShow = filteredPosts.slice(visiblePostsCount, visiblePostsCount + postsPerLoad);
      postsToShow.forEach((post) => {
        const postEl = document.createElement('div');
        postEl.classList.add('post');
        postEl.innerHTML = `
          <p>${post.content}</p>
          <div class="post-category">${post.category || ''}</div>
          <div class="post-time">${new Date(post.time).toLocaleString()}</div>
        `;
        feed.appendChild(postEl);
      });
      visiblePostsCount += postsToShow.length;

      // Hide the "Load More" button if all posts are displayed
      if (visiblePostsCount >= filteredPosts.length) {
        loadMoreButton.style.display = 'none';
      } else {
        loadMoreButton.style.display = 'block';
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
            body: JSON.stringify({
              content: postContent.value.trim(),
              category: postCategory.value,
            }),
          });

          if (response.ok) {
            postContent.value = '';
            postCategory.value = '';
            feed.innerHTML = '';
            visiblePostsCount = 0;
            await fetchAllPosts();
            renderPosts();
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

    // Handle category navigation
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        currentCategory = e.target.getAttribute('data-category');
        navLinks.forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
        feed.innerHTML = '';
        visiblePostsCount = 0;
        renderPosts();
        sidebar.classList.toggle('show');
      });
    });

    // Toggle sidebar visibility
    toggleSidebarButton.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    // Initialize the feed
    await fetchAllPosts();
    renderPosts();
  });
