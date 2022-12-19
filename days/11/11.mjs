import input_demo from './input_demo.js'
import input_real from './input_real.js'

const keywords = [
    "Monkey", "Starting items", "Operation", "Test",
    "divisible by", "If", "true", "false", "throw",
    "to", "monkey", "new", "old"
];

const operators = ["*", "+", "=", ":", ","]

function* tokenize(input) {
    const buf = [];
    for(const ch of input) {
        if(Number.isInteger(parseInt(ch))) {
            yield ch;
            continue;
        }
        if(buf.length === 0 && ch.match(/\s/)) {
            yield ch;
            continue;
        }
        if(operators.includes(ch)) {
            yield ch;
            continue;
        }
        buf.push(ch);
        const str = buf.join('');
        if(keywords.includes(str)) {
            buf.length = 0;
            yield str;
        }
    }
}

const model = input => {
    const generator = tokenize(input);

    let value = '';
    let done = false;

    const next = () => {
        const n = generator.next();
        value = n.value;
        done = n.done;
    }

    const accept = s => {
        if(value.match(s)) {
            next();
            return true;
        }
        return false;
    }

    const expect = s => {
        if(accept(s)) {
            return true;
        }
        throw new Error(`expect: unexpected symbol [ ${value} ]`);
    }

    const number = (buf = []) => {
        buf.push(value);
        if(accept(/\d/)) {
            return number(buf);
        }
        return parseInt(buf.join(''))
    }

    const list = (cur = []) => {
        const buf = [];
        const next = [...cur, number()];
        if(accept(/,/)) {
            expect(/\s+/);
            return list(next)
        }
        return next
    }

    const Monkey = () => {
        expect(/Monkey/);
        expect(/\s/);
        const id = number();
        expect(/:/);
        expect(/\n/);
        expect(/\s/);
        expect(/\s/);
        expect(/Starting items/);
        expect(/:/)
        expect(/\s/)
        const startingItems = list();
        done = true;
        return {
            id,
            startingItems
        }
    }


    next();

    const monkeys = []

    while(!done) {
        monkeys.push(Monkey());
    }

    return monkeys;
}

const data = model(input_demo)

console.log(data);
