document.addEventListener("DOMContentLoaded", function() {});
document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('list');
    const bookDetails = document.getElementById('show-panel');
  
    // Function to fetch and display books
    function fetchAndDisplayBooks() {
      fetch('http://localhost:3000/books')
        .then((response) => response.json())
        .then((books) => {
          bookList.innerHTML = ''; // Clear the book list
  
          books.forEach((book) => {
            const bookItem = document.createElement('li');
            bookItem.textContent = book.title;
            bookItem.addEventListener('click', () => showBookDetails(book));
            bookList.appendChild(bookItem);
          });
        });
    }
  
    // Function to show book details
    function showBookDetails(book) {
      bookDetails.innerHTML = ''; // Clear the book details
  
      const bookTitle = document.createElement('h2');
      bookTitle.textContent = book.title;
      const bookThumbnail = document.createElement('img');
      bookThumbnail.src = book.img_url;
      const bookDescription = document.createElement('p');
      bookDescription.textContent = book.description;
      const likeButton = document.createElement('button');
      likeButton.textContent = 'LIKE';
      likeButton.addEventListener('click', () => likeBook(book));
  
      // Users who liked the book
      const userList = document.createElement('ul');
      book.users.forEach((user) => {
        const userItem = document.createElement('li');
        userItem.textContent = user.username;
        userList.appendChild(userItem);
      });
  
      bookDetails.appendChild(bookTitle);
      bookDetails.appendChild(bookThumbnail);
      bookDetails.appendChild(bookDescription);
      bookDetails.appendChild(userList);
      bookDetails.appendChild(likeButton);
    }
  
    // Function to like/unlike a book
    function likeBook(book) {
      // Check if the current user (e.g., user with ID 1) has already liked the book
      const currentUser = { id: 1, username: "pouros" };
      const userLiked = book.users.some((user) => user.id === currentUser.id);
  
      if (!userLiked) {
        // If not liked, add the current user to the list of users
        book.users.push(currentUser);
      } else {
        // If already liked, remove the current user from the list
        book.users = book.users.filter((user) => user.id !== currentUser.id);
      }
  
      // Make a PATCH request to update the book's user list
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users: book.users }),
      })
        .then(() => showBookDetails(book)); // Refresh the book details to reflect the update
    }
  
    // Initial fetch when the page loads
    fetchAndDisplayBooks();
  });
  