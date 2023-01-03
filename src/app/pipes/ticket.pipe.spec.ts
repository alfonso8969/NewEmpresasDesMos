import { TicketPipe } from './ticket.pipe';

describe('TicketPipe', () => {
  it('create an instance', () => {
    const pipe = new TicketPipe();
    expect(pipe).toBeTruthy();
  });
});
