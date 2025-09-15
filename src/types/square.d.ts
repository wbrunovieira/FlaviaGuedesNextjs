export interface TokenizeResult {
  status: string;
  token: string;
  errors?: Array<{ message: string }>;
}

export interface SquareCard {
  attach: (elementId: string) => Promise<void>;
  tokenize: () => Promise<TokenizeResult>;
}

export interface SquareApplePay {
  tokenize: () => Promise<TokenizeResult>;
}

export interface SquareGooglePay {
  attach: (elementId: string) => Promise<void>;
  tokenize: () => Promise<TokenizeResult>;
}

export interface SquareCashApp {
  tokenize: () => Promise<TokenizeResult>;
}

export interface SquarePaymentRequest {
  countryCode: string;
  currencyCode: string;
  total: {
    amount: string;
    label: string;
  };
}

export interface SquarePaymentsInstance {
  card: () => Promise<SquareCard>;
  applePay: (request: SquarePaymentRequest) => Promise<SquareApplePay>;
  googlePay: (request: SquarePaymentRequest) => Promise<SquareGooglePay>;
  cashAppPay: (options: { redirectURL: string; referenceId: string }) => Promise<SquareCashApp>;
  paymentRequest: (request: SquarePaymentRequest) => SquarePaymentRequest;
}

export interface SquarePayments {
  payments: (appId: string) => SquarePaymentsInstance;
}

declare global {
  interface Window {
    Square: SquarePayments;
  }
}

export {};