document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const gallery = document.getElementById('gallery');
    const pageInfo = document.getElementById('pageInfo');
    let currentPage = 1;
    const limit = 10;

    // Function to fetch and display photos
    const fetchPhotos = async (page) => {
        try {
            const response = await fetch(`/photos?page=${page}&limit=${limit}`);
            const data = await response.json();
                                            //map() iterates over each photo in the array
            gallery.innerHTML = data.photos.map(photo => `<img src="/uploads/${photo. filename}" alt="${photo.description}">`).join(''); //makes html tags as single string, without commas
            pageInfo.textContent = `Page ${data.page} of ${data.totalPages}`;

            // Update buttons
            document.getElementById('prevPage').disabled = data.page === 1;
            document.getElementById('nextPage').disabled = data.page === data.totalPages;
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            form.reset(); // Reset form fields
            fetchPhotos(currentPage); // Refresh photo gallery
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    });

    // Handle pagination buttons
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchPhotos(currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        currentPage++;
        fetchPhotos(currentPage);
    });

    // Initial fetch
    fetchPhotos(currentPage);
});
