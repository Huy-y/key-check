document.addEventListener("DOMContentLoaded", function () {
  fetch("CEAA201.json")
      .then((response) => response.json())
      .then((data) => {
        const questionsContainer = document.getElementById("questions");
        const originalQuestions = []; // Lưu trữ danh sách câu hỏi ban đầu

        // Loop through each question and create HTML elements to display them
        data.forEach((question) => {
          const questionDiv = document.createElement("div");
          questionDiv.classList.add(
              "bg-white",
              "border-solid",
              "border-2",
              "border-black",
              "p-6",
              "rounded-2xl",
              "question-card"
          );

          const questionId = document.createElement("p");
          questionId.classList.add("text-center", "text-xl");
          questionId.textContent = "Câu hỏi " + question.ID;

          const questionText = document.createElement("div");
          questionText.classList.add("mt-2", "question-text"); // Add class for search
          questionText.textContent = question.Question;

          let answerText = null;
          if (Object.keys(question.Choices).length > 0) {
            answerText = document.createElement("div")
            answerText.classList.add("mt-2", "question-choice");
            answerText.textContent = "Lựa chọn";

            // Loop through the choices dynamically
            Object.keys(question.Choices).forEach((key, index) => {
              const choiceDiv = document.createElement("div");
              choiceDiv.classList.add("mt-4");
              choiceDiv.textContent = `${key}) ${question.Choices[key]}`;
              answerText.appendChild(choiceDiv);
            });
          }

          const explainText = document.createElement("div");
          explainText.classList.add("mt-2", "text-red-500", "explain-text");
          explainText.innerHTML =
              "Đáp án : " +
              "<br>" +
              "<span class='text-green-600'>" +
              question.Answer +
              "</span>";

          const divider = document.createElement("hr");
          divider.classList.add("my-4", "divider");

          questionDiv.appendChild(questionId);
          questionDiv.appendChild(questionText);
          questionDiv.appendChild(divider);
          if (answerText)
            questionDiv.appendChild(answerText);
          questionDiv.appendChild(explainText);

          originalQuestions.push(questionDiv); // Lưu trữ câu hỏi ban đầu vào mảng
        });

        // Search functionality
        const searchInput = document.getElementById("searchInput");
        const searchResults = document.getElementById("searchResults");
        const clearButton = document.getElementById("clearButton");

        searchInput.addEventListener("input", function () {
          const searchTerm = normalizeText(searchInput.value.trim()); // Chuẩn hóa từ khóa tìm kiếm

          let hasResults = false;
          // Xóa tất cả các câu hỏi hiện có trong container
          questionsContainer.innerHTML = "";

          if (searchInput.value.trim() !== "") {
            clearButton.classList.remove("hidden"); // Hiển thị nút clear nếu có nội dung trong ô tìm kiếm
          } else {
            clearButton.classList.add("hidden"); // Ẩn nút clear nếu không có nội dung trong ô tìm kiếm
          }

          // Lặp qua danh sách câu hỏi ban đầu và tái tạo các câu hỏi tùy thuộc vào kết quả tìm kiếm
          originalQuestions.forEach((questionDiv) => {
            const questionText = normalizeText(
                questionDiv
                    .querySelector(".question-text")
                    .textContent.trim()
                    .toLowerCase()
            );
            const explainText = normalizeText(
                questionDiv
                    .querySelector(".explain-text")
                    .textContent.trim()
                    .toLowerCase()
            );

            // Kiểm tra xem câu hỏi hoặc giải thích có chứa từ khóa tìm kiếm không
            if (
                questionText.includes(searchTerm) ||
                explainText.includes(searchTerm)
            ) {
              questionsContainer.appendChild(questionDiv.cloneNode(true)); // Clone và thêm câu hỏi vào container
              hasResults = true;
            }

            // Hiển thị hoặc ẩn thông báo "Không có kết quả" dựa trên kết quả tìm kiếm
            if (hasResults) {
              searchResults.classList.add("hidden"); // Ẩn thông báo nếu có kết quả
            } else {
              searchResults.classList.remove("hidden"); // Hiển thị thông báo nếu không có kết quả
            }
          });
        });

        // Sự kiện click cho nút clear
        clearButton.addEventListener("click", function () {
          searchInput.value = ""; // Xóa nội dung của ô tìm kiếm
          clearButton.classList.add("hidden"); // Ẩn nút clear sau khi xóa nội dung
        });

        // Ban đầu, hiển thị tất cả câu hỏi
        originalQuestions.forEach((questionDiv) => {
          questionsContainer.appendChild(questionDiv);
        });
      })
      .catch((error) => console.error("Error fetching questions:", error));

  // Hàm chuẩn hóa văn bản
  function normalizeText(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    // .replace(/[^\w\s]/gi, ""); // Loại bỏ dấu và ký tự đặc biệt
  }
});

const toggleThemeButton = document.getElementById("toggleThemeButton");
let isDarkMode = localStorage.getItem("darkMode") === "true";

// Function to toggle theme
function toggleTheme() {
  const body = document.body;
  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    body.classList.add("dark");
    toggleThemeButton.classList.remove("fa-sun");
    toggleThemeButton.classList.add("fa-moon");
  } else {
    body.classList.remove("dark");
    toggleThemeButton.classList.remove("fa-moon");
    toggleThemeButton.classList.add("fa-sun");
  }

  // Save the current theme mode to local storage
  localStorage.setItem("darkMode", isDarkMode);
}

// Apply theme based on saved preference
if (isDarkMode) {
  document.body.classList.add("dark");
  toggleThemeButton.classList.remove("fa-sun");
  toggleThemeButton.classList.add("fa-moon");
} else {
  document.body.classList.remove("dark");
  toggleThemeButton.classList.remove("fa-moon");
  toggleThemeButton.classList.add("fa-sun");
}

// Add click event to toggle theme icon
toggleThemeButton.addEventListener("click", toggleTheme);

// Lấy tham chiếu đến nút "Lên đầu trang"
const scrollTopButton = document.getElementById("scrollTopButton");

// Thêm sự kiện nghe cho nút "Lên đầu trang"
scrollTopButton.addEventListener("click", function () {
  // Cuộn lên đầu trang với smooth behavior (mềm mại)
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Kiểm tra khi cuộn trang, hiển thị hoặc ẩn nút "Lên đầu trang"
window.addEventListener("scroll", function () {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollTopButton.style.display = "block";
  } else {
    scrollTopButton.style.display = "none";
  }
});