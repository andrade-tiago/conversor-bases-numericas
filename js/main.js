const
	MIN_RADIX = 2,
	MAX_RADIX = 36,
	CARDS = [];

const
	cardsElement = document.getElementById('cards');

let
	value = 255;

// Adicionar card ao grid
const addCard = (radix = 10, ... cardRadixes) => {
	cardRadixes.unshift(radix);

	for (radix of cardRadixes) {
		try {

			const obj = {
				id:    CARDS.length ? (CARDS[CARDS.length - 1].id + 1) : 0,
				radix: radix
			};
			CARDS.push(obj);
	
			const card = document.createElement('div');
			card.classList.add('card');
	
			// Base
			const label1 = document.createElement('label');
			label1.htmlFor   = `r-${obj.id}`;
			label1.innerText = 'Base:';
	
			const input1 = document.createElement('input');
			input1.id    = `r-${obj.id}`;
			input1.value = radix;
			input1.dataset.radix = '';

			card.appendChild(label1);
			card.appendChild(input1);
	
			// Valor
			const label2 = document.createElement('label');
			label2.htmlFor   = `v-${obj.id}`;
			label2.innerText = 'Valor:';
	
			const input2 = document.createElement('input');
			input2.id    = `v-${obj.id}`;
			input2.value = value.toString(radix).toUpperCase();
			input2.dataset.value = ''

			card.appendChild(label2);
			card.appendChild(input2);

			// Opções
			const copy = document.createElement('button');
			copy.classList.add('btn-copy');

			const close = document.createElement('button');
			close.classList.add('btn-close');
	
			card.appendChild(copy);
			card.appendChild(close);

			// Adição do card
			cardsElement.appendChild(card);
		} catch (ex) {
			console.error('Oops:', ex.message);
		}

	}
};

document.getElementById('theme').addEventListener('click', () => {
	document.body.classList.toggle('dark');
});

document.getElementById('add').addEventListener('click', () => {
	addCard();
});

for (let i = 0; i < 10; i++)
	addCard()