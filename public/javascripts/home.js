document.addEventListener("DOMContentLoaded", async () => {
    await loadFeed();
    await loadWhoToFollow();
});



document.querySelector('.post-btn').addEventListener('click', async () => {
    const tweet = textarea.value.trim();
    const postImg = document.getElementById("post-img-upload");

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

