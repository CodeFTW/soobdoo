import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import SubtitlesLines from '/model/SubtitlesLines';
import SubtitlesWords from '/model/SubtitlesWords';

Meteor.startup(() => {
      const data = fs.readFileSync("/home/tgmarinho/Documentos/workspace/soobdoo/subtitles/New.Girl.S01E01-2.srt", "utf8")
    const lines = data.split('\n');

    let i = 0;
    while(i < lines.length) {
        const subtitleNumber = parseInt(lines[i++].trim());
        if(!subtitleNumber) {
        	break;
        }
        const [timeStart, timeEnd] = lines[i++].split('-->');
        let text = lines[i++];

        while(i < lines.length && lines[i].trim() !== '') {
            text += lines[i];
            ++i;
        }
        ++i;
		let secondStart = timeStart.split(':')[2].split(',')[0];
		secondStart = secondStart.indexOf('0') !== -1 ? secondStart.substring(1) : secondStart;
		secondStart = parseInt(secondStart);

    text = text.replace('\r', '');
        text = text.replace(',', '');
            text = text.replace('.', '');
                text = text.replace('-', '');
        //TODO verificar qual eh a legenda
        const result = SubtitlesLines.upsert({subtitleNumber},
        {
        	subtitleNumber,
        	timeStart,
        	secondStart,
        	timeEnd,
        	text,
        });

        text.split(' ').forEach(word => {
          word = word.toLowerCase();
          const subtitleWord = SubtitlesWords.findOne({word});
          if(subtitleWord) {
            SubtitlesWords.update({word}, {$inc: {frequency: 1}});
          } else {
            SubtitlesWords.insert({word, frequency: 1});
          }
        });
    }
});
