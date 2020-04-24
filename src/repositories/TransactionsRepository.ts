import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreatedTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    return this.transactions.reduce(
      (acc, transaction) => {
        const { type, value } = transaction;
        const { income, outcome } = acc;

        const newIncome = income + (type === 'income' ? value : 0);
        const newOutcome = outcome + (type === 'outcome' ? value : 0);
        const newTotal = newIncome - newOutcome;

        return {
          income: newIncome,
          outcome: newOutcome,
          total: newTotal,
        };
      },
      { income: 0, outcome: 0, total: 0 } as Balance,
    );
  }

  public create({ title, value, type }: CreatedTransaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
