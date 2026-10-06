// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close mobile menu after clicking a link
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Render projects saved by the admin dashboard
const projectsContainer = document.querySelector(".projects");
const projectsStatus = document.getElementById("projectsStatus");
const projectsControls = document.getElementById("projectsControls");
const projectsPrevious = document.getElementById("projectsPrevious");
const projectsNext = document.getElementById("projectsNext");
const postsContainer = document.querySelector(".portfolio-posts");
const postsStatus = document.getElementById("postsStatus");
const postsControls = document.getElementById("postsControls");
const postsPrevious = document.getElementById("postsPrevious");
const postsNext = document.getElementById("postsNext");

async function loadAbout() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/about");
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    const about = await response.json();
    const description = document.getElementById("aboutDescription");
    const skills = document.getElementById("aboutSkills");

    if (typeof about.description === "string" && about.description.trim()) {
      description.replaceChildren();
      about.description.split(/\n+/).forEach(paragraphText => {
        const paragraph = document.createElement("p");
        paragraph.textContent = paragraphText;
        description.appendChild(paragraph);
      });

      if (Array.isArray(about.skills)) {
        skills.replaceChildren();
        about.skills.forEach(skill => {
          if (typeof skill !== "string" || !skill.trim()) {
            return;
          }
          const skillTag = document.createElement("span");
          skillTag.textContent = skill;
          skills.appendChild(skillTag);
        });
      }
    }
  } catch (error) {
    console.error("Unable to load About content:", error);
  }
}

loadAbout();

function updatePostControls() {
  const maxScrollLeft = postsContainer.scrollWidth - postsContainer.clientWidth;
  postsControls.hidden = postsContainer.children.length === 0;
  postsPrevious.disabled = postsContainer.scrollLeft <= 1;
  postsNext.disabled = postsContainer.children.length < 2 || (
    maxScrollLeft > 1 && postsContainer.scrollLeft >= maxScrollLeft - 1
  );
}

postsPrevious.addEventListener("click", () => {
  postsContainer.scrollBy({
    left: -postsContainer.clientWidth * 0.85,
    behavior: "smooth",
  });
});

postsNext.addEventListener("click", () => {
  postsContainer.scrollBy({
    left: postsContainer.clientWidth * 0.85,
    behavior: "smooth",
  });
});

postsContainer.addEventListener("scroll", updatePostControls, { passive: true });
window.addEventListener("resize", updatePostControls);

async function loadPosts() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/posts");
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    const posts = await response.json();
    postsContainer.replaceChildren();

    if (!Array.isArray(posts) || posts.length === 0) {
      postsStatus.textContent = "No posts published yet.";
      return;
    }

    postsStatus.textContent = "";
    posts.forEach(post => {
      const article = document.createElement("article");
      article.className = "portfolio-post";

      const title = document.createElement("h3");
      title.textContent = post.title;

      const description = document.createElement("p");
      description.className = "post-description";
      description.textContent = post.description;

      const content = document.createElement("div");
      content.className = "post-content";
      const excerpt = post.content.trim();
      const excerptLimit = 220;
      content.textContent = excerpt.length > excerptLimit
        ? `${excerpt.slice(0, excerptLimit).trimEnd()}…`
        : excerpt;

      const date = document.createElement("time");
      if (post.created_at) {
        const createdDate = new Date(post.created_at);
        if (!Number.isNaN(createdDate.getTime())) {
          date.dateTime = createdDate.toISOString();
          date.textContent = createdDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }

      const readMore = document.createElement("a");
      readMore.className = "post-read-more";
      readMore.href = `post.html?id=${encodeURIComponent(post.id)}`;
      readMore.textContent = "Read more →";

      article.append(title, description, content, date, readMore);
      postsContainer.appendChild(article);
    });
    updatePostControls();
  } catch (error) {
    console.error("Error loading posts:", error);
    postsStatus.textContent = "Unable to load posts.";
  }
}

loadPosts();

function updateProjectControls() {
  const maxScrollLeft = projectsContainer.scrollWidth - projectsContainer.clientWidth;
  projectsControls.hidden = projectsContainer.children.length === 0;
  projectsPrevious.disabled = projectsContainer.scrollLeft <= 1;
  projectsNext.disabled = projectsContainer.children.length < 2 || (
    maxScrollLeft > 1 && projectsContainer.scrollLeft >= maxScrollLeft - 1
  );
}

projectsPrevious.addEventListener("click", () => {
  projectsContainer.scrollBy({
    left: -projectsContainer.clientWidth * 0.85,
    behavior: "smooth",
  });
});

projectsNext.addEventListener("click", () => {
  projectsContainer.scrollBy({
    left: projectsContainer.clientWidth * 0.85,
    behavior: "smooth",
  });
});

projectsContainer.addEventListener("scroll", updateProjectControls, { passive: true });
window.addEventListener("resize", updateProjectControls);

fetch("http://127.0.0.1:5000/api/projects")
  .then(response => {
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return response.json();
  })
  .then(projects => {
    if (!Array.isArray(projects)) throw new Error("Invalid projects response");
    if (projects.length === 0) {
      projectsStatus.textContent = "No projects have been added yet.";
      return;
    }

    projectsStatus.hidden = true;
    projects.forEach(project => {
      const card = document.createElement("div");
      card.className = "project-card";

      const title = document.createElement("h3");
      title.textContent = project.name;
      card.appendChild(title);

      const description = document.createElement("p");
      description.textContent = project.description;
      card.appendChild(description);

      if (project.link) {
        const link = document.createElement("a");
        link.className = "project-link";
        link.href = project.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Visit project →";
        card.appendChild(link);
      }

      projectsContainer.appendChild(card);
    });
    updateProjectControls();
  })
  .catch(error => {
    console.error("Unable to load saved projects:", error);
    projectsStatus.textContent = "Unable to load projects. Make sure the backend is running.";
  });

// Contact form
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitContactMessage();
});

async function submitContactMessage() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  try {
    const response = await fetch(
      "http://127.0.0.1:5000/api/contact-messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      }
    );

    const responseText = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Request failed (${response.status}): ${responseText}`
      );
    }

    const savedMessage = JSON.parse(responseText);

    formMessage.textContent =
      `Thanks, ${savedMessage.name}! Your message has been received.`;

    contactForm.reset();

  } catch (error) {
    formMessage.textContent =
      `Unable to save your message: ${error.message}`;

    console.error("Unable to save contact message:", error);
  }
}