async function loadFeed(type="foryou") {
    try {
        let data = null;
        let feed = null;
        if (type==="foryou"){
            data = await fetchAPI("/post/posts");
            feed = document.getElementById("for-you-feed");
        }
        else {
            data = await fetchAPI("/post/followpost");
            if (data.filteredPosts.length < 1) return;
            feed = document.getElementById("following-feed");
        }
        const posts = data.filteredPosts;

        feed.innerHTML = "";

        posts.forEach(post => {
            const postArticle = document.createElement("article");
            postArticle.className = "post";
            postArticle.innerHTML = `
                <div class="post-header"  _id="${post._id}">
                    <img src="${post.user.avatar.url || "/img/png/user.png"}" alt="User avatar" class="avatar-bounce user-avatar other-avatar">
                    <div class="username">${post.user.name}</div>
                    <div class="handle">@${post.user.username}</div>
                    <div class="timestamp">· ${post.timeAgo}</div>
                </div>
                <div class="post-content">
                    <p>${post.tweet}</p>
                    ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ""}
                </div>
                <div class="post-actions">
                    <button class="action-btn like-btn" aria-label="Like">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span class="action-count">${post.likeCount}</span>
                    </button>
                    <button class="action-btn comment-btn" aria-label="Comment">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                        </svg>
                        <span class="action-count">${post.commentCount}</span>
                    </button>
                </div>
                <div class="comments-section" style="display: none;">
                    <div class="comments-list"></div>
                    <div class="comment-composer">
                        <input type="text" placeholder="Write a comment..." aria-label="Write a comment">
                        <button class="send-comment-btn" aria-label="Send comment">SEND</button>
                    </div>
                </div>
            `;
            feed.appendChild(postArticle);

            const commentButton = postArticle.querySelector(".comment-btn");
            commentButton.addEventListener("click", async () => {
                const postHeader = postArticle.querySelector(".post-header");
                const post_id = postHeader.getAttribute("_id");

                const commentsSection = postArticle.querySelector(".comments-section");
                const commentsList = commentsSection.querySelector(".comments-list");

                commentsSection.style.display = commentsSection.style.display === "none" ? "block" : "none";

                if (commentsSection.style.display === "block") {
                    try {
                        const data = await fetchAPI("/post/getcomment", "POST", { post_id });
                        const comments = data.comments;

                        commentsList.innerHTML = "";

                        comments.forEach(comment => {
                            const commentDiv = document.createElement("div");
                            commentDiv.className = "comment";
                            commentDiv.innerHTML = `
                                <img src="${comment.user_id.avatar.url || 'default.jpg'}" alt="Commenter avatar" class="avatar-bounce loggedin-avatar">
                                <div class="comment-content">
                                    <div class="comment-username">${comment.user_id.name}</div>
                                    <div class="handle">@${comment.user_id.username}</div>
                                    <p>${comment.comment}</p>
                                </div>
                            `;
                            commentsList.appendChild(commentDiv);
                        });
                    } catch (error) {
                        console.error("Error fetching comments:", error.message);
                        alert("Failed to load comments.");
                    }
                }
            });

            const sendButton = postArticle.querySelector(".send-comment-btn");
            sendButton.addEventListener("click", async () => {
                const postHeader = postArticle.querySelector(".post-header");
                const post_id = postHeader.getAttribute("_id");
                const input = sendButton.previousElementSibling;

                try {
                    const comment = input.value.trim();
                    const data = await fetchAPI(`/post/comment`, "POST", { comment, post_id });
                    const length = data.commentData.comments.length;
                    const comments = data.commentData.comments[length - 1];

                    if (!comment) {
                        alert("Comment cannot be empty!");
                        return;
                    }

                    const commentsList = sendButton.closest(".comments-section").querySelector(".comments-list");
                    const commentDiv = document.createElement("div");
                    commentDiv.className = "comment";
                    commentDiv.innerHTML = `
                        <img src="${comments.user_id.avatar.url || 'default.jpg'}" alt="Commenter avatar" class="avatar-bounce loggedin-avatar">
                        <div class="comment-content">
                            <div class="comment-username">${comments.user_id.username || ""}</div>
                            <p>${comments.comment}</p>
                        </div>
                    `;
                    commentsList.prepend(commentDiv);

                    const commentCountSpan = postArticle.querySelector(".comment-btn .action-count");
                    commentCountSpan.textContent = parseInt(commentCountSpan.textContent) + 1;

                    input.value = "";
                } catch (error) {
                    
                }
            });


            const likeButton = postArticle.querySelector(".like-btn");
            likeButton.addEventListener("click", async () => {
                const postHeader = postArticle.querySelector(".post-header");
                const post_id = postHeader.getAttribute("_id");

                try {
                    const data = await fetchAPI("/post/like", "PUT", { post_id });
                    if (data.success) {
                        const likeCount = postArticle.querySelector(".action-count");
                        likeCount.textContent = data.likeLength;
                        if (data.like) {
                            likeButton.classList.toggle('liked');
                        } else {
                            likeButton.classList.remove('liked');
                        }
                    }
                } catch {
                    
                }
            });

        });
    } catch (error) {
        
    }
}



async function loadWhoToFollow() {
    try {
        const data = await fetchAPI("/follow/whotofollow");
        if (!data.success) {
            throw new Error(data.message || "Failed to load users");
        }

        const users = data.users;
        const whoToFollow = document.querySelector(".who-to-follow");
        const followItems = whoToFollow.querySelectorAll(".follow-item");
        
        if (users.length < 1) {
            followItems.textContent = "No user found";
            return;
          } else {
            followItems.textContent = "";
          }
        
        followItems.forEach(item => item.remove());

        users.forEach(user => {
            const followItem = document.createElement("div");
            followItem.className = "follow-item";
            followItem.innerHTML = `
                <img src="${user.avatar.url || './img/png/user.png'}" alt="User avatar" class="avatar-bounce user-avatar other-avatar">
                <div>
                    <div class="username">${user.name}</div>
                    <div class="handle">@${user.username}</div>
                </div>
                <button class="follow-btn" aria-label="Follow" data-username="${user.username}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                </button>
            `;
            whoToFollow.appendChild(followItem);

            const followButton = followItem.querySelector(".follow-btn");
            followButton.addEventListener("click", async () => {
                const username = followButton.getAttribute("data-username");
                try {
                    const followData = await fetchAPI("/follow/follow", "POST", { username });
                    if (followData.success) {
                        followButton.disabled = true;
                        followButton.innerHTML = `<span>Followed</span>`;
                        followItem.remove();
                    }
                } catch (error) {
                    console.error("Error following user:", error.message);
                }
            });
        });
    } catch (error) {
    }
}
