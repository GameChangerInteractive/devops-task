import {AzureFunction, Context, HttpRequest} from '@azure/functions'
import {env} from 'process';
import * as IORedis from 'ioredis';
import {Collection, MongoClient} from 'mongodb';

let promiseCreateMongo: Promise<MongoClient>;
let mongo: MongoClient;
const redis = new IORedis(env.REDIS_URL);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  let count: number = parseInt(await redis.get('count'));
  const c = await getCountCollection();

  if (!count || isNaN(count)) {
    const result = await c.findOne({type: 'count'});

    if (result) {
      count = result.value;
    } else {
      count = 0;
      await c.insertOne({
        type: 'count',
        value: count,
      });
    }
  }

  // I know that both redis and mongo supports increment operator,
  // here we simulate TTL cache behavior
  count++;

  await Promise.all([
    redis.setex('count', 60, count),
    c.updateOne({
      type: 'count',
    }, {
      $set: {
        value: count,
      },
    }),
  ]);

  context.res = {
    body: `Visit #${count}`,
  };

};

async function getCountCollection(): Promise<Collection> {
  const c = await getMongoClient();
  return c.db(env.MONGODB_NAME).collection('count');
}

async function getMongoClient(): Promise<MongoClient> {
  if (mongo) {
    return mongo;
  } else if (promiseCreateMongo) {
    return promiseCreateMongo;
  }

  promiseCreateMongo = new MongoClient(env.MONGODB_URL, {useUnifiedTopology: true}).connect();
  mongo = await promiseCreateMongo;
  promiseCreateMongo = undefined;
  return mongo;
}

export default httpTrigger;
