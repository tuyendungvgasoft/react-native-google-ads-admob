import { RevenuePrecisions } from '../common/constants';

export type PaidEvent = {
  currency: string;
  precision: RevenuePrecisions;
  value: number;
  responseInfo?: {
    Adapter: string;
    Latency: number;
    'Ad Source Name': string;
    'Ad Source ID': string;
    'Ad Source Instance Name': string;
    'Ad Source Instance ID': string;
    Credentials?: Record<string, string>;
  };
};

export type PaidEventListener = (event: PaidEvent) => void;
