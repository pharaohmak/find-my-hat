const hat = '🎩';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field = [[]]) {
        this.field = field;
        this.start = { x: 0, y: 0 };
        this.hatPos = { x: 0, y: 0 };
        this.locationX = 0;
        this.locationY = 0;
    }

    setPos(offLimit = { x: 0, y: 0 }) {
        const pos = { x: 0, y: 0 };
        do {
            pos.x = Math.floor(Math.random() * this.field[0].length);
            pos.y = Math.floor(Math.random() * this.field.length);
        } while (pos.x === offLimit.x && pos.y === offLimit.y);
        return pos;
    }

    setStart() {
        this.start = this.setPos();
        this.locationX = this.start.x;
        this.locationY = this.start.y;
        this.field[this.start.y][this.start.x] = pathCharacter;
    }

    setHat() {
        this.hatPos = this.setPos(this.start);
        this.field[this.hatPos.y][this.hatPos.x] = hat;
    }

    runGame(hard = false) {
        this.setStart();
        this.setHat();
        this.updateBoard();

        if (hard) {
            this.addHoles();
        }
    }

    updateBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        this.field.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.textContent = row.join('');
            gameBoard.appendChild(rowDiv);
        });
    }

    movePlayer(direction) {
        switch (direction) {
            case 'U':
                this.locationY -= 1;
                break;
            case 'D':
                this.locationY += 1;
                break;
            case 'L':
                this.locationX -= 1;
                break;
            case 'R':
                this.locationX += 1;
                break;
        }

        if (!this.isInBounds()) {
            document.getElementById('status').textContent = 'Out of bounds!';
        } else if (this.isHole()) {
            document.getElementById('status').textContent = 'Sorry, you fell down a hole.';
        } else if (this.isHat()) {
            document.getElementById('status').textContent = 'Congrats, you found your hat!';
        } else {
            this.field[this.locationY][this.locationX] = pathCharacter;
            this.updateBoard();
        }
    }

    isInBounds() {
        return (
            this.locationY >= 0 &&
            this.locationX >= 0 &&
            this.locationY < this.field.length &&
            this.locationX < this.field[0].length
        );
    }

    isHat() {
        return this.field[this.locationY][this.locationX] === hat;
    }

    isHole() {
        return this.field[this.locationY][this.locationX] === hole;
    }

    addHoles() {
        const numHoles = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numHoles; i++) {
            let holePos = this.setPos(this.hatPos);
            this.field[holePos.y][holePos.x] = hole;
        }
    }

    static generateField(fieldH, fieldW, percentage = 0.1) {
        const field = new Array(fieldH).fill(0).map(() => new Array(fieldW));
        for (let y = 0; y < fieldH; y++) {
            for (let x = 0; x < fieldW; x++) {
                field[y][x] = Math.random() > percentage ? fieldCharacter : hole;
            }
        }
        return field;
    }
}

const myField = new Field(Field.generateField(10, 10, 0.2));
myField.runGame(true);

function move(direction) {
    myField.movePlayer(direction);
}