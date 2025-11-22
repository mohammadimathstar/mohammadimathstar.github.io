document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Switching ---
    const tabs = document.querySelectorAll('.nav-btn:not(#theme-toggle)');
    const sections = document.querySelectorAll('.section');

    function switchTab(tabId) {
        tabs.forEach(tab => tab.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        const targetTab = document.querySelector(`[data-tab="${tabId}"]`);
        const targetSection = document.getElementById(tabId);

        if (targetTab && targetSection) {
            targetTab.classList.add('active');
            targetSection.classList.add('active');
            history.pushState(null, null, `#${tabId}`);
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Handle Initial Load
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        switchTab(hash);
    } else {
        switchTab('home');
    }

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check local storage
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    });

    // --- Modals ---
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');

    window.openModal = function (title, imgSrc, desc, githubLink, demoLink) {
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-img').src = imgSrc;
        document.getElementById('modal-desc').innerText = desc;
        document.getElementById('modal-github').href = githubLink;
        document.getElementById('modal-demo').href = demoLink;

        modal.style.display = 'flex';
    }

    closeBtn.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // --- Blog Loading ---
    window.loadBlogPost = function (filename) {
        const blogList = document.getElementById('blog-list');
        const blogView = document.getElementById('blog-view');
        const blogContent = document.getElementById('blog-content');

        fetch(`blog/${filename}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(text => {
                blogContent.innerHTML = marked.parse(text);
                blogList.style.display = 'none';
                blogView.style.display = 'block';
                window.scrollTo(0, 0);
            })
            .catch(err => {
                console.error('Error loading blog post:', err);
                blogContent.innerHTML = '<p>Error loading article. Please try again later.</p>';
            });
    }

    window.showBlogList = function () {
        document.getElementById('blog-list').style.display = 'block';
        document.getElementById('blog-view').style.display = 'none';
    }
});
