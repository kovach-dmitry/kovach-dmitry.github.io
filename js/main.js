// Знаходимо елементи на сторінці
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// Функції
function addTask(event) {
	// Скасуємо відправлення форми
	event.preventDefault();

	// Беремо текст "справи" з поля введення
	const taskText = taskInput.value;

	// Описуємо "справу" як об'єкт
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};

	// Додаємо "справу" в масив із завданнями
	tasks.push(newTask);

	// Зберігаємо список "справ" у сховищі браузера localStorage
	saveToLocalStorage();

	// Рендерим "справу" на сторінці
	renderTask(newTask);

	// Очищуємо поле введення та повертаємо на нього фокус
	taskInput.value = '';
	taskInput.focus();

	checkEmptyList();
}

function deleteTask(event) {
	// Перевіряємо, якщо клік був НЕ по кнопці "видалити справу"
	if (event.target.dataset.action !== 'delete') return;

	const parenNode = event.target.closest('.list-group-item');

	// Визначаємо ID "справи"
	const id = Number(parenNode.id);

	// Видаляємо "справу" через фільтрацію масиву
	tasks = tasks.filter((task) => task.id !== id);

	// Зберігаємо список справ у сховищі браузера localStorage
	saveToLocalStorage();

	// Видаляємо "справу" із розмітки
	parenNode.remove();

	checkEmptyList();
}

function doneTask(event) {
	// Перевіряємо, що клік був НЕ по кнопці "справу виконано"
	if (event.target.dataset.action !== 'done') return;

	const parentNode = event.target.closest('.list-group-item');

	// Визначаємо ID "справи"
	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.done = !task.done;

	// Зберігаємо список справ у сховищі браузера localStorage
	saveToLocalStorage();

	const taskTitle = parentNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/list.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список справ пустий</div>
				</li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	// Формуємо CSS клас
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

	// Формуємо розмітку для нової "справи"
	const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

	// Додаємо "справу" на сторінку
	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
