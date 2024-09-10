// Связи между блоками
const blockConnections = {
    'main-block': ['HTML-block', 'CSS-block', 'JS-block', 'React-block'],
    'HTML-block': ['HTML-base', 'HTML-formats', 'HTML-semantic', 'HTML-forms', 'HTML-img', 'HTML-links', 'HTML-meta', 'HTML-connection', 'HTML-atributes'],
    'CSS-block': ['CSS-base', 'CSS-selectors', 'CSS-pseudoC', 'CSS-pseudoE', 'CSS-func', 'CSS-dir', 'CSS-global', 'CSS-colors', 'CSS-measure', 'CSS-animations', 'CSS-transform', 'CSS-background', 'CSS-text', 'CSS-fonts', 'CSS-padding', 'CSS-position', 'CSS-list', 'CSS-flex', 'CSS-grid', 'CSS-allign', 'CSS-forms', 'CSS-important', 'CSS-visibility', 'CSS-overflow', 'CSS-float', 'CSS-img', 'CSS-border', 'CSS-interface', 'CSS-svg', 'CSS-custom', 'CSS-widows', 'CSS-table', 'CSS-counter', 'CSS-other'],
    'JS-block' : ['JS-base', 'JS-sintaxis', 'JS-type', 'JS-collections', 'JS-number', 'JS-string', 'JS-bool', 'JS-function', 'JS-array', 'JS-objects', 'JS-set', 'JS-exeptions', 'JS-Math', 'JS-API', 'JS-DOM', 'JS-document', 'JS-element', 'JS-storage', 'JS-safe', 'JS-async', 'JS-app', 'JS-solve', 'JS-other']
};

// Получение всех перемещаемых элементов
const draggableElements = document.querySelectorAll('.draggable');
const line = document.getElementById('line');

// Функция для обновления линии между указанными блоками
function updateLine() {
    line.innerHTML = '';

    Object.keys(blockConnections).forEach(parentId => {
        const parentBlock = document.getElementById(parentId);
        const childBlocks = blockConnections[parentId];

        if (parentBlock && childBlocks) {
            childBlocks.forEach(childId => {
                const childBlock = document.getElementById(childId);
                if (childBlock) {
                    const parentRect = parentBlock.getBoundingClientRect();
                    const childRect = childBlock.getBoundingClientRect();

                    const { x1, y1, x2, y2 } = getLineEndPoints(parentRect, childRect);

                    const svgNS = "http://www.w3.org/2000/svg";
                    const lineElement = document.createElementNS(svgNS, "line");
                    lineElement.setAttribute('x1', x1);
                    lineElement.setAttribute('y1', y1);
                    lineElement.setAttribute('x2', x2);
                    lineElement.setAttribute('y2', y2);
                    lineElement.setAttribute('stroke', '#000');
                    lineElement.setAttribute('stroke-width', '2');
                    line.appendChild(lineElement);
                }
            });
        }
    });
}

// Функция для вычисления угловой точки пересечения линии с границей блока
function getLineEndPoints(rect1, rect2) {
    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;

    const dx = x2 - x1;
    const dy = y2 - y1;

    // Угол линии
    const angle = Math.atan2(dy, dx);

    const rect1EdgeX = x1 + (rect1.width / 2) * Math.cos(angle);
    const rect1EdgeY = y1 + (rect1.height / 2) * Math.sin(angle);

    const rect2EdgeX = x2 - (rect2.width / 2) * Math.cos(angle);
    const rect2EdgeY = y2 - (rect2.height / 2) * Math.sin(angle);

    return {
        x1: rect1EdgeX,
        y1: rect1EdgeY,
        x2: rect2EdgeX,
        y2: rect2EdgeY
    };
}

// Функция для проверки пересечения и корректировки позиции всех блоков
function checkCollision(element, draggableElements) {
    const rect = element.getBoundingClientRect();
    draggableElements.forEach(otherElement => {
        if (element === otherElement) return;

        const otherRect = otherElement.getBoundingClientRect();

        if (
            rect.left < otherRect.right &&
            rect.right > otherRect.left &&
            rect.top < otherRect.bottom &&
            rect.bottom > otherRect.top
        ) {
            const dx = Math.min(rect.right - otherRect.left, otherRect.right - rect.left);
            const dy = Math.min(rect.bottom - otherRect.top, otherRect.bottom - rect.top);
            const offset = 1; // Увеличенный отступ при пересечении

            // Определение направления отталкивания
            if (dx > dy) {
                if (rect.top < otherRect.top) {
                    otherElement.style.top = (otherElement.offsetTop + dy + offset) + 'px';
                } else {
                    otherElement.style.top = (otherElement.offsetTop - dy - offset) + 'px';
                }
            } else {
                if (rect.left < otherRect.left) {
                    otherElement.style.left = (otherElement.offsetLeft + dx + offset) + 'px';
                } else {
                    otherElement.style.left = (otherElement.offsetLeft - dx - offset) + 'px';
                }
            }
        }
    });
}

// Функция для начала перемещения
function startDrag(e) {
    const element = e.target.closest('.draggable');
    if (!element) return;

    let offsetX = e.clientX - element.getBoundingClientRect().left;
    let offsetY = e.clientY - element.getBoundingClientRect().top;

    function onMouseMove(e) {
        // Расчет новых координат
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;

        // Получение размеров окна
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Ограничение координат так, чтобы блок не выходил за границы
        const maxLeft = viewportWidth - element.offsetWidth;
        const maxTop = viewportHeight - element.offsetHeight;

        element.style.left = `${Math.min(Math.max(newLeft, 0), maxLeft)}px`;
        element.style.top = `${Math.min(Math.max(newTop, 0), maxTop)}px`;

        updateLine(); // Обновляем линии
        checkCollision(element, document.querySelectorAll('.draggable')); // Проверяем на пересечение
    }

    function stopDrag() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', stopDrag);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDrag);
}

// Инициализация обработчиков событий для всех элементов с классом .draggable
document.querySelectorAll('.draggable').forEach(element => {
    element.addEventListener('mousedown', startDrag);
});

// Обновляем линии после загрузки страницы
window.onload = () => {
    updateLine();
};