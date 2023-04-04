const
	MIN_RADIX               = 2,
	MAX_RADIX               = 36,
	MAX_CARDS               = MAX_RADIX - MIN_RADIX + 1,
	NUM_DIGITS_OF_MAX_RADIX = Math.floor(Math.log10(MAX_RADIX)) + 1,

	numCards     = document.getElementById('num-cards'),
	cardsGrid    = document.getElementById('cards-grid'),
	addButton    = document.querySelector('#add button'),
	summary      = document.getElementById('summary'),
	summaryCopy  = document.getElementById('summary-copy'),
	summaryShare = document.getElementById('summary-share');

let
	cardsCount = 0,
	value      = 255;

// FUNÇÕES E PROCEDIMENTOS

// Adiciona um ou mais cards ao grid
const addCards = (... radixes) => {
	if (!radixes.length) radixes = [10];

	for (const radix of radixes) {
		if (radix < MIN_RADIX || radix > MAX_RADIX) continue;

		const card = document.createElement('div');
		card.classList.add('card', 'number');

		let component;

		component = document.createElement('span');
		component.textContent = 'Base:';
		card.appendChild(component);

		component = document.createElement('input');
		component.classList.add('input');
		component.dataset.radix = '';
		component.type  = 'number';
		component.value = radix;
		component.min   = MIN_RADIX;
		component.max   = MAX_RADIX;
		component.addEventListener('change', updateValue);
		card.appendChild(component);

		component = document.createElement('span');
		component.textContent = 'Valor:';
		card.appendChild(component);

		component = document.createElement('input');
		component.classList.add('input');
		component.dataset.value = '';
		component.type  = 'text';
		component.value = value.toString(radix).toUpperCase();
		component.addEventListener('keyup', alterValue);
		component.addEventListener('change', alterValue);
		card.appendChild(component);

		component = document.createElement('button');
		component.classList.add('btn', 'copy', 'bi', 'bi-files');
		component.title = 'Copiar valor';
		component.addEventListener('click', changeCopyButtonIcon);
		component.addEventListener('blur', changeCopyButtonIcon);
		component.addEventListener('click', copyValue);
		card.appendChild(component);

		component = document.createElement('button');
		component.classList.add('btn', 'close', 'bi', 'bi-dash-lg');
		component.title = 'Remover card';
		component.addEventListener('click', cardRemove);
		card.appendChild(component);

		cardsGrid.insertBefore(card, addButton.parentNode);

		if (++cardsCount === MAX_CARDS) {
			addButton.disabled = true;
			break;
		}
	}

	numCards.children[0].innerHTML = cardsCount;
	updateSummary();
}

// Remove o cartão do qual o botão de remover fora clicado
const cardRemove = event => {
    const card = event.target.parentNode;

	cardsGrid.removeChild(card);
	numCards.children[0].innerHTML = --cardsCount;
	addButton.disabled = false;
	updateSummary();
}

// Atualiza o valor do card ao mudar a base
const updateValue = event => {
	const element = event.target;
	let radix = (element.value === ''? 10: parseInt(element.value));

	if (radix < MIN_RADIX)
		element.value = radix = MIN_RADIX;
	else if (radix > MAX_RADIX)
		element.value = radix = MAX_RADIX;
	
	element.parentNode.querySelector('[data-value]').value =
		value.toString(radix).toUpperCase();
	
	updateSummary();
}

// Atualiza o valor em todos os cards
const alterValue = event => {
	const card = event.target.parentNode;

	value = (() => {
		const content = {
			radix: card.querySelector('[data-radix]').value,
			value: card.querySelector('[data-value]').value
		};

		return (content.value === ''? 0: parseInt(content.value, content.radix));
	})();
	
	cardsGrid.querySelectorAll('.number').forEach(card => {
		card.querySelector('[data-value]').value = value
			.toString(card.querySelector('[data-radix]').value)
			.toUpperCase();
	})
	updateSummary();
}

// Copiar valor do card
const copyValue = event => {
	navigator.clipboard.writeText(
		event.target.parentNode.querySelector('[data-value]').value
	);
}

// Alterar ícone de acordo com o evento
const changeCopyButtonIcon = event => {
	const copyButton = event.target;

	let
		class1 = 'bi-files',
		class2 = 'bi-check2-square';

	if (event.type === 'blur') {
		let aux = class1;
		class1 = class2;
		class2 = aux;
	}
	copyButton.classList.replace(class1, class2);
}

// Atualiza o resumo
const updateSummary = () => {
	summary.innerHTML = '';

	if (cardsCount) {
		summaryCopy.disabled = false;

		cardsGrid.querySelectorAll('.number').forEach(card => {
			const li = document.createElement('li');

			li.innerHTML = `Base ${
				card.querySelector('[data-radix]').value.padStart(NUM_DIGITS_OF_MAX_RADIX, '0')
			}: ${
				card.querySelector('[data-value]').value
			}`;
			
			summary.appendChild(li);
		});
	} else {
		summaryCopy.disabled = true;

		const li = document.createElement('li');
		li.innerHTML = 'Adicione pelo menos um card para ver o resumo.';
		summary.appendChild(li);
	}
}

// Retorna o conteúdo da área de resumo como texto
const getSummaryText = () => {
	return summary.innerHTML
		.replace(/<li>/g, '')
		.replace(/<\/li>/g, '\r\n');
}



// CONFIGURAÇÕES INICIAIS E EVENTOS

numCards.querySelector('[data-max]').innerHTML = MAX_CARDS;

addCards(10, 16);

document.querySelectorAll('.current-year').forEach(yearSpace =>
	yearSpace.innerHTML = new Date().getFullYear()
);

addButton.addEventListener('click', () => addCards());

summaryCopy.addEventListener('click', () =>
	navigator.clipboard.writeText(getSummaryText())
);
summaryCopy.addEventListener('click', changeCopyButtonIcon);
summaryCopy.addEventListener('blur', changeCopyButtonIcon);

if (typeof navigator.share === "function") {
	summaryShare.addEventListener('click', () =>
		navigator.share({
			title: document.title,
			text: getSummaryText(),
			url: window.location.href
		})
	);
} else summaryShare.disabled = true;