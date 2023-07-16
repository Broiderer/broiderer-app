export type ConvertOptions = {[key in ConvertOptionType]?: string};

export enum ConvertOptionType { distance = 'distance', tolerance = 'tolerance' }