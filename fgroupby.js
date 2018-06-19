function fGroupBy(options) {		
	if (options.log) console.log('---------------------');
	if (options.log) console.log(options);
	
	const groups = {};

	function stringArray(value) {
		// if the value is a string, turn it into an array of one element
		let list = (typeof value == 'string') ? [value] : value;
		if (list && list.forEach) {
			// then break all the elements that have commas into new elements
			let full = [];
			list.forEach(vlr => full.push(...vlr.split(',')));
			return full;
		} else {
			return list;
		}
	}

	const fields = stringArray(options.fields) || [];
	const sums = stringArray(options.sum);
	const avgs = stringArray(options.avg);
	const mins = stringArray(options.min);
	const maxs = stringArray(options.max);
	const exists = stringArray(options.exist);
	
	let counts = stringArray(options.count);	
	if (counts === true) counts = ['____count'];
	
	// getting the type of the fields on the dataset
	const fieldTypes = {};	
	options.data.forEach(row => {
		fields.forEach(field => {
			let value = row[field];
			if (typeof value !== 'undefined') {
				let type = value.constructor.name;
				if (!fieldTypes[field]) fieldTypes[field] = {};
				if (!fieldTypes[field][type]) fieldTypes[field][type] = 0;
				fieldTypes[field][type]++;
			}
		});
	});
	
	// getting the expected type for each field
	const expectedType = {};
	fields.forEach(field => {
		// getting the types found for this field
		var types = fieldTypes[field];
		// making that object of types into a array of types
		var atypes = Object.keys(types).map(t => ({type:t, qty:types[t]}));
		// and getting the most common one
		atypes.sort((a,b) => a.qty < b.qty ? +1 : -1 );
		expectedType[field] = atypes[0].type;
	});
	
	options.data.forEach(row => {
		// generating the key for the row
		const key = {};		
		fields.forEach(field => { 
			var value = row[field];
			if (!value) {
				if (expectedType[field] == 'Boolean') value = false;
			}
			key[field] = value;
		});
		const skey = JSON.stringify(key);		
		row.____count = 1;
		// getting the group based on its key or initializating it in case it's its first time
		const g = groups[skey] || {key:key,rows:[]};
		groups[skey] = g;		
		// adding the current row to it 
		groups[skey].rows.push(row);
		// processing sums
		if (sums) sums.forEach(field => {
			if (!g.sums) g.sums = {};
			if (!g.sums[field]) g.sums[field] = {value:0};
			g.sums[field].value += row[field];
		});
		// processing avgs
		if (avgs) avgs.forEach(field => {
			if (!g.avgs) g.avgs = {};
			if (!g.avgs[field]) g.avgs[field] = {total:0, count:0};
			g.avgs[field].total += row[field];
			g.avgs[field].count += 1;
			g.avgs[field].value = g.avgs[field].total/g.avgs[field].count;
		});
		// processing mins
		if (mins) mins.forEach(field => {
			if (!g.mins) g.mins = {};
			if (!g.mins[field]) g.mins[field] = {value:null};
			const now = g.mins[field].value;
			if (now === null || row[field] < now) g.mins[field].value = row[field];
		});
		// processing maxs
		if (maxs) maxs.forEach(field => {
			if (!g.maxs) g.maxs = {};
			if (!g.maxs[field]) g.maxs[field] = {value:null};
			const now = g.maxs[field].value;
			if (now === null || row[field] > now) g.maxs[field].value = row[field];
		});
		// processing exists
		if (exists) exists.forEach(field => {
			if (!g.exists) g.exists = {};
			if (!g.exists[field]) g.exists[field] = {value:0};
			if (typeof row[field] != 'undefined') g.exists[field].value += 1;
		});
		// processing counts
		if (counts) counts.forEach(field => {
			if (!g.counts) g.counts = {};
			if (!g.counts[field]) g.counts[field] = {value:0};
			if (row[field]) g.counts[field].value += 1;
		});
		
		delete row.____count;
	});
	
	function addDataValue(g,atr,field) {
		const sblock = atr+'s';
		let sfield = field;
		if (sfield == '____count') sfield = 'count';
		const outfield = (options.pure) ? sfield : atr+'_'+sfield;
		g.output[outfield] = (g[sblock] && g[sblock][field]) ? g[sblock][field].value : null;
	}

	const output = [];

	// generating output
	Object.keys(groups).forEach(skey => {
		const g = groups[skey];				
		g.output = JSON.parse(skey);

		if (sums) sums.forEach(field => addDataValue(g,'sum',field));
		if (avgs) avgs.forEach(field => addDataValue(g,'avg',field));
		if (mins) mins.forEach(field => addDataValue(g,'min',field));
		if (maxs) maxs.forEach(field => addDataValue(g,'max',field));
		if (exists) exists.forEach(field => addDataValue(g,'exist',field));
		if (counts) counts.forEach(field => addDataValue(g,'count',field));

		if (options.rows) g.output.rows = g.rows.splice(0);

		if (options.log) console.log(g.output);
		output.push(g.output);
	});	
	
	output.sort((a,b) => {
		var multipliers = fields.map(field => a[field] < b[field] ? -1 : +1);
		var values = multipliers.map((multi,i) => multi * (multipliers.length-i));
		var total = values.reduce((x,y) => x+y,0);
		return total;
	});
	
	return output;
}

Array.prototype.groupby = function(p1,p2) {
	
	let opts = {};
	
	// if a single string was passed 
	if (p1 && p1.constructor === String && !p2) {
		// assume this is a count-by-the-parameter
		opts = {
			fields: p1,
			count: true,
			pure: true
		};
	}
	
	// if the first param is a string and the second is an object
	if (p1 && p1.constructor === String && p2 && p2.constructor === Object) {
		// assume the string is the first  param
		opts = p2;
		p2.fields = p1;
	}
	
	// if the first param is an object
	if (p1 && p1.constructor === Object) {
		// assume the whole thing is contained on the first param
		opts = p1;
	}
	
	// adding the array as the data
	opts.data = JSON.parse(JSON.stringify(this));
	return fGroupBy(opts);	
};