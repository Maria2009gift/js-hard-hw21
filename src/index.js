

const BASE_URL = "http://localhost:1313"
// Отримання списку постів
async function getPosts() {
    try { 
        const response = await fetch(`${BASE_URL}/posts`)
        if (!response.ok) {
            throw new Error("Сталась помилка, відповідь була невдала!");
          }
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error);
    }
}

    // // Створення нового поста
async function createPost(title, content) {
    try {
        const options = {
        method: "POST",
        body: JSON.stringify({ title, content }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        };
        const response = await fetch(`${BASE_URL}/posts`, options);
      
        if (!response.ok) {
            throw new Error("Відповідь від бекенду була невдалою");
        }
        const data = await response.json();
          return data;
    } catch (error) {
        console.error(error);
    }
}


    // // Оновлення поста
async function updatePost(id, title, content) {
    try {
        const options = {
            method: "PUT",
            body: JSON.stringify({ title, content }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        };
        const response = await fetch(`${BASE_URL}/posts/${id}`, options);
      
        if (!response.ok) {
           throw new Error("Відповідь від бекенду була невдалою");
        }
        const data = await response.json();
          return data;
    } catch (error) {
        console.error(error);
    }
}


    // // Видалення поста
    async function deletePost(id) {
        try {
          const response = await fetch(`${BASE_URL}/posts/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Відповідь від бекенду була невдалою")
          }
          const data = await response.json()
          return data;
        } catch (error) {
          console.error(error)
        }
      }

    // // Додавання коментаря до поста

async function createComment(postId, comment) {
  try {
    const options = {
      method: "POST",
      body: JSON.stringify({ postId, comment }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    }
    const response = await fetch(`${BASE_URL}/comments`, options)
    if (!response.ok) {
      throw new Error("Відповідь від бекенду була невдалою")
    }
    const data = await response.json()

    return data
  } catch (error) {
    console.error(error)
  }
}

    // // Оновлення відображення постів на сторінці

function renderPosts(posts) {
  const postContanier = document.querySelector('#postsContainer');
  postContanier.innerHTML = '';

  posts.forEach(post => {
    const postElement = document.createElement('div')
    postElement.classList.add('post');
    postElement.innerHTML=`
    <h2>${post.title}</h2>
    <p>ID: ${post.id}</p>
    <p class="postP">${post.content}</p>
    <button class="editPostButton" data-id="${post.id}">Редагувати</button>
    <button class="deletePostButton" data-id="${post.id}">Видалити</button>
    <div class="commentsContainer" data-id="${post.id}">
    <h3>Коментарі:</h3>
    <ul></ul>
    <form class="createCommentForm" id="createCommentForm">
    <input type="text" class="commentInput" placeholder="Новий коментар" required>
    <button type="submit">Додати коментар</button>
    </form>
    </div>
    ` 
    postContanier.appendChild(postElement)
})
}

// ==========================Обробники==============================

    // // Обробник події для створення поста
    document.getElementById('btnPost').addEventListener('click', createPostFromForm);
    
    async function createPostFromForm(event) {
      event.preventDefault()
      const title = document.querySelector("#titleInput").value;
      // console.log('title :>> ', title);
      const content = document.querySelector("#contentInput").value;
      // console.log('content :>> ', content);
      await createPost(title, content);
      const posts = await getPosts()
      renderPosts(posts)
    }

    // // Обробник події для редагування поста
    
    document.addEventListener("click", editPost);

    async function editPost(event) {
      event.preventDefault()
      if(event.target.classList.contains('editPostButton')){
        const id = event.target.dataset.id;
        const title = prompt("Новий заголовок")
        const content = prompt("Новий зміст")
        await updatePost(id, title, content)
        const posts = await getPosts()
      renderPosts(posts)
      }
    }
    
    // // Обробник події для видалення поста
    
    document.addEventListener("click", deletePostWithId);

    async function deletePostWithId(event) {
        if(event.target.classList.contains('deletePostButton')) {
            const id = prompt("Id поста")
            await deletePost(id)
            alert("Щоб побачити результат перезавантажте сторінку")
        }
        
    }
    
    // // Обробник події для додавання коментаря
    document.addEventListener('submit', addComment);

    async function addComment(event) {
        if(event.target.classList.contains('createCommentForm')) {
            event.preventDefault()
            let postId = event.target.closest(".commentsContainer").dataset.id
            let comment = document.querySelector(".commentInput").value
            await createComment(postId, comment)
            const posts = await getPosts()
            renderPosts(posts)
        }
    }
    
    // // Запуск додатку
    
    async function startApp() {
        const posts = await getPosts()
        renderPosts(posts)
    }
    
    startApp()
