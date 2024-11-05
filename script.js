// Theme toggle functionality
const initializeTheme = () => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    document.documentElement.setAttribute(
        'data-theme',
        savedTheme || (prefersDark ? 'dark' : 'light')
    );
    
    // Setup theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
    `;
    
    // Add toggle button to nav
    document.querySelector('.nav-links').prepend(themeToggle);
    
    // Toggle theme handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle button icon
        updateThemeIcon(newTheme);
    });
};

// Update theme icon based on current theme
const updateThemeIcon = (theme) => {
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.innerHTML = theme === 'dark' ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
    ` : `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
    `;
};

// Initialize theme when DOM loads
document.addEventListener('DOMContentLoaded', initializeTheme);





// Toggle No Results Message
function toggleNoResults(show) {
    const noResults = document.getElementById('noResults');
    const blogGrid = document.querySelector('.blog-grid');
    
    if (show) {
        noResults.classList.remove('hidden');
        blogGrid.classList.add('hidden');
    } else {
        noResults.classList.add('hidden');
        blogGrid.classList.remove('hidden');
    }
}

// Add interactive animations
function addInteractiveAnimations() {
    // Animate hero text on load
    const heroContent = document.querySelector('.hero-content');
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 300);

    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.blog-card').forEach(card => {
        cardObserver.observe(card);
    });
}

// Handle search focus effects
function setupSearchEffects() {
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('focus', () => {
        searchContainer.classList.add('focused');
    });

    searchInput.addEventListener('blur', () => {
        searchContainer.classList.remove('focused');
    });

    // Add search suggestions
    searchInput.addEventListener('input', debounce(showSearchSuggestions, 300));
}

// Search suggestions
function showSearchSuggestions(e) {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length < 2) return;

    const suggestions = blogPosts
        .filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.category.toLowerCase().includes(searchTerm))
        .slice(0, 5);

    updateSuggestionsDropdown(suggestions);
}

function updateSuggestionsDropdown(suggestions) {
    let dropdown = document.querySelector('.search-suggestions');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'search-suggestions';
        document.querySelector('.search-container').appendChild(dropdown);
    }

    if (suggestions.length === 0) {
        dropdown.remove();
        return;
    }

    dropdown.innerHTML = suggestions
        .map(post => `
            <div class="suggestion-item">
                <span class="suggestion-title">${post.title}</span>
                <span class="suggestion-category">${post.category}</span>
            </div>
        `)
        .join('');
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle category filter animations
function setupFilterAnimations() {
    const filterButtons = document.querySelectorAll('.filter-button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            button.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => ripple.remove(), 1000);
        });
    });
}

// Handle smooth scrolling for internal links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize all interactive features
function initializeInteractiveFeatures() {
    setupSearchEffects();
    setupFilterAnimations();
    setupSmoothScrolling();
    addInteractiveAnimations();
    
    // Add loading state for blog posts
    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.innerText;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            // Simulate loading
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 1500);
        });
    });
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeInteractiveFeatures();
    
    // Show initial loading animation
    showLoadingAnimation();
    
    // Initialize the page after a brief delay
    setTimeout(() => {
        hideLoadingAnimation();
        renderBlogPosts(blogPosts);
    }, 1000);
});

// Handle window resize events
window.addEventListener('resize', debounce(() => {
    // Readjust any necessary layouts
    setupCardHoverEffects();
}, 250));

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderBlogPosts,
        setupThemeToggle,
        setupSearch,
        setupFilters
    };
}




