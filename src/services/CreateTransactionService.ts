import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const balance = this.transactionsRepository.getBalance();

    const missingParams = [];
    if (!title) missingParams.push('title');
    if (!value) missingParams.push('value');
    if (!type) missingParams.push('type');

    if (missingParams.length) {
      throw Error(`Missing param(s): ${missingParams.join(', ')}`);
    }

    if (type !== 'income' && type !== 'outcome') {
      throw Error(`'type' should be 'income' or 'outcome'`);
    }

    if (typeof value !== 'number') {
      throw Error(`'value' should be a number`);
    }

    if (type === 'outcome' && balance.total - value < 0) {
      throw Error('User cannot have negative balance');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
