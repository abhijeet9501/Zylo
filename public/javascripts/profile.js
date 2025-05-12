async function loadUserProfile() {
    try {
        const endpoint = "/profile/me";
        const data = await fetchAPI(endpoint);
        if (!data.success) {
            throw new Error(data.message || "Failed to load profile");
        }

        const user = data.user;

        const profileHeader = document.querySelector(".profile-header");
        
   
            profileHeader.innerHTML = `
            <img src="${user.avatar || "/img/png/user.png"}" alt="User avatar" class="avatar-bounce user-avatar loggedin-avatar">
            <div class="profile-info">
                <div class="username user-name">${user.name}</div>
                <div class="handle user-username">@${user.username}</div>
                <p class="bio" id="user-bio">${user.bio || ""}</p>
                <div class="follow-stats">
                    <span class="stat"><span class="count user-following">${user.followingCount}</span> Following</span>
                    <span class="stat"><span class="count user-followers">${user.followCount}</span> Followers</span>
                </div>
            </div>
        `;

      
        const postsTab = document.querySelector("#posts");
        postsTab.innerHTML = "";

        user.formattedPost.forEach(post => {
            const postArticle = document.createElement("article");
            postArticle.className = "post";
            postArticle.innerHTML = `
                <div class="post-header" _id="${post.post_id}">
                    <img src="${post.user.avatar.url || '/img/png/user.png'}" alt="User avatar" class="avatar-bounce other-avatar">
                    <div class="username">${post.user.name}</div>
                    <div class="handle">@${post.user.username}</div>
                    <div class="timestamp">· ${post.timeAgo}</div>
                </div>
                <div class="post-content">
                    <p>${post.tweet}</p>
                    ${post.post_img ? `<img src="${post.post_img}" alt="Post image" class="post-image">` : ""}
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
                        <button class="action-btn delete-btn" aria-label="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="24" height="24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
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
            postsTab.appendChild(postArticle);


            const deleteButton = postArticle.querySelector(".delete-btn")
                deleteButton.addEventListener("click", async () => {
                    const postHeader = postArticle.querySelector(".post-header");
                    const post_id = postHeader.getAttribute("_id");
                    try {
                        const data = await fetchAPI("/post/deletePost", "DELETE", {post_id});
                        postArticle.remove();
                    } catch {
                        
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
                        commentsList.innerHTML = "";
                        data.comments.forEach(comment => {
                            const commentDiv = document.createElement("div");
                            commentDiv.className = "comment";
                            commentDiv.innerHTML = `
                                <img src="${comment.user_id.avatar.url || '/img/png/user.png'}" alt="Commenter avatar" class="avatar-bounce loggedin-avatar">
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
                const comment = input.value.trim();

                if (!comment) {
                    alert("Comment cannot be empty!");
                    return;
                }

                try {
                    const data = await fetchAPI("/post/comment", "POST", { comment, post_id });
                    const comments = data.commentData.comments;
                    const newComment = comments[comments.length - 1];

                    const commentsList = sendButton.closest(".comments-section").querySelector(".comments-list");
                    const commentDiv = document.createElement("div");
                    commentDiv.className = "comment";
                    commentDiv.innerHTML = `
                        <img src="${newComment.user_id.avatar.url || '/img/png/user.png'}" alt="Commenter avatar" class="avatar-bounce loggedin-avatar">
                        <div class="comment-content">
                            <div class="comment-username">${newComment.user_id.name}</div>
                            <div class="handle">@${newComment.user_id.username}</div>
                            <p>${newComment.comment}</p>
                        </div>
                    `;
                    commentsList.prepend(commentDiv);

                    const commentCountSpan = postArticle.querySelector(".comment-btn .action-count");
                    commentCountSpan.textContent = parseInt(commentCountSpan.textContent) + 1;
                    input.value = "";
                } catch (error) {
                    console.error("Error sending comment:", error.message);
                    alert("Failed to send comment.");
                }
            });
        });

        await loadWhoToFollow();

        const followingTab = document.querySelector("#following");
        followingTab.innerHTML = "";
        user.followingList.forEach(follow => {
            const followItem = document.createElement("div");
            followItem.className = "follow-item";
            followItem.innerHTML = `
                <img src="${follow.avatar.url || '/img/png/user.png'}" alt="User avatar" class="avatar-bounce other-avatar">
                <div>
                    <div class="username">${follow.name}</div>
                    <div class="handle">@${follow.username}</div>
                </div>
                <button class="follow-btn unfollow-btn" aria-label="Unfollow" data-username="${follow.username}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M19 12H5v2h14v-2z" fill="#000000"/>
                    </svg>
                </button>
            `;
            followingTab.appendChild(followItem);

           
                const unfollowButton = followItem.querySelector(".unfollow-btn");
                unfollowButton.addEventListener("click", async () => {
                    const username = unfollowButton.getAttribute("data-username");
                    try {
                        const data = await fetchAPI("/follow/follow", "POST", { username });
                        if (data.success) {
                            followItem.remove(); 
                        } else {
                            alert("Failed to unfollow: " + data.message);
                        }
                    } catch (error) {
                        console.error("Error unfollowing user:", error.message);
                        alert("Failed to unfollow: " + error.message);
                    }
                });
            
        });

        const followersTab = document.querySelector("#followers");
        followersTab.innerHTML = "";
        user.followList.forEach(follow => {
            const followItem = document.createElement("div");
            followItem.className = "follow-item";
            followItem.innerHTML = `
                <img src="${follow.avatar.url || '/img/png/user.png'}" alt="User avatar" class="avatar-bounce other-avatar">
                <div>
                    <div class="username">${follow.name}</div>
                    <div class="handle">@${follow.username}</div>
                </div>
                <button class="follow-btn unfollow-btn" aria-label="Unfollow" data-username="${follow.username}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 12H5v2h14v-2z" fill="#000000"/>
                    </svg>
                </button>
            `;
            followersTab.appendChild(followItem);

            const unfollowButton = followItem.querySelector(".unfollow-btn");
                unfollowButton.addEventListener("click", async () => {
                    const username = unfollowButton.getAttribute("data-username");
                    try {
                        const data = await fetchAPI("/follow/removefollow", "POST", { username });
                        if (data.success) {
                            followItem.remove(); 
                        } else {
                        }
                    } catch (error) {
                    }
                });
        });
    
        const tabButtons = document.querySelectorAll(".tab-btn");
        const tabContents = document.querySelectorAll(".tab-content");
        tabButtons.forEach(button => {
            button.addEventListener("click", () => {
                tabButtons.forEach(btn => btn.classList.remove("active"));
                tabContents.forEach(content => content.classList.remove("active"));
                button.classList.add("active");
                document.querySelector(`#${button.dataset.tab}`).classList.add("active");
            });
        });

    } catch (error) {
        console.error("Error loading profile:", error.message);
        alert("Failed to load profile: " + error.message);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    renderUser();
});