// Sample blog posts data
const blogPosts = [
    {
        id: 1,
        title: "Internet, Servers, and JS Fetch API",
        excerpt: "Dive into the world of web development, starting from the basics of how the internet works, leading all the way to understanding the JavaScript Fetch API!",
        category: "JavaScript",
        readTime: "5 min",
        date: "2024-05-11",
        image: "Assets/city1.jpg",
        content: `Let us dive into the world of web development, starting from the basics of how the internet works, leading all the way to understanding the JavaScript Fetch API!

 1. The Internet: The Big Playground
Imagine the internet as a massive city with roads connecting different houses and buildings. These houses are servers, and the roads are the pathways for information to travel—what we call the internet. Now, when you visit a website (like going to a specific house in this city), you are requesting information from one of these servers, which are like libraries holding vast amounts of data.

- Story: Think of a server as a huge library. When you enter the library, you ask the librarian for a specific book (let us say, the latest Harry Potter novel). The librarian then goes to the shelf, picks out the book, and hands it to you. Similarly, on the internet, when you type a URL into your browser, you are asking a server to fetch some data (like a webpage), and it hands it back to your browser, which then displays it.

 2. Protocols: The Language of the Web
The librarian and you need to speak the same language to understand each other, right? In the same way, computers on the internet need a set of rules to communicate, and that’s where protocols come in. The most common ones are:
- HTTP (Hypertext Transfer Protocol): This is like the grammar and vocabulary that ensures the server (librarian) and the client (you) understand each other when asking for web pages.
- HTTPS is a secure version of HTTP, where your communication is encrypted.

- Story: Think of HTTP as sending a letter through the mail. You write down your request, the mail carrier delivers it, and you wait for the reply. HTTPS is like sending the letter in a super-secure, locked box that only the recipient can open.

 3. What is a Server?
A server is just a computer that is always connected to the internet and can handle requests from other computers (clients). When you ask for a webpage, the server responds with the data you need—HTML, CSS, JavaScript, or maybe even JSON.

- Story: Imagine the server as a fast-food restaurant. You (the client) drive up and order a burger (a webpage). The restaurant prepares it and hands it back to you through the window. Servers work the same way—they 'cook' the data you are asking for and send it back over the internet.

 4. Fetching Data: The JavaScript Fetch API
Now that you know how the internet works, let's talk about the Fetch API. This is a tool that JavaScript provides to fetch (retrieve) information from servers. It's like sending a message to the server, saying, “Hey, I need some data,” and the server responds with the data you requested.

- Syntax: 
   javascript
   fetch('https://api.example.com/data')
     .then(response => response.json()) // Convert response to JSON
     .then(data => console.log(data)) // Do something with the data
     .catch(error => console.error('Error:', error)); // Handle any errors
   

In the code above:
- You send a request to a URL (https://api.example.com/data).
- The .then(response => response.json()) line converts the response into JSON (more on that next).
- The next .then(data => console.log(data)) handles the data you’ve received and prints it to the console.
- .catch(error => console.error('Error:', error)) is where you catch any errors, like if the server is down.

 5. What is JSON?
JSON (JavaScript Object Notation) is a format for storing and transferring data. It's like a grocery list in a very structured format. Here’s an example:
   json
   {
     'name': 'John',
     'age': 30,
     'city': 'New York'
   }
   
This JSON object contains key-value pairs (like a dictionary). JSON is easy for both humans and machines to read and write, which makes it great for communication between a client and a server.

- Story: Picture JSON like a treasure map. It has all the information you need (key: 'location', value: 'X marks the spot') in a way that is easy to understand. You hand this map to the treasure hunter (the client), and they follow it to find the treasure (the data).

 6. Putting It All Together
Let's say you’re building a weather app. The app needs to get weather data from a server, like 'What's the temperature in Nairobi right now?'

1. Your app sends a request to a weather server (using the Fetch API).
2. The server gets the request and responds with weather data in JSON format.
3. Your app receives this data, reads it, and displays it on the screen for the user.

- Story: Imagine you are running a restaurant that serves only one item: pizza. When a customer (the client) calls you to order (sending a request), you check your kitchen for ingredients (the server) and prepare the pizza (the data). You then deliver the pizza (the response) back to the customer. Fetching data works the same way!

 7. Other Key Concepts
- Promises: The Fetch API is built on something called Promises. A promise is like saying, 'I’ll get back to you when the data is ready.' So when you make a request with Fetch, it doesn’t block everything while waiting—it promises to get back to you when it has the data.

- Async/Await: Instead of using .then(), you can use async/await to make your code look more like traditional step-by-step instructions. It’s like saying, 'Wait here while I get the data,' which is much easier to follow.

   javascript
   async function getData() {
     try {
       let response = await fetch('https://api.example.com/data');
       let data = await response.json();
       console.log(data);
     } catch (error) {
       console.error('Error:', error);
     }
   }
   getData();
   

 8. Conclusion
To sum it up:
- The internet is a network connecting servers (libraries) to clients (you).
- Servers respond to requests from clients.
- Protocols like HTTP/HTTPS govern how data is exchanged.
- Fetch API in JavaScript helps you retrieve data from servers.
- JSON is a common format for exchanging data.
  
With this understanding, you'll be able to confidently use Fetch to build interactive web apps that communicate with servers like a pro!`,
    },
    {
        id: 2,
        title: "Internet, Servers, and JS Fetch API",
        excerpt: "Dive into the world of web development, starting from the basics of how the internet works, leading all the way to understanding the JavaScript Fetch API!",
        category: "JavaScript",
        readTime: "5 min",
        date: "2024-05-11",
        image: "Assets/city1.jpg",
        content: `Let us dive into the world of web development, starting from the basics of how the internet works, leading all the way to understanding the JavaScript Fetch API!

 1. The Internet: The Big Playground
Imagine the internet as a massive city with roads connecting different houses and buildings. These houses are servers, and the roads are the pathways for information to travel—what we call the internet. Now, when you visit a website (like going to a specific house in this city), you are requesting information from one of these servers, which are like libraries holding vast amounts of data.

- Story: Think of a server as a huge library. When you enter the library, you ask the librarian for a specific book (let us say, the latest Harry Potter novel). The librarian then goes to the shelf, picks out the book, and hands it to you. Similarly, on the internet, when you type a URL into your browser, you are asking a server to fetch some data (like a webpage), and it hands it back to your browser, which then displays it.

 2. Protocols: The Language of the Web
The librarian and you need to speak the same language to understand each other, right? In the same way, computers on the internet need a set of rules to communicate, and that’s where protocols come in. The most common ones are:
- HTTP (Hypertext Transfer Protocol): This is like the grammar and vocabulary that ensures the server (librarian) and the client (you) understand each other when asking for web pages.
- HTTPS is a secure version of HTTP, where your communication is encrypted.

- Story: Think of HTTP as sending a letter through the mail. You write down your request, the mail carrier delivers it, and you wait for the reply. HTTPS is like sending the letter in a super-secure, locked box that only the recipient can open.

 3. What is a Server?
A server is just a computer that is always connected to the internet and can handle requests from other computers (clients). When you ask for a webpage, the server responds with the data you need—HTML, CSS, JavaScript, or maybe even JSON.

- Story: Imagine the server as a fast-food restaurant. You (the client) drive up and order a burger (a webpage). The restaurant prepares it and hands it back to you through the window. Servers work the same way—they 'cook' the data you are asking for and send it back over the internet.

 4. Fetching Data: The JavaScript Fetch API
Now that you know how the internet works, let's talk about the Fetch API. This is a tool that JavaScript provides to fetch (retrieve) information from servers. It's like sending a message to the server, saying, “Hey, I need some data,” and the server responds with the data you requested.

- Syntax: 
   javascript
   fetch('https://api.example.com/data')
     .then(response => response.json()) // Convert response to JSON
     .then(data => console.log(data)) // Do something with the data
     .catch(error => console.error('Error:', error)); // Handle any errors
   

In the code above:
- You send a request to a URL (https://api.example.com/data).
- The .then(response => response.json()) line converts the response into JSON (more on that next).
- The next .then(data => console.log(data)) handles the data you’ve received and prints it to the console.
- .catch(error => console.error('Error:', error)) is where you catch any errors, like if the server is down.

 5. What is JSON?
JSON (JavaScript Object Notation) is a format for storing and transferring data. It's like a grocery list in a very structured format. Here’s an example:
   json
   {
     'name': 'John',
     'age': 30,
     'city': 'New York'
   }
   
This JSON object contains key-value pairs (like a dictionary). JSON is easy for both humans and machines to read and write, which makes it great for communication between a client and a server.

- Story: Picture JSON like a treasure map. It has all the information you need (key: 'location', value: 'X marks the spot') in a way that is easy to understand. You hand this map to the treasure hunter (the client), and they follow it to find the treasure (the data).

 6. Putting It All Together
Let's say you’re building a weather app. The app needs to get weather data from a server, like 'What's the temperature in Nairobi right now?'

1. Your app sends a request to a weather server (using the Fetch API).
2. The server gets the request and responds with weather data in JSON format.
3. Your app receives this data, reads it, and displays it on the screen for the user.

- Story: Imagine you are running a restaurant that serves only one item: pizza. When a customer (the client) calls you to order (sending a request), you check your kitchen for ingredients (the server) and prepare the pizza (the data). You then deliver the pizza (the response) back to the customer. Fetching data works the same way!

 7. Other Key Concepts
- Promises: The Fetch API is built on something called Promises. A promise is like saying, 'I’ll get back to you when the data is ready.' So when you make a request with Fetch, it doesn’t block everything while waiting—it promises to get back to you when it has the data.

- Async/Await: Instead of using .then(), you can use async/await to make your code look more like traditional step-by-step instructions. It’s like saying, 'Wait here while I get the data,' which is much easier to follow.

   javascript
   async function getData() {
     try {
       let response = await fetch('https://api.example.com/data');
       let data = await response.json();
       console.log(data);
     } catch (error) {
       console.error('Error:', error);
     }
   }
   getData();
   

 8. Conclusion
To sum it up:
- The internet is a network connecting servers (libraries) to clients (you).
- Servers respond to requests from clients.
- Protocols like HTTP/HTTPS govern how data is exchanged.
- Fetch API in JavaScript helps you retrieve data from servers.
- JSON is a common format for exchanging data.
  
With this understanding, you'll be able to confidently use Fetch to build interactive web apps that communicate with servers like a pro!`,
    },
    {
        id: 3,
        title: "Internet, Servers, and JS Fetch API",
        excerpt: "Dive into the world of web development, starting from the basics of how the internet works, leading all the way to understanding the JavaScript Fetch API!",
        category: "JavaScript",
        readTime: "5 min",
        date: "2024-05-11",
        image: "Assets/city1.jpg",
        content: `Let us dive into the world of web development, starting from the basics of how the internet works, leading all the way to understanding the JavaScript Fetch API!

 1. The Internet: The Big Playground
Imagine the internet as a massive city with roads connecting different houses and buildings. These houses are servers, and the roads are the pathways for information to travel—what we call the internet. Now, when you visit a website (like going to a specific house in this city), you are requesting information from one of these servers, which are like libraries holding vast amounts of data.

- Story: Think of a server as a huge library. When you enter the library, you ask the librarian for a specific book (let us say, the latest Harry Potter novel). The librarian then goes to the shelf, picks out the book, and hands it to you. Similarly, on the internet, when you type a URL into your browser, you are asking a server to fetch some data (like a webpage), and it hands it back to your browser, which then displays it.

 2. Protocols: The Language of the Web
The librarian and you need to speak the same language to understand each other, right? In the same way, computers on the internet need a set of rules to communicate, and that’s where protocols come in. The most common ones are:
- HTTP (Hypertext Transfer Protocol): This is like the grammar and vocabulary that ensures the server (librarian) and the client (you) understand each other when asking for web pages.
- HTTPS is a secure version of HTTP, where your communication is encrypted.

- Story: Think of HTTP as sending a letter through the mail. You write down your request, the mail carrier delivers it, and you wait for the reply. HTTPS is like sending the letter in a super-secure, locked box that only the recipient can open.

 3. What is a Server?
A server is just a computer that is always connected to the internet and can handle requests from other computers (clients). When you ask for a webpage, the server responds with the data you need—HTML, CSS, JavaScript, or maybe even JSON.

- Story: Imagine the server as a fast-food restaurant. You (the client) drive up and order a burger (a webpage). The restaurant prepares it and hands it back to you through the window. Servers work the same way—they 'cook' the data you are asking for and send it back over the internet.

 4. Fetching Data: The JavaScript Fetch API
Now that you know how the internet works, let's talk about the Fetch API. This is a tool that JavaScript provides to fetch (retrieve) information from servers. It's like sending a message to the server, saying, “Hey, I need some data,” and the server responds with the data you requested.

- Syntax: 
   javascript
   fetch('https://api.example.com/data')
     .then(response => response.json()) // Convert response to JSON
     .then(data => console.log(data)) // Do something with the data
     .catch(error => console.error('Error:', error)); // Handle any errors
   

In the code above:
- You send a request to a URL (https://api.example.com/data).
- The .then(response => response.json()) line converts the response into JSON (more on that next).
- The next .then(data => console.log(data)) handles the data you’ve received and prints it to the console.
- .catch(error => console.error('Error:', error)) is where you catch any errors, like if the server is down.

 5. What is JSON?
JSON (JavaScript Object Notation) is a format for storing and transferring data. It's like a grocery list in a very structured format. Here’s an example:
   json
   {
     'name': 'John',
     'age': 30,
     'city': 'New York'
   }
   
This JSON object contains key-value pairs (like a dictionary). JSON is easy for both humans and machines to read and write, which makes it great for communication between a client and a server.

- Story: Picture JSON like a treasure map. It has all the information you need (key: 'location', value: 'X marks the spot') in a way that is easy to understand. You hand this map to the treasure hunter (the client), and they follow it to find the treasure (the data).

 6. Putting It All Together
Let's say you’re building a weather app. The app needs to get weather data from a server, like 'What's the temperature in Nairobi right now?'

1. Your app sends a request to a weather server (using the Fetch API).
2. The server gets the request and responds with weather data in JSON format.
3. Your app receives this data, reads it, and displays it on the screen for the user.

- Story: Imagine you are running a restaurant that serves only one item: pizza. When a customer (the client) calls you to order (sending a request), you check your kitchen for ingredients (the server) and prepare the pizza (the data). You then deliver the pizza (the response) back to the customer. Fetching data works the same way!

 7. Other Key Concepts
- Promises: The Fetch API is built on something called Promises. A promise is like saying, 'I’ll get back to you when the data is ready.' So when you make a request with Fetch, it doesn’t block everything while waiting—it promises to get back to you when it has the data.

- Async/Await: Instead of using .then(), you can use async/await to make your code look more like traditional step-by-step instructions. It’s like saying, 'Wait here while I get the data,' which is much easier to follow.

   javascript
   async function getData() {
     try {
       let response = await fetch('https://api.example.com/data');
       let data = await response.json();
       console.log(data);
     } catch (error) {
       console.error('Error:', error);
     }
   }
   getData();
   

 8. Conclusion
To sum it up:
- The internet is a network connecting servers (libraries) to clients (you).
- Servers respond to requests from clients.
- Protocols like HTTP/HTTPS govern how data is exchanged.
- Fetch API in JavaScript helps you retrieve data from servers.
- JSON is a common format for exchanging data.
  
With this understanding, you'll be able to confidently use Fetch to build interactive web apps that communicate with servers like a pro!`,
    },
    // Add more sample posts...
];

// Pagination functionality
class Pagination {
    constructor(items, itemsPerPage = 6) {
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = Math.ceil(items.length / itemsPerPage);
    }

    getCurrentPageItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.items.slice(start, start + this.itemsPerPage);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            return true;
        }
        return false;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            return true;
        }
        return false;
    }

    renderPaginationControls() {
        return `
            <div class="pagination">
                <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="paginationInstance.previousPage() && renderBlogPosts()">
                    Previous
                </button>
                <span class="pagination-info">${this.currentPage} / ${this.totalPages}</span>
                <button class="pagination-btn" ${this.currentPage === this.totalPages ? 'disabled' : ''} 
                    onclick="paginationInstance.nextPage() && renderBlogPosts()">
                    Next
                </button>
            </div>
        `;
    }
}

// Blog post preview modal
class PostModal {
    static show(post) {
        const modal = document.createElement('div');
        modal.className = 'post-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <img src="${post.image}" alt="${post.title}" />
                <h2>${post.title}</h2>
                <div class="post-meta">
                    <span>${post.category}</span>
                    <span>${post.readTime}</span>
                    <span>${post.date}</span>
                </div>
                <p>${post.content}</p>
            </div>
        `;

        document.body.appendChild(modal);
        modal.querySelector('.modal-close').onclick = () => modal.remove();
        
        // Close on outside click
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
}

// Sorting functionality
const sortPosts = (posts, sortBy = 'date') => {
    return [...posts].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.date) - new Date(a.date);
            case 'readTime':
                return parseInt(a.readTime) - parseInt(b.readTime);
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });
};

// Initialize pagination
let paginationInstance = new Pagination(blogPosts);

// Render blog posts with all features
function renderBlogPosts(posts = blogPosts) {
    const blogGrid = document.querySelector('.blog-grid');
    const currentPosts = paginationInstance.getCurrentPageItems();
    
    blogGrid.innerHTML = currentPosts.map(post => `
        <article class="blog-card">
            <img src="${post.image}" alt="${post.title}" class="card-image" />
            <div class="card-header">
                <h3>${post.title}</h3>
                <span class="tag">${post.category}</span>
            </div>
            <div class="card-content">
                <p>${post.excerpt}</p>
            </div>
            <div class="card-footer">
                <span class="read-time">${post.readTime}</span>
                <button class="read-more" onclick="PostModal.show(${post.content})">
                    Read More
                </button>
            </div>
        </article>
    `).join('');

    // Add pagination controls
    blogGrid.insertAdjacentHTML('afterend', paginationInstance.renderPaginationControls());
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    renderBlogPosts();
    
    // Add sort controls
    const sortControls = document.createElement('div');
    sortControls.className = 'sort-controls';
    sortControls.innerHTML = `
        <label>Sort by: </label>
        <select onchange="handleSort(event)">
            <option value="date">Date</option>
            <option value="readTime">Read Time</option>
            <option value="title">Title</option>
        </select>
    `;
    
    document.querySelector('.filter-container').appendChild(sortControls);
});

// Handle sort change
function handleSort(event) {
    const sortedPosts = sortPosts(blogPosts, event.target.value);
    paginationInstance = new Pagination(sortedPosts);
    renderBlogPosts(sortedPosts);
}

