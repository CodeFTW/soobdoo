import {Meteor} from 'meteor/meteor';
import fs from 'fs';
import SubtitlesLines from '/model/SubtitlesLines';
import SubtitlesWords from '/model/SubtitlesWords';
import TimeConverter from '/imports/core/TimeConverter';

import translate from 'google-translate-api';

Meteor.startup(() => {
    console.log('starting');
    const test = 'testing';
    translate(test, {from: 'en', to: 'pt'})
        .then(res => {
            console.log(res.text);

            SubtitlesWords.insert({word: test, translatedWord: res.text, frequency: 1});
        })
        .catch(err => {
            console.error(err);
        });
    const data = fs.readFileSync(Meteor.rootPath + "/../../../../../subtitles/New.Girl.S01E01.srt", "utf8")
    const lines = data.split('\n');

    const words = [];
    let i = 0;
    while (i < lines.length) {
        const subtitleNumber = parseInt(lines[i++].trim());
        if (!subtitleNumber) {
            break;
        }
        const [timeStart, timeEnd] = lines[i++].split('-->');
        let text = lines[i++];

        while (i < lines.length && lines[i].trim() !== '') {
            text += lines[i];
            ++i;
        }
        ++i;

        text = text.replace('\r', '');
        text = text.replace(',', '');
        text = text.replace('.', '');
        text = text.replace('-', '');

        SubtitlesLines.upsert({subtitleNumber},
            {
                subtitleNumber,
                timeStart,
                milliSecondsStart: TimeConverter.fromTimeToMilliseconds(timeStart),
                timeEnd,
                milliSecondsEnd: TimeConverter.fromTimeToMilliseconds(timeEnd),
                text,
            });

        text.split(' ').forEach(word => {
            word = word.toLowerCase();
            const subtitleWord = SubtitlesWords.findOne({word});
            if (subtitleWord) {
                SubtitlesWords.update({word}, {$inc: {frequency: 1}});
            } else {
                // console.log('translate ', word);
                // translate(word, {from: 'en', to: 'pt'})
                //     .then(res => {
                //         console.log(res.text);
                words.push(word);
                SubtitlesWords.insert({word, frequency: 1});
                //     })
                //     .catch(err => {
                //         console.error(err);
                //     });
            }
        });

    }

    const promises = [];

    for (let i = 0; i < words.length; ++i) {
        const word = words[i];

        promises.push(translate(word, {from: 'en', to: 'pt'}));

    }

    Promise.all(promises)
        .then((values) => {
            for (let i = 0; i < values.length; ++i) {
                const value = values[i];
                SubtitlesWords.update({
                        word: words[i]
                    },
                    {
                        $set: {translatedWord: value.text}
                    });
            }
        });
});
