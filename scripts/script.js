 // Функция для перетаскивания блоков
const blocks = document.querySelectorAll('.mind-map__block');

blocks.forEach(block => {
    block.addEventListener('dragstart', () => {
        block.classList.add('dragging');
    });

    block.addEventListener('dragend', () => {
        block.classList.remove('dragging');
    });
});

const container = document.querySelector('.mind-map__container');

container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const dragging = document.querySelector('.dragging');
    if (afterElement == null) {
        container.appendChild(dragging);
    } else {
        container.insertBefore(dragging, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.mind-map__block:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}