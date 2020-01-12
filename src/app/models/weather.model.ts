export class WeatherModel {
    public timeSeries : TimeSerie[];
}

export class TimeSerie {
    public validTime : string;
    public parameters : Parameter[];
}

export class Parameter {
    name: string;
    levelType: string;
    level: number;
    unit: string;
    values: number[];
}