const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2); // slow solution but it is great for this example
}

sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message))); //calculate fibonacci value, then insert into hash called 'values': key = 'message' ; value = 'calculated fibonacci value'
});
sub.subscribe('insert'); // anytime someone inserts new value into redis it will calculate fib