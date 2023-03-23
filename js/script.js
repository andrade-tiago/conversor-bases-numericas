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
		component.classList.add('input', 'radix');
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
		component.classList.add('input', 'value');
		component.type  = 'text';
		component.value = value.toString(radix).toUpperCase();
		component.addEventListener('keyup', alterValue);
		component.addEventListener('change', alterValue);
		card.appendChild(component);

		component = document.createElement('button');
		component.classList.add('btn', 'copy', 'bi', 'bi-files');
		component.title = 'Copiar valor';
		component.addEventListener('click', toogleIcon);
		component.addEventListener('click', copyValue);
		card.appendChild(component);

		component = document.createElement('button');
		component.classList.add('btn', 'close', 'bi', 'bi-dash-lg');
		component.title = 'Remover card';
		component.addEventListener('click', cardRemove);
		card.appendChild(component);

		cardsGrid.insertBefore(card, addButton.parentNode);

		if (++cardsCount == MAX_CARDS) {
			addButton.disabled = true;
			break;
		}
	}

	numCards.children[0].innerHTML = cardsCount;
	updateSummary();
}

// Remove o cartão do qual o botão de remover fora clicado
const cardRemove = event => {
	cardsGrid.removeChild(event.target.parentNode);
	numCards.children[0].innerHTML = --cardsCount;
	addButton.disabled = false;
	updateSummary();
}

// Atualiza o valor do card ao mudar a base
const updateValue = event => {
	const element = event.target;
	let radix = parseInt(element.value);

	if (radix < MIN_RADIX)
		element.value = radix = MIN_RADIX;
	else if (radix > MAX_RADIX)
		element.value = radix = MAX_RADIX;
	
	element.parentNode.children[3].value =
		value.toString(radix).toUpperCase();
	
	updateSummary();
}

// Atualiza o valor em todos os cards
const alterValue = event => {
	const card = event.target.parentNode;

	value = parseInt(
		card.children[3].value,
		card.children[1].value
	);

	if (isNaN(value)) value = 0;

	for (const card of document.getElementsByClassName('number'))
		card.children[3].value = value
			.toString(card.children[1].value)
			.toUpperCase();
	
	updateSummary();
}

// Copiar valor do card
const copyValue = event => {
	navigator.clipboard.writeText(
		event.target.parentNode.children[3].value
	);
}

// Alterar ícone do botão
const toogleIcon = event => {
	const copyButton = event.target;
	copyButton.classList.remove('bi-files');
	copyButton.classList.add('bi-check2-square');

	copyButton.addEventListener('blur', restoreIcon);
}

// Devolver o ícone original
const restoreIcon = event => {
	const copyButton = event.target;
	copyButton.classList.remove('bi-check2-square');
	copyButton.classList.add('bi-files');

	copyButton.removeEventListener('blur', restoreIcon);
}

// Atualiza o resumo
const updateSummary = () => {
	summary.innerHTML = '';

	if (cardsCount) {
		summaryCopy.disabled = false;

		for (const card of document.getElementsByClassName('number')) {
			const li = document.createElement('li');

			li.innerHTML =
				'Base '
				+ card.children[1].value.padStart(NUM_DIGITS_OF_MAX_RADIX, '0')
				+ ': '
				+ card.children[3].value;
			
			summary.appendChild(li);
		}
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

numCards.children[1].innerHTML = MAX_CARDS;
addCards(10, 16);
for (const yearSpace of document.getElementsByClassName('current-year'))
	yearSpace.innerHTML = new Date().getFullYear();

addButton.addEventListener('click', () => addCards());

summaryCopy.addEventListener('click', () =>
	navigator.clipboard.writeText(getSummaryText())
);
summaryCopy.addEventListener('click', toogleIcon);

if (typeof navigator.share === "function") {
	summaryShare.addEventListener('click', () =>
		navigator.share({
			title: document.title,
			text: getSummaryText(),
			url: window.location.href
		})
	);
} else summaryShare.disabled = true;