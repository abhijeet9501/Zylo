document.addEventListener("DOMContentLoaded", async () => {
     localStorage.setItem('mute', true); 
    await renderUser();
    await loadFeed();
    if (window.innerWidth > 768) {
        await loadWhoToFollow();
    }
});



document.querySelector('.post-btn').addEventListener('click', async () => {
    const tweet = textarea.value.trim();
    const postImg = document.getElementById("post-img-upload");
    playSound("./wav/kill.wav");

    try {
        let data;
        if (postImg?.files.length > 0) {
            const file = postImg.files[0];
            const formData = new FormData();
            formData.append("post", file);
            formData.append("tweet", tweet);
            showLoading();
            const response = await fetch("/api/v1/post/createpost", {
                method: "POST",
                body: formData,
            });

            data = await response.json();
        } else {
            if (!tweet) {
                alert("Tweet cannot be empty!");
                return;
            }
            showLoading();
            data = await fetchAPI("/post/createpost", "POST", { tweet });
        }

        if (data.success) {
            hideLoading();
            await loadFeed();
            textarea.value = "";
            if (postImg) postImg.value = "";
        } else {
            hideLoading();
            alert("Failed to upload post: " + data.message);
        }
    } catch (error) {
        console.error("Error uploading post:", error.message);
        alert("Failed to upload post: " + error.message);
    }
});



const tabButtons = document.querySelectorAll('.tab-btn');
const feeds = document.querySelectorAll('.feed');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        feeds.forEach(feed => feed.style.display = 'none');

        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(`${tabId}-feed`).style.display = 'block';
        if (tabId === "following") loadFollowinPosts();
    });
});

const loadFollowinPosts = async () => {
    loadFeed("following");
};



const textarea = document.querySelector('.composer textarea');
const wordCounter = document.querySelector('.word-counter');
const maxChars = 80;

textarea.addEventListener('input', () => {
    let text = textarea.value;
    if (text.length > maxChars) {
        textarea.value = text.slice(0, maxChars);
        text = textarea.value;
    }
    const charCount = text.length;
    wordCounter.style.color = charCount === maxChars ? '#FF00FF' : 'var(--text-muted)';
    wordCounter.textContent = `${charCount}/${maxChars}`;
});
