const btn = document.querySelector('.btn');
const containerNode = document.querySelector('.fifteen');
const itemNodes = Array.from(document.querySelectorAll('.item'));
const countItems = 16;

if(itemNodes.length !== countItems) {
    throw new Error (`Должно быть ровно ${countItems} items in HTML`);
}

//****   1. POSITION ***********
// получение матрицы из массива исходных чисел-фишек
let matrix =getMatrix(
    itemNodes.map(item => Number(item.dataset.matrixId))); //получение линейного массива исходных чисел-фишек

itemNodes[countItems - 1].style.display = 'none';// скрыть фишку №16

setPositionItems(matrix);// вызов функции для заполнения матрицы фишками

// **** 2. SHUFFLE *****************
// *** Рамдомное перемешивание
document.querySelector('.btn').addEventListener('click', () => {
    const flatMatrix = matrix.flat();// создать плоский массив из матрицы
    const shuffledArr = shuffleArray(flatMatrix);// вызов функции рандомного перемешивания плоского массива
    matrix = getMatrix(shuffledArr); // создание перемешанной матрицы
    setPositionItems(matrix);
});

// **** SMART рандомное перемешивание, т.е. ПРАВИЛЬНОЕ 
// document.querySelector('.btn').addEventListener('click', () => {
// 1. рандомное перемещение фишки на 1 клетку.
// 2. повторить шаг 1 несколько раз


// });

// *** 3.  Change position node by clock  *************

const blankNumber = 16;// номер пустой ячейки в матрице
// вызов события соответствующего клику на фишку
containerNode.addEventListener('click', (event) => {
    buttonNode = event.target.closest('button');
    if (!buttonNode) {
        return;
    }
    const buttonNumber = Number(buttonNode.dataset.matrixId);// число указанное на фишке
    const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix);// определение координат фишки, которую кликнули
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);// определение координат пустой ячейки
    const isValid = isValidForSwap(buttonCoords, blankCoords);// проверка возможности перемещения фишки на пустую ячейку (проверка валидности перемещения)
   
     if (isValid){
        swap (buttonCoords, blankCoords, matrix);// вызов функции перемещения выбранной фишки на свободную ячейку, если такое перемещение валидно (допустимо)
        console.log(buttonCoords);
        console.log(blankCoords);
        setPositionItems(matrix);
    }

});

// ******    ИСПОЛЬЗУЕМЫЕ  ФУНКЦИИ  *************

//** функция для получения матрицы 4x4 из массива **/
function getMatrix(arr){
    const matrix = [[], [], [], []];
     let x = 0; // горизонтальная координата, ось направлена вправо
     let y = 0;  // вертикальная координата, ось направлена вниз
     for (let i=0; i < arr.length; i++){
        if (x == 4) {
            y++;
            x = 0;
        }
        matrix[y][x] = arr[i];
        x++;
     }
     return matrix;
}

// функция для заполнения фишками пространства матрицы
function setPositionItems(matrix){
    for (let y = 0; y < matrix.length; y++){
        for (let x = 0; x < matrix.length; x++){
            const value = matrix[y][x]; // значение фишки = номер фишки
            const node = itemNodes[value - 1];//определение фишки по номеру в массиве
            setNodesStyles(node, x, y); // функция перемещения фишки
        }
    }
}

// функция для перемещения фишки-node по координатам
function setNodesStyles(node, x, y){
    const shiftPs = 100;
    node.style.transform = `translate(${x * shiftPs}%, ${y * shiftPs}%)`;
}

// функция рандомного перемешивания плоского массива
function shuffleArray(arr){
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// функция рандомного перемешивания
// function randomSwap(matrix){

// }

// функция получения координат для нажимаемой фишки 
function findCoordinatesByNumber(number, matrix){
    for (let y = 0; y < matrix.length; y++){
        for (let x = 0; x < matrix.length; x++){
            if (matrix[y][x] === number ) {
                return {x, y};
            }
        }
    }
    return null;
}

// функция проверки возможности перемещения выбранной ячейки (проверка валидности)
function isValidForSwap(coords1, coords2){
    const diffX = Math.abs(coords1.x - coords2.x);
    const diffY = Math.abs(coords1.y - coords2.y);

    return (diffX === 1 && diffY === 0) || (diffX === 0 && diffY === 1);
}

// функция переопределения координат перемещаемой валидной фишки после клика не неё на коордитанты свободной ячейки
function swap (coords1, coords2, matrix){
    const coords1Number = matrix[coords1.y][coords1.x];
    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
    matrix[coords2.y][coords2.x] = coords1Number; 

    if (isWon(matrix) != false){ // проверка на правильность решения задачи
        addWonClass();
    }
}

// плоский масств соответствующий правильному решению задачи
const winFlatArray = new Array(16).fill(0).map((item, index) => index + 1); 

// функция проверки правильности решения задачи 
function isWon(matrix){
    const flatMatrix = matrix.flat();// представление полученной матрицы в плоский массив для сравнения с правильным решением
    for (let i = 0; i < winFlatArray.length; i++){
        if (flatMatrix[i] !== winFlatArray[i]){
            return false;
        }
    }
    console.log('!!!!!');
}

//*** функция для кратковременной подсветки поле фишек в случае успешного решения задачи
const wonMessage = document.createElement('div');// создание нового узла с тегом div
wonMessage.className = "alert"; // задание класса новому узлу
wonMessage.innerHTML = "<strong>Поздравляем, Вы выиграли !!!</strong>";//сообщение победителя
const wonClass = 'fifteenWon';

function addWonClass(){
    setTimeout(() => {
        containerNode.classList.add(wonClass);// вставка класса для подсветки
        btn.classList.add('none');// удаление кнопки "Перемешать"
        btnSuffle.after(wonMessage);// вставка нового узла с надписью

        setTimeout(() =>{ // возврат в исходное полежение через 1 сек.
            containerNode.classList.remove(wonClass);
            btn.classList.remove('none');
            wonMessage.remove();
        }, 1000);
    }, 200);
}


