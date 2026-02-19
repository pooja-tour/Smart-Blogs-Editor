function goToCreate() {
    window.location.href = "editor.html";
}

fetch("/blogs")
    .then(res => res.json())
    .then(data => {

        const container = document.getElementById("blogList");

        data.forEach(blog => {

            const div = document.createElement("div");
            div.classList.add("blog-card");

            div.innerHTML = `
                <h3>${blog.title}</h3>
                <p>${blog.content.substring(0,120)}...</p>
                <button onclick="editBlog('${blog._id}')">Edit</button>
                <button onclick="deleteBlog('${blog._id}')">Delete</button>
                <hr/>
            `;

            container.appendChild(div);
        });

    });

function editBlog(id) {
    window.location.href = `editor.html?id=${id}`;
}

function deleteBlog(id) {

    if (confirm("Are you sure you want to delete this blog?")) {

        fetch(`/delete/${id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            location.reload();
        });

    }
}