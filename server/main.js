import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import { Mongo } from 'meteor/mongo';

const SubtitlesLines = new Mongo.Collection('subtitlesLines'); 

Meteor.startup(() => {
  	const data = fs.readFileSync("/home/tgmarinho/Downloads/New.Girl.S01E01.srt", "utf8") 
	const lines = data.split('\n');
	console.log(lines.length);

	let i = 0;
	while(i <lines.length)
		const subtitleNumber = parseInt(lines[i++]);
		const [timeStart, timeEnd] = lines[i++].split('-->');
		let text = lines[i++];
		
		while(lines[i++]) {
			text += lines[i-1];
		}

		console.log('number ',subtitleNumber);
		console.log('start ',timeStart);
		console.log('end ',timeEnd);
		console.log('text ', text);
		

	}
});

