
const TimeConverter  = require('./TimeConverter');

test('adds 1 + 2 to equal 3', () => {
    expect(TimeConverter.fromTimeToMilliseconds('00:00:01,270')).toBe(1270);
});