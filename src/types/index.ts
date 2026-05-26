export interface GainData {
  balance: number;
  gain: number;
}

export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainData;
  ltcg: GainData;
}

export interface CapitalGainsBracket {
  profits: number;
  losses: number;
}

export interface CapitalGains {
  stcg: CapitalGainsBracket;
  ltcg: CapitalGainsBracket;
}

export interface CapitalGainsResponse {
  capitalGains: CapitalGains;
}
