document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('myForm'); // fix ID case here
  const main = document.querySelector('main');

  // Load existing posts from localStorage on page load
  const savedPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
  savedPosts.forEach(post => {
    addPostToDOM(post.title, post.content, post.date, post.image);
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault(); // prevent actual form submission

    // Get values from inputs
    const title = document.getElementById('ptitle').value.trim();
    const content = document.getElementById('content').value.trim();
    const imageInput = document.getElementById('image');

    if (!title || !content) {
      alert('Por favor, preencha o título e o conteúdo.');
      return;
    }

    const now = new Date();
    const dateISO = now.toISOString().split('T')[0];
    const dateDisplay = now.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (imageInput.files.length > 0) {
      const file = imageInput.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        const imageData = e.target.result;

        // Add post to DOM
        addPostToDOM(title, content, dateDisplay, imageData);

        // Save post to localStorage
        savePost(title, content, dateISO, imageData);

        form.reset();
      };
      reader.readAsDataURL(file);
    } else {
      // Add post to DOM without image
      addPostToDOM(title, content, dateDisplay, null);

      // Save post to localStorage
      savePost(title, content, dateISO, null);

      form.reset();
    }
  });

  function addPostToDOM(title, content, dateText, imageData) {
    const article = document.createElement('article');

    const h2 = document.createElement('h2');
    h2.textContent = title;
    article.appendChild(h2);

    const time = document.createElement('time');
    time.setAttribute('datetime', dateText);
    time.textContent = dateText;
    article.appendChild(time);

    const p = document.createElement('p');
    p.textContent = content;
    article.appendChild(p);

    if (imageData) {
      const img = document.createElement('img');
      img.src = imageData;
      img.alt = 'Foto dos autores';
      img.style.maxWidth = '100%';
      img.style.marginTop = '1rem';
      article.appendChild(img);
    }

    main.appendChild(article);
  }

  function savePost(title, content, dateISO, imageData) {
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts.push({ title, content, date: dateISO, image: imageData });
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  }
});