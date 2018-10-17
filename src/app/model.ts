export namespace Responses {
  export interface InvoiceResult {
    result: Invoice
  }

  export interface Invoice {
    _id: string;
    _customerId: string;
    closed: boolean;
    day: number;
    month: number;
    year: number;
    amount: number;
    postings: Posting[];
    paymentCode: String;
    paid: boolean;
  }

  export interface Posting {
    _id: string;
    _serviceId: string;
    type: PostingType;
    description: string;
    amount: number;
  }

  export enum PostingType {
    balance = 'balance',
    charges = 'charges',
    income = 'income',
    service = 'service',
  }
}

export namespace Pagseguro {
  export interface Options {
    code: string;
  }

  export interface Callbacks {
    success: (transactionCode: string) => void;
    abort: () => void;
  }

}