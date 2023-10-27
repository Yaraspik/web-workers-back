import crypto from 'crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';

export default class NewsManager {
  static createNewsPack(count = 3) {
    const res = [];

    for (let index = 0; index < count; index += 1) {
      const news = NewsManager.createNews();
      res.push(news);
    }

    return res;
  }

  static createNews() {
    return {
      id: crypto.randomUUID(),
      description: faker.lorem.paragraph(),
      received: new Date(),
    };
  }
}
