  document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("review-form");
  const reviewsContainer = document.getElementById("reviews-container");
  const reviewSection = document.getElementById("review-section");
  const productId = reviewSection.getAttribute("data-product-id");

  async function loadReviews() {
    try {
      const response = await fetch(`http://localhost:3000/reviews?productId=${productId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const reviews = await response.json();

      reviewsContainer.innerHTML = reviews
        .map(
          (review) => `
          <div class="review-item">
              <div class="review-rating">
                  ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
              </div>
              <div class="review-text">${review.text}</div>
              <div class="review-date">${new Date(review.date).toLocaleString()}</div>
          </div>
        `
        )
        .join("");
    } catch (error) {
      reviewsContainer.innerHTML = "<p>Failed to fetch reviews</p>";
      console.error(error);
    }
  }
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const reviewText = document.getElementById("review-text").value.trim();
    const reviewRating = parseInt(document.getElementById("review-rating").value);

    if (!reviewText || !reviewRating) {
      alert("Please fill in all fields.");
      return;
    }

    const review = {
      productId: productId,
      text: reviewText,
      rating: reviewRating,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      reviewForm.reset();
      await loadReviews();
      alert("Review submitted successfully!");
    } catch (error) {
      alert("An error occurred while submitting the review .");
      alert(".");
      console.error(error);
    }
  });

  loadReviews();
});
