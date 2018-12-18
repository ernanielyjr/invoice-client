export namespace Responses {
  export interface InvoiceResult {
    result: Invoice;
  }

  export interface PaymentCodeResult {
    result: string;
  }

  export interface PaymentSessionResult {
    result: string;
  }

  export interface PaymentBilletResult {
    result: string;
  }

  export interface Invoice {
    _id: string;
    _customerId: string;
    customer: Customer;
    closed: boolean;
    dueDate?: Date;
    month: number;
    year: number;
    amount?: number;
    postings: Posting[];
    paymentData?: string;
    paymentMode?: string;
    read: boolean;
    paid: boolean;
    deferredPayment: boolean;
    lastStatus?: InvoiceStatus;
    lastStatusTime?: Date;
  }

  export interface Posting {
    _id: string;
    _serviceId: string;
    type: PostingType;
    description: string;
    amount: number;
  }

  export enum InvoiceStatus {
    AGUARDANDO_PAGAMENTO = '1',
    EM_ANALISE           = '2',
    PAGA                 = '3',
    DISPONIVEL           = '4',
    EM_DISPUTA           = '5',
    DEVOLVIDA            = '6',
    CANCELADA            = '7',
    DEBITADO             = '8',
    RETENCAO_TEMPORARIA  = '9',
  }

  export enum PostingType {
    balance = 'balance',
    charges = 'charges',
    income = 'income',
    service = 'service',
  }

  export interface Customer {
    name: string;
    emails: string[];
    phones: string[];
    documentNumber: string;
    documentType: string;
    responsibleName?: string;
    invoiceMaturity: number;
    address?: Address;
    emitNFSe: boolean;
    notes?: string[];
  }

  export interface Address {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
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
