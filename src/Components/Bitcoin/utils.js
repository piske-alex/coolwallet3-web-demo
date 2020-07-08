const TxBytes = {
	EMPTY: 10,
	INPUT_BASE: 41,
	OUTPUT_BASE: 9,

	P2PKH_IN_SCRIPT: 107,
	P2PKH_OUT_SCRIPT: 25,
	P2PKH_DUST_THRESHOLD: 546,

	P2SH_P2WPKH_IN_SCRIPT: 23 + 27, // 27 : segwit
	P2SH_P2WPKH_OUT_SCRIPT: 23,
	P2SH_P2WPKH_DUST_THRESHOLD: 294,

	P2WPKH_IN_SCRIPT: 0 + 27, // 27 : segwit
	P2WPKH_OUT_SCRIPT: 22,
	P2WPKH_DUST_THRESHOLD: 294,
}

const ScriptType = {
	P2PKH: 0,
	P2SH_P2WPKH: 1,
	P2WPKH: 2,
	P2WSH: 3,
}

export function coinSelect(utxos, inputScriptType, output, outputScriptType, changeAddressIndex, feeRate) {
	console.log('inputScriptType :', inputScriptType);
	console.log('outputScriptType :', outputScriptType);

	let inScriptBytes;
	let changeScriptBytes;
	let changeDustThreshold;
	if (inputScriptType === ScriptType.P2PKH) {
		inScriptBytes = TxBytes.P2PKH_IN_SCRIPT;
		changeScriptBytes = TxBytes.P2PKH_OUT_SCRIPT;
		changeDustThreshold = TxBytes.P2PKH_DUST_THRESHOLD;
	} else if (inputScriptType === ScriptType.P2SH_P2WPKH) {
		inScriptBytes = TxBytes.P2SH_P2WPKH_IN_SCRIPT;
		changeScriptBytes = TxBytes.P2SH_P2WPKH_OUT_SCRIPT;
		changeDustThreshold = TxBytes.P2SH_P2WPKH_DUST_THRESHOLD;
	} else if (inputScriptType === ScriptType.P2WPKH) {
		inScriptBytes = TxBytes.P2WPKH_IN_SCRIPT;
		changeScriptBytes = TxBytes.P2WPKH_OUT_SCRIPT;
		changeDustThreshold = TxBytes.P2WPKH_DUST_THRESHOLD;
	} else {
		throw new Error('no inputScriptType parameter');
	}
	let outScriptBytes;
	let outDustThreshold;
	if (outputScriptType === ScriptType.P2PKH) {
		outScriptBytes = TxBytes.P2PKH_OUT_SCRIPT;
		outDustThreshold = TxBytes.P2PKH_DUST_THRESHOLD;
	} else if (outputScriptType === ScriptType.P2SH_P2WPKH) {
		outScriptBytes = TxBytes.P2SH_P2WPKH_OUT_SCRIPT;
		outDustThreshold = TxBytes.P2SH_P2WPKH_DUST_THRESHOLD;
	} else if (outputScriptType === ScriptType.P2WPKH) {
		outScriptBytes = TxBytes.P2WPKH_OUT_SCRIPT;
		outDustThreshold = TxBytes.P2WPKH_DUST_THRESHOLD;
	} else {
		throw new Error('no outputScriptType parameter');
	}

	if (parseInt(output.value) < outDustThreshold) throw new Error('output value too low');

	const sortedUtxos = utxos.concat().sort(function (a, b) {
		return (parseInt(a.preValue) < parseInt(b.preValue)) ? -1 : 1;
	});

	const baseBytes = TxBytes.EMPTY + TxBytes.OUTPUT_BASE + outScriptBytes;
	console.log('baseBytes :', baseBytes);
	let fee = baseBytes * feeRate;
	console.log('fee :', fee);
	let inAccum = 0;
	let inputs = [];

	for (let i = 0; i < sortedUtxos.length; i++) {
		const utxo = sortedUtxos[i];
		const inputBytes = TxBytes.INPUT_BASE + inScriptBytes;
		fee += inputBytes * feeRate;
		console.log('fee :', fee);
		inAccum += parseInt(utxo.preValue);
		console.log('inAccum :', inAccum);
		inputs.push(utxo);

		const remainder = inAccum - (parseInt(output.value) + fee);
		console.log('remainder :', remainder);

		if (remainder < 0) continue;

		const changeBytes = TxBytes.OUTPUT_BASE + changeScriptBytes;
		const changeFee = changeBytes * feeRate;

		if (remainder < changeDustThreshold + changeFee) {
			fee += remainder;
			return { inputs, fee };
		} else {
			fee += changeFee;
			const change = { value: (remainder - changeFee).toString(), addressIndex: changeAddressIndex };
			return { inputs, fee, change };
		}
	}
	return { fee };
};
