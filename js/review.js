document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("review-form");
  const reviewsContainer = document.getElementById("reviews-container");
  const reviewSection = document.getElementById("review-section");
  const productId = reviewSection.getAttribute("data-product-id");


  // Load reviews from db.json
  async function loadReviews() {
    try {
      const response = await fetch(`http://localhost:3000/reviews?productId=${productId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const reviews = await response.json();

      if (reviews.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Reviews Yet",
          text: "Be the first to leave a review!",
          confirmButtonColor: "#fd5d5c",
        });
        reviewsContainer.innerHTML = "";
        return;
      }

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
    } catch (error) {
      reviewsContainer.innerHTML = "<p>Failed to load reviews.</p>";
      console.error(error);
    }
  }
  // Submit review to db.json
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const reviewText = document.getElementById("review-text").value.trim();
    const reviewRating = parseInt(document.getElementById("review-rating").value);
 const productName = document.getElementById("product-name").value.trim(); 
    if (!reviewText || !reviewRating) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill out both the review and the rating.",
        confirmButtonColor: "#fd5d5c",
      });
      return;
    }

    const review = {
      productId: productId,
      text: reviewText,
      productName: productName,
      rating: reviewRating,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });

      if (!response.ok) throw new Error("Failed to submit review.");

      reviewForm.reset();
      await loadReviews();

      Swal.fire({
        icon: "success",
        title: "Review Submitted",
        text: "Thank you for your feedback!",
        confirmButtonColor: "#fd5d5c",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "An error occurred while submitting your review.",
        confirmButtonColor: "#fd5d5c",
      });
      console.error(error);
    }
  });

  loadReviews();
});
