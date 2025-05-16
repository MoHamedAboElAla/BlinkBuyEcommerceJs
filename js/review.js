
        document.addEventListener("DOMContentLoaded", () => {
            const reviewForm = document.getElementById("review-form");
            const reviewsContainer = document.getElementById("reviews-container");
            const reviewSection = document.getElementById("review-section");
            const productId = reviewSection.getAttribute("data-product-id"); // Get the product ID

            // Load reviews for the current product
            const loadReviews = () => {
                const reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
                reviewsContainer.innerHTML = reviews
                    .map(
                        (review) => `
                        <div class="review-item">
                            <div class="review-rating">
                                ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
                            </div>
                            <div class="review-product">Product: ${review.productName}</div>
                            <div class="review-text">${review.text}</div>
                            <div class="review-date">${new Date(review.date).toLocaleString()}</div>
                        </div>
                    `
                    )
                    .join("");
            };

            // Save review for the current product
            reviewForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const reviewText = document.getElementById("review-text").value;
                const reviewRating = document.getElementById("review-rating").value;
                const productName = document.getElementById("product-name").value;

                if (reviewText && reviewRating && productName) {
                    const review = {
                        text: reviewText,
                        rating: parseInt(reviewRating),
                        date: new Date().toISOString(),
                        productName: productName, // Include product name in the review
                    };

                    const reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
                    reviews.push(review);
                    localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));

                    // Clear form
                    reviewForm.reset();

                    // Reload reviews
                    loadReviews();
                }
            });

            // Initial load of reviews
            loadReviews();
        });
