const Promise = require('bluebird');
const _ = require('lodash');

module.exports = class {

  constructor() {
    this.documents = [];
    this.lastId = 0;
  }

  nextId() {
    return ++this.lastId;
  }

  find() {
    return Promise.resolve(this.documents);
  }

  findOne(query) {
    const contact = _.find(this.documents, query);

    if (contact) {
      return Promise.resolve(contact);
    } else {
      return Promise.reject();
    }
  }

  insertOne(data) {
    const now = new Date().getTime();

    const contact = _.extend({}, data, {
      id: this.nextId(),
      createdAt: now,
      updatedAt: now
    });
    this.documents.push(contact);

    return Promise.resolve(contact);
  }

  updateOne(query, data) {
    return this.findOne(query).then((contact) => {
      const now = new Date().getTime();

      return _.extend(contact, data, {
        updatedAt: now
      });
    });
  }

  deleteOne(query) {
    return this.findOne(query).then((contact) => {
      const index = _.findIndex(this.documents, contact);
      this.documents.splice(index, 1);

      return Promise.resolve(index);
    });
  }

  deleteMany() {
    this.documents.splice(0, this.documents.length);
  }

};
