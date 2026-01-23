export class WrongStatusException extends Error {
  constructor() {
    super('Wrong task status transition!');
    this.name = 'WrongStatusException';
  }
}
