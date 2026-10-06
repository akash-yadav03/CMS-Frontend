const postStatus = document.getElementById("postStatus");
const postDetail = document.getElementById("postDetail");

async function loadPost() {
  const postId = new URLSearchParams(window.location.search).get("id");
  if (!postId || !/^\d+$/.test(postId)) {
    postStatus.textContent = "Post not found.";
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:5000/api/posts/${encodeURIComponent(postId)}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        postStatus.textContent = "Post not found.";
        return;
      }
      throw new Error(`Request failed (${response.status})`);
    }

    const post = await response.json();
    document.title = `${post.title} | Akash Yadav`;
    document.getElementById("postTitle").textContent = post.title;
    document.getElementById("postDescription").textContent = post.description;
    document.getElementById("postContent").textContent = post.content;

    if (post.created_at) {
      const createdDate = new Date(post.created_at);
      if (!Number.isNaN(createdDate.getTime())) {
        const date = document.getElementById("postDate");
        date.dateTime = createdDate.toISOString();
        date.textContent = createdDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    }

    postStatus.hidden = true;
    postDetail.hidden = false;
  } catch (error) {
    console.error("Unable to load post:", error);
    postStatus.textContent = "Unable to load this post.";
  }
}

loadPost();
