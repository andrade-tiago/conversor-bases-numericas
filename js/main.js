(() => {
	const
		MIN_RADIX = 2,
		MAX_RADIX = 36,
		MIN_ROWS = 2;
		MAX_ROWS = 35,
		RADIX_DIGITS = MAX_RADIX.toString().length,
		DATA = JSON.parse(localStorage.getItem('data')) || [],
		DEFAULT_ROWS = [10, 16, 2];

	const
		$addRow = document.getElementById('add-row'),
		$dataCount = document.getElementById('data-count'),
		$table = document.getElementById('converter');

	let
		value = JSON.parse(localStorage.getItem('value')) || 255;
		darkMode = JSON.parse(localStorage.getItem('dark-mode')) || false;

	// Atualiza os valores da tabela
	const updateValueInputs = () => {
		$table.querySelectorAll('[data-value]').forEach((rowValue, key) => {
			rowValue.value = value.toString(DATA[key].radix).toUpperCase();
		});

		localStorage.setItem('value', JSON.stringify(value));
	};

	// Cria um objeto data e adiciona uma linha à tabela
	const createDataObj = radix => {
		const obj = {
			id: DATA.length ? (DATA[DATA.length - 1].id + 1) : 0,
			radix: radix
		};

		DATA.push(obj);
		localStorage.setItem('data', JSON.stringify(DATA));
		addRow(obj);
	};

	// Adiciona uma linha à tabela
	const addRow = (dataObj) => {
		dataObj.radix = parseInt(dataObj.radix);

		const row = document.createElement('tr');
		row.dataset.id = dataObj.id;

		// Coluna Valor
		const data1 = document.createElement('td');

		data1.appendChild(inputRadix(dataObj));
		row.appendChild(data1);

		// Coluna Base
		const data2 = document.createElement('td');
		data2.colSpan = 2;

		data2.appendChild(inputValue(dataObj));
		row.appendChild(data2);

		// Coluna Opções
		const data3 = document.createElement('td');
		data3.appendChild(copyVelueBtn(dataObj.id));
		row.appendChild(data3);

		const data4 = document.createElement('td');
		data4.appendChild(deleteDataBtn(dataObj.id));
		row.appendChild(data4);

		$table.tBodies[0].appendChild(row);
		$dataCount.innerHTML = DATA.length;
	};

	// Cria o input para a base
	const inputRadix = dataObj => {
		const input = document.createElement('input');
		input.type = 'number';
		input.title = 'Base: clique para editar';
		input.min = MIN_RADIX;
		input.max = MAX_RADIX;
		input.value = dataObj.radix;
		input.dataset.radix = '';

		// Alterar representação do valor ao modificar base
		input.addEventListener('change', () => {
			let radix = parseInt(input.value) || 10;

			if (radix < MIN_RADIX)
				radix = MIN_RADIX;
			else if (radix > MAX_RADIX)
				radix = MAX_RADIX;

			DATA[DATA.findIndex(item => item.id === dataObj.id)].radix = input.value = radix;
			localStorage.setItem('data', JSON.stringify(DATA));

			$table.querySelector(`[data-id="${dataObj.id}"] [data-value]`).value =
				value.toString(radix).toUpperCase();
		});

		return input;
	};

	// Cria o input para o valor
	const inputValue = dataObj => {
		const input = document.createElement('input');
		input.type = 'text';
		input.title = 'Valor: clique para editar';
		input.value = value.toString(dataObj.radix).toUpperCase();
		input.dataset.value = '';

		// Atualizar o valor dos inputs em tempo real
		input.addEventListener('keyup', () => {
			value = parseInt(
				input.value,
				DATA[DATA.findIndex(item => item.id === dataObj.id)].radix
			) || 0;

			updateValueInputs();
		});

		return input;
	};

	// Cria o botão para excluir linha
	const deleteDataBtn = id => {
		const button = document.createElement('button');
		button.classList.add('btn', 'btn-trash', 'fa-regular', 'fa-trash-can', 'ruby');
		button.title = 'Excluir linha';

		// Deletar a linha e os dados relacionados
		button.addEventListener('click', () => {
			DATA.splice(DATA.findIndex(element => element.id === id), 1);
			localStorage.setItem('data', JSON.stringify(DATA));
			
			$table.querySelector(`[data-id="${id}"]`).remove();
			$dataCount.innerHTML = DATA.length;
			optinsActiveManager();
		});

		return button;
	};

	// Cria botão de copiar valor
	const copyVelueBtn = id => {
		const button = document.createElement('button');
		button.classList.add('btn', 'btn-copy', 'fa', 'fa-clone', 'gold');
		button.title = 'Copiar valor';

		button.addEventListener('click', () => {
			navigator.clipboard.writeText(
				document.querySelector(`[data-id="${id}"] [data-value]`).value
			);

			btnCopyInteraction(button);
		});

		return button;
	};

	// Mudar ícone dos botões de copiar
	const btnCopyInteraction = button => {
		const
			class1 = 'fa-clone',
			class2 = 'fa-clipboard-check';

		if (!button.classList.contains(class1)) return;

		button.classList.replace(class1, class2);

		const title = button.title;
		button.title = 'Copiado!';

		const blurFunc = () => {
			button.classList.replace(class2, class1);
			button.title = title;

			button.removeEventListener('blur', blurFunc);
		};

		button.addEventListener('blur', blurFunc);
	};

	// Gerencia a disponibilidade das opções da tabela
	const optinsActiveManager = () => {
		$table.querySelectorAll('.btn-trash').forEach(btn =>
			btn.disabled = (DATA.length <= MIN_ROWS)
		);

		$addRow.disabled = (DATA.length >= MAX_ROWS);
	};

	// Retorna uma string representando as convesões na tabela
	const getTableContent = () => {
		let str = '';

		DATA.forEach(obj => {
			str += `Base ${
				obj.radix.toString().padStart(RADIX_DIGITS, '0')
			}: ${
				value.toString(obj.radix).toUpperCase()
			}\r\n`;
		});

		return str;
	};

	// Alterna entre os modos diurno e noturno da página
	const alterDarkMode = () => {
		document.body.classList.toggle('dark');
	};

	// Opção de alterar tema da página
	document.getElementById('theme').addEventListener('click', () => {
		alterDarkMode();
		darkMode = !darkMode;
		localStorage.setItem('dark-mode', JSON.stringify(darkMode));
	});

	// Opção de adicionar linha (adicionará uma base ausente)
	$addRow.addEventListener('click', () => {
		const proc = radix => {
			if (!DATA.find(obj => obj.radix === radix)) {
				createDataObj(radix);
				optinsActiveManager();
				return true;
			}

			return false;
		};

		if (DATA.length < MAX_ROWS) {
			for (radix of DEFAULT_ROWS) {
				if (proc(radix)) return;
			}

			for (let radix = MIN_RADIX; radix <= MAX_RADIX; radix++) {
				if (proc(radix)) return;
			}
		}
	});

	// Opção de somar 1 ao valor
	document.getElementById('sum').addEventListener('click', () => {
		value++;

		updateValueInputs();
	});

	// Opção de substrair 1 do valor
	document.getElementById('substract').addEventListener('click', () => {
		value--;

		updateValueInputs();
	});

	// Copiar conversões
	document.getElementById('data-copy').addEventListener('click', function() {
		navigator.clipboard.writeText(getTableContent());

		btnCopyInteraction(this);
	});

	// Opção de compartilhar conversões
	const shareBtn = document.getElementById('data-share');
	if (typeof navigator.share === 'function') {
		shareBtn.addEventListener('click', () => {
			navigator.share({
				title: document.title,
				text: getTableContent(),
				url: window.location.href
			});
		});
	} else shareBtn.disabled = true;

	// Preencher elementos que citem o ano
	const CURRENT_YEAR = new Date().getFullYear();
	document.querySelectorAll('.year').forEach(element => element.innerHTML = CURRENT_YEAR);
	document.getElementById('data-limit').innerHTML = MAX_ROWS;

	// Gerar dados iniciais da tabela
	if (DATA.length)
		DATA.forEach(item => addRow(item));
	else
		DEFAULT_ROWS.forEach(radix => createDataObj(radix));
	
	// Configurações iniciais
	if (darkMode) alterDarkMode();
	optinsActiveManager();
})();