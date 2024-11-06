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
// Fix the addInteractiveAnimations function
function addInteractiveAnimations() {
    // Animate hero text on load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {  // Add this check
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

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

    const cards = document.querySelectorAll('.blog-card');
    if (cards.length > 0) {  // Add this check
        cards.forEach(card => {
            cardObserver.observe(card);
        });
    }
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

// Add these functions to your script.js
function showLoadingAnimation() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.remove('hidden');
    }
}

function hideLoadingAnimation() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('hidden');
    }
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
        content: `Let us dive into the world of web development, starting from the basics of how the internet works, leading all the way to understanding the JavaScript Fetch API!</br>

 1. The Internet: The Big Playground</br>
Imagine the internet as a massive city with roads connecting different houses and buildings. These houses are servers, and the roads are the pathways for information to travel—what we call the internet. Now, when you visit a website (like going to a specific house in this city), you are requesting information from one of these servers, which are like libraries holding vast amounts of data.

</br> Story: Think of a server as a huge library. When you enter the library, you ask the librarian for a specific book (let us say, the latest Harry Potter novel). The librarian then goes to the shelf, picks out the book, and hands it to you. Similarly, on the internet, when you type a URL into your browser, you are asking a server to fetch some data (like a webpage), and it hands it back to your browser, which then displays it.

 </br>2. Protocols: The Language of the Web </br>
The librarian and you need to speak the same language to understand each other, right? In the same way, computers on the internet need a set of rules to communicate, and that’s where protocols come in. The most common ones are:
</br> HTTP (Hypertext Transfer Protocol): This is like the grammar and vocabulary that ensures the server (librarian) and the client (you) understand each other when asking for web pages.
</br>HTTPS is a secure version of HTTP, where your communication is encrypted.

</br>Story: Think of HTTP as sending a letter through the mail. You write down your request, the mail carrier delivers it, and you wait for the reply. HTTPS is like sending the letter in a super-secure, locked box that only the recipient can open.

 </br>3. What is a Server? </br>
A server is just a computer that is always connected to the internet and can handle requests from other computers (clients). When you ask for a webpage, the server responds with the data you need—HTML, CSS, JavaScript, or maybe even JSON.

</br>Story: Imagine the server as a fast-food restaurant. You (the client) drive up and order a burger (a webpage). The restaurant prepares it and hands it back to you through the window. Servers work the same way—they 'cook' the data you are asking for and send it back over the internet.

 </br>4. Fetching Data: The JavaScript Fetch API </br>
Now that you know how the internet works, let's talk about the Fetch API. This is a tool that JavaScript provides to fetch (retrieve) information from servers. It's like sending a message to the server, saying, “Hey, I need some data,” and the server responds with the data you requested.

</br>Syntax: 

   <img src="Assets/fetch-api.png" alt="Fetch API" class="content-image">


In the code above:</br>
</br>You send a request to a URL (https://api.example.com/data).</br>
</br>The .then(response => response.json()) line converts the response into JSON (more on that next).</br>
</br>The next .then(data => console.log(data)) handles the data you've received and prints it to the console.</br>
</br> .catch(error => console.error('Error:', error)) is where you catch any errors, like if the server is down.</br>

 5. What is JSON? </br>
JSON (JavaScript Object Notation) is a format for storing and transferring data. It's like a grocery list in a very structured format. Here’s an example:</br>
   json
   
        <img src="Assets/json.png" alt="JSON" class="content-image">
   
This JSON object contains key-value pairs (like a dictionary). JSON is easy for both humans and machines to read and write, which makes it great for communication between a client and a server.

</br> Story: Picture JSON like a treasure map. It has all the information you need (key: 'location', value: 'X marks the spot') in a way that is easy to understand. You hand this map to the treasure hunter (the client), and they follow it to find the treasure (the data).

 </br>6. Putting It All Together</br>
Let's say you're building a weather app. The app needs to get weather data from a server, like 'What's the temperature in Nairobi right now?'

</br>1. Your app sends a request to a weather server (using the Fetch API).
</br>2. The server gets the request and responds with weather data in JSON format.
</br>3. Your app receives this data, reads it, and displays it on the screen for the user.

</br>Story: Imagine you are running a restaurant that serves only one item: pizza. When a customer (the client) calls you to order (sending a request), you check your kitchen for ingredients (the server) and prepare the pizza (the data). You then deliver the pizza (the response) back to the customer. Fetching data works the same way!

 </br>7. Other Key Concepts
</br> Promises: The Fetch API is built on something called Promises. A promise is like saying, 'I’ll get back to you when the data is ready.' So when you make a request with Fetch, it doesn’t block everything while waiting—it promises to get back to you when it has the data.

</br> Async/Await: Instead of using .then(), you can use async/await to make your code look more like traditional step-by-step instructions. It’s like saying, 'Wait here while I get the data,' which is much easier to follow.
    
    <img src="Assets/async.png" alt="Async" class="content-image">
   

 </br>8. Conclusion
</br>
- The internet is a network connecting servers (libraries) to clients (you).
</br>- Servers respond to requests from clients.
</br>- Protocols like HTTP/HTTPS govern how data is exchanged.
</br>- Fetch API in JavaScript helps you retrieve data from servers.
</br>- JSON is a common format for exchanging data.</br>
  
With this understanding, you'll be able to confidently use Fetch to build interactive web apps that communicate with servers like a pro!`,
    },
    {
        id: 2,
        title: "The Rhythm of the City: A Story of CSS Keyframes and Media Queries",
        excerpt: "Imagine the city of <b>DevTales</b> buzzing with life. It's got style, charm, and a pulse that moves to its own beat. But what gives it that <i>motion</i>, that <i>adaptability</i>? Enter CSS keyframes and media queries - the dynamic duo that keeps the city in sync, from dawn to dusk, no matter how big or small the screen.",
        category: "CSS",
        readTime: "3 min",
        date: "2024-06-11",
        image: "Assets/city2.jpg",
        content: `
Keyframes: The City's Dancers

Think of <b>keyframes</b> as the city's dancers. Every animated element in DevTales has its own rhythm and groove. Need a building to light up and flash like it's part of a futuristic cityscape? Keyframes handle it. Want your welcome sign to gently slide down like it's rolling out a red carpet? Keyframes have you covered.

Here's how it works: keyframes break down an animation into key moments. Like choreography, each “keyframe” sets a milestone in an element's movement. For example, a simple animation might have two steps: 0% for where the element starts, and 100% for where it ends. But the more frames you add, the more complex and interesting the movement becomes.

Example Code:
<img src="Assets/css-keyframes.png" alt="keyframes" class="content-image">

In this example, the city's lights pulse, growing a little bigger, then smaller - creating a rhythm that repeats. With '@keyframes', you set the vibe, tempo, and energy of any element, transforming static designs into dynamic, interactive visuals.

</br>
 Media Queries: The City's Shape-Shifters

Now let's talk <b>media queries</b>, the city's shape-shifters. In the real world, buildings don't change based on who's looking at them - but in <em>DevTales</em>, they do! A website can look different depending on the screen it's viewed on, and media queries allow you to design a site that looks flawless on every device, from a big desktop to a tiny phone screen.

Think of media queries as the blueprint adjustments for the city's skyscrapers and cozy cafés. When the screen size changes, media queries adjust the layout so that each structure stays in proportion. If someone views <em>DevTales</em> on a mobile device, it might compact to fit, simplifying and reordering elements to make it easy to read on a smaller scale.

Example Code:
<img src="Assets/css-mediaqueries.png" alt="media queries" class="content-image">

Here, the media query says, “Hey, if the screen width is 600px or less, let's shrink the welcome sign and turn off those pulsing city lights.” This adaptability ensures that no matter how someone steps into DevTales - through a laptop, tablet, or phone - they get an experience tailored just for them.

</br>

Keyframes and Media Queries Working Together

The real magic happens when keyframes and media queries work hand-in-hand. Keyframes create motion and animation, making the city lively and eye-catching. Media queries keep the city in check, adapting each element to the visitor's screen.

Imagine a simple scenario: on desktops, a banner gracefully fades in and pulses. But when viewed on a phone, the banner stays static, providing a clean, minimalistic feel. All of this is done through a few lines of code that tell your elements when to dance and when to stay cool.

So there you have it - keyframes bring movement to the city, while media queries make sure it looks stunning from every angle. In DevTales, these tools are the architects of an adaptable, responsive experience. And now, with a bit of code, you can make your own city come to life!`,
    },
    {
        id: 3,
        title: "The Backbone of DevTales: CSS Grid and Flexbox",
        excerpt: "In the city of DevTales, order and flexibility go hand-in-hand. Streets align, buildings rise in uniform rows, and spaces just let you breathe comfortably. How does everything fit so neatly, even as the city grows and adapts? The magic lies in two powerful forces shaping this urban landscape: CSS Grid and Flexbox.",
        category: "JavaScript",
        readTime: "5 min",
        date: "2024-07-11",
        image: "Assets/city4.jpg",
        content: `<b>CSS Grid: The Master Planner</b> </br>
        Imagine CSS Grid as the city's master planner. Grid loves structure and has a vision for aligning every element to create a harmonious layout. It's the framework for skyscrapers, row houses, and sprawling plazas, laying down rules for where everything should go. Grid's superpower? It can divide the city's land (your webpage) into rows and columns, creating a layout that flows seamlessly on all screens. </br>
        </br>Here's how CSS Grid works: think of it as a blueprint with carefully marked columns and rows, like a massive sheet of graph paper. You can assign any building (or element) a specific spot on this grid, or even let it stretch across multiple rows and columns. Need a header that spans the entire top row, a sidebar on the left, and a main content area in the middle? CSS Grid handles that effortlessly.</br>
        Example Code: </br>
        <img src="Assets/css-grid.png" alt="CSS Grid" class="content-image">
        </br>In this layout, Grid lays out the city with zones for a header, sidebar, main content, and footer. Each area has its own designated space, giving a structured and well balanced look. And if you decide to reshape your layout later, the grid blueprint makes it easy to adjust without tearing down any buildings.</br>
        <b>Flexbox: The Dynamic Architect</b></br>
        </br>Now, let's introduce Flexbox, the architect of flexibility. Where Grid lays out the city's main framework, Flexbox takes over in the details—like how buildings align within a block or how the furniture inside a room fits together. Flexbox's job is to keep everything neat and responsive, adapting to whatever space is available. Its specialty is arranging elements in a row or column, making it perfect for things like navigation bars, image galleries, and button groups.</br>
        Flexbox is like a city block that adapts as the space grows or shrinks. Need some buildings to take up more space and others to stay small? Flexbox can handle that with ease. Its flexibility lets it expand, shrink, or align elements precisely where they're needed. </br>
        Example Code:</br>
        <img src="Assets/ccss-flex.png" alt="CSS Flex" class="content-image">
        In this example, Flexbox takes control of the navbar, keeping items spaced evenly while staying flexible across different screen sizes. If the space changes, Flexbox adjusts the elements dynamically, without breaking the layout.</br>
        <b>Grid and Flexbox Working Together<./b> </br>
        In <i>DevTales</i>, Grid and Flexbox are like city planners working with architects. Grid creates the foundation, dividing the space into rows and columns, while Flexbox refines the details, making sure elements within those sections stay adaptable. Let's say you use Grid to set up the main zones of your website - a header, sidebar, and main content area. Within the main content area, you can use Flexbox to create a row of articles that wrap nicely as the screen size changes.</br>
        </br>By combining CSS Grid and Flexbox, you're designing a layout that's structured yet flexible, adapting smoothly as users step into your city from desktops, tablets, and phones. In DevTales, this duo brings harmony and adaptability, ensuring that every building has its place and every street flows seamlessly - no matter how much the city grows.</br>
        </br><hr></br>
        So now you've met the master planner and the architect of DevTales. Together, they lay the foundation for a city that's both structured and dynamic, giving you the power to create layouts as visionary as they are versatile.`,
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
                <span class="pagination-info">Page ${this.currentPage} of ${this.totalPages}</span>
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
                <div class="post-content">${post.content}</div>
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



// Initialize pagination with blog posts
let paginationInstance = new Pagination(blogPosts);

// Render blog posts with all features
function renderBlogPosts(posts = blogPosts) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return; // Safety check

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
                <button class="read-more" onclick='PostModal.show(${JSON.stringify(post).replace(/'/g, "&apos;").replace(/"/g, "&quot;")})'>
                    Read More
                </button>
            </div>
        </article>
    `).join('');

    // Add pagination controls
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
        paginationContainer.innerHTML = paginationInstance.renderPaginationControls();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize blog posts
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
    
    const filterContainer = document.querySelector('.filter-container');
    if (filterContainer) {
        filterContainer.appendChild(sortControls);
    }
});
// Handle sort change
function handleSort(event) {
    const sortedPosts = sortPosts(blogPosts, event.target.value);
    paginationInstance = new Pagination(sortedPosts);
    renderBlogPosts(sortedPosts);
}

// Sorting functionality
function sortPosts(posts, sortBy = 'date') {
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
}

