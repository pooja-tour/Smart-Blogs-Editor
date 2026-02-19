let blogId = null;

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

const params = new URLSearchParams(window.location.search);
const idFromURL = params.get("id");

if (idFromURL) {
    blogId = idFromURL;

    fetch(`/blog/${blogId}`)
        .then(res => res.json())
        .then(data => {
            titleInput.value = data.title;
            contentInput.value = data.content;
        });
}

function saveBlog() {

    const blogData = {
        title: titleInput.value,
        content: contentInput.value
    };

    if (blogId) {
        blogData.id = blogId;
    }

    fetch("/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        window.location.href = "blogs.html";
    });
}