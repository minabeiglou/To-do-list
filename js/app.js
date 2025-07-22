 const openModalButton = document.querySelector(".open-modal-button");
    const addTodoModal = document.querySelector(".modal-screen");
    const cancelBtn = document.querySelector(".cancel");
    const closeModalX = document.querySelector(".close-modal-x");
    const createTodoBtn = document.querySelector(".create");
    const todoInput = document.querySelector(".input");
    const todosContainer = document.querySelector(".todos-container");
    const categorySelect = document.querySelector(".category-select");
    const sortButton = document.querySelector(".sort-button");
    const sortMenu = document.querySelector(".sort-menu");
    const currentFilter = document.getElementById("current-filter");

    let tasks = [];
    let filter = "all";

    window.addEventListener("load", () => {
      const saved = localStorage.getItem("tasks");
      if (saved) tasks = JSON.parse(saved);
      renderTasks();
    });

    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function showModal() {
      addTodoModal.classList.remove("hidden");
    }
    function hideModal() {
      addTodoModal.classList.add("hidden");
    }

    openModalButton.addEventListener("click", showModal);
    cancelBtn.addEventListener("click", hideModal);
    closeModalX.addEventListener("click", hideModal);

    document.body.addEventListener("keydown", e => {
      if (e.key === "Escape") hideModal();
    });

    createTodoBtn.addEventListener("click", () => {
      const title = todoInput.value.trim();
      const category = categorySelect.value;
      if (title === "") {
        alert("عنوان نمی‌تواند خالی باشد");
        return;
      }
      const task = { id: Date.now(), title, category };
      tasks.push(task);
      saveTasks();
      todoInput.value = "";
      hideModal();
      renderTasks();
    });

    function renderTasks() {
      todosContainer.innerHTML = "";
      const filtered = filter === "all" ? tasks : tasks.filter(t => t.category === filter);
      filtered.forEach(task => {
        const article = document.createElement("article");
        article.className = "todo";
        article.innerHTML = `
          <div class="todo-data">
            <p>${task.title}</p>
            <small>${getCategoryName(task.category)}</small>
          </div>
          <div class="todo-buttons">
            <button class="edit">ویرایش</button>
            <button class="delete">حذف</button>
          </div>
        `;
        article.querySelector(".delete").onclick = () => {
          tasks = tasks.filter(t => t.id !== task.id);
          saveTasks();
          renderTasks();
        };
        article.querySelector(".edit").onclick = () => {
          const newTitle = prompt("عنوان جدید:", task.title);
          if (newTitle && newTitle.trim() !== "") {
            task.title = newTitle.trim();
            saveTasks();
            renderTasks();
          }
        };
        todosContainer.appendChild(article);
      });
    }

    function getCategoryName(value) {
      switch (value) {
        case "learning": return "یادگیری";
        case "general": return "عمومی";
        case "personal": return "شخصی";
        default: return "";
      }
    }

    sortButton.addEventListener("click", () => {
      sortMenu.classList.toggle("hidden");
    });

    sortMenu.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        filter = btn.value;
        currentFilter.textContent = btn.textContent;
        sortMenu.classList.add("hidden");
        renderTasks();
      });
    });