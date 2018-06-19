# fGroupBy

## What it is
A javascript prototyped method that let you summarize your javascript arrays of objects.

You could look at it as like a simpler/better reduce.

## Is something else required?
Nope. 

## Examples
--------
Let's assume you are an RPG game master and got some information about your players, like this:
```javascript
let mydata = [
	{name: 'Roger', role: 'Warrior', group: 'sat/sun', level: 16, gold: 552, kills: 52, deaths: 8},
	{name: 'Samantha', role: 'Rogue', group: 'sat/sun', level: 15, gold: 1230, kills: 30, deaths: 22},
	{name: 'Grog', role: 'Warrior', group: 'tue/wed', level: 16, gold: 720, kills: 79, deaths: 31},
	{name: 'Nick', role: 'Mage', group: 'tue/wed', level: 15, gold: 1225, kills: 29, deaths: 3},
	{name: 'Bob', role: 'Warrior', group: 'tue/wed', level: 16, gold: 225, kills: 8, deaths: 8, minor: true},
	{name: 'Lisa', role: 'Rogue', group: 'sat/sun', level: 14, gold: 2630, kills: 40, deaths: 12},
	{name: 'Anna', role: 'Mage', group: 'sat/sun', level: 16, gold: 460, kills: 37, deaths: 8, minor: true},
	{name: 'Mark', role: 'Rogue', group: 'tue/wed', level: 15, gold: 112, kills: 22, deaths: 0, minor: true},
	{name: 'Peter', role: 'Priest', group: 'tue/wed', level: 14, gold: 2630, kills: 2, deaths: 12, minor: false}
];
```

Here are some calls you can do to retrieve bits of data:

### Simple Counting
```javascript
mydata.groupby('role');
// returns
[
  {"role": "Mage", "count": 2},
  {"role": "Rogue", "count": 3},
  {"role": "Priest", "count": 1},
  {"role": "Warrior", "count": 3}
]
```

### Counting by more than one field
```javascript
mydata.groupby(['role','minor']);
// returns
[
  {"role": "Mage", "minor": true, "count": 1},
  {"role": "Mage", "minor": false, "count": 1}, 
  {"role": "Priest", "minor": false, "count": 1},
  {"role": "Rogue", "minor": true, "count": 1},
  {"role": "Rogue", "minor": false, "count": 2},
  {"role": "Warrior", "minor": true, "count": 1},
  {"role": "Warrior", "minor": false, "count": 2}
]
```

### Actually returning the rows grouped
If you need the rows, just set the option <b>rows</b> to true.

```javascript
mydata.groupby('group,role',{rows:true});
// returns
[
  {
    "group": "sat/sun",
    "role": "Mage",
    "rows": [
      {"name": "Anna", "role": "Mage", "group": "sat/sun", "level": 16, "gold": 460, "kills": 37, "deaths": 8, "minor": true}
    ]
  },
  {
    "group": "sat/sun",
    "role": "Rogue",
    "rows": [
      {"name": "Samantha", "role": "Rogue", "group": "sat/sun", "level": 15, "gold": 1230, "kills": 30, "deaths": 22},
      {"name": "Lisa", "role": "Rogue", "group": "sat/sun", "level": 14, "gold": 2630, "kills": 40, "deaths": 12}
    ]
  },
  {
    "group": "sat/sun",
    "role": "Warrior",
    "rows": [
      {"name": "Roger", "role": "Warrior", "group": "sat/sun", "level": 16, "gold": 552, "kills": 52, "deaths": 8}
    ]
  },
  {
    "group": "tue/wed",
    "role": "Priest",
    "rows": [
      {"name": "Peter", "role": "Priest", "group": "tue/wed", "level": 14, "gold": 2630, "kills": 2, "deaths": 12, "minor": false}
    ]
  },
  {
    "group": "tue/wed",
    "role": "Rogue",
    "rows": [
      {"name": "Mark", "role": "Rogue", "group": "tue/wed", "level": 15, "gold": 112, "kills": 22, "deaths": 0, "minor": true}
    ]
  },
  {
    "group": "tue/wed",
    "role": "Mage",
    "rows": [
      {"name": "Nick", "role": "Mage", "group": "tue/wed", "level": 15, "gold": 1225, "kills": 29, "deaths": 3}
    ]
  },
  {
    "group": "tue/wed",
    "role": "Warrior",
    "rows": [
      {"name": "Grog", "role": "Warrior", "group": "tue/wed", "level": 16, "gold": 720, "kills": 79, "deaths": 31},
      {"name": "Bob", "role": "Warrior", "group": "tue/wed", "level": 16, "gold": 225, "kills": 8, "deaths": 8, "minor": true}
    ]
  }
]
```

### Calculating Stuff
```javascript
mydata.groupby('role',{sum:'gold,kills',max:'kills',avg:'deaths'});
// returns
[
  {"role": "Mage", "sum_gold": 1685, "sum_kills": 66, "avg_deaths": 5.5, "max_kills": 37},
  {"role": "Priest", "sum_gold": 2630, "sum_kills": 2, "avg_deaths": 12, "max_kills": 2},
  {"role": "Rogue", "sum_gold": 3972, "sum_kills": 92, "avg_deaths": 11.33, "max_kills": 40},
  {"role": "Warrior", "sum_gold": 1497, "sum_kills": 139, "avg_deaths": 15.66, "max_kills": 79}
]
```

### Calculating Stuff²
If you're not calculating the same field multiple times, you can return it without the prefix by setting the option <b>pure</b> to true.
```javascript
mydata.groupby('role',{sum:['deaths','kills'],pure:true});
// returns
[
  {"role": "Mage", "deaths": 11, "kills": 66},
  {"role": "Priest", "deaths": 12, "kills": 2},
  {"role": "Rogue", "deaths": 34, "kills": 92},
  {"role": "Warrior", "deaths": 47, "kills": 139}
]
```

## Usage
Download the package and reference the JavaScript manually:

```html
<!-- fGroupBy (from wherever you copied/pasted it) -->
<script type="text/javascript" src="fgroupby/fgroupby.js"></script>
```

## Parameters
--------
There are 3 forms of calling the groupby method.

Full call:<br>
> mydata.groupby(options);

Fields separared from options:<br>
> mydata.groupby(fields,options);

Shorthand that sets options as {count:true, pure:true};<br>
> mydata.groupby(fields);

The <b>fields</b> parameter can be both an array of fields or a comma-separated string that will be turned into an array (this is "Mixed" type of variable).
The <b>options</b> parameter is an object containing any of the options below.

| Option        | Type			| Default	| Description |
| :-----        | :----         | -------	| :-- |
| data			| Array			| required	| The array of data that will be grouped/summarized. |
| fields		| Mixed			| required* | The fields that will be used to actually group data. If you're using the groupby(fields,options) call, you don't need to add this on the options object again. |
| sum		    | Mixed			| null		| Sum the value of the specificied fields of every row. |
| max			| Mixed			| null		| Get the maximum value found on  the specified fields. |
| min		    | Mixed			| null	    | Get the minimum value found on the specified fields. |
| avg		    | Mixed			| null      | Get the average value found on the specified fields. |
| exist			| Mixed			| null		| Count the rows where the specified fields are <b>present</b>. |
| count			| Mixed			| null		| Count the rows where the specified fields are <b>evaluated as 'true'</b>. This option can also be passed as Boolean/true and that will simply count the rows.  |
| pure			| Boolean		| false		| If set to true, the prefixes (sum_, max_, etc) won't be added to the result. Be careful to not overwrite your data. |
| log			| Boolean		| false		| If set to true, some output will be logged to the console. |


