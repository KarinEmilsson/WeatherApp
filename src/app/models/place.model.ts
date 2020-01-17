export class PlaceModel {
    public features : PlaceFeatureModel[];
}
export class PlaceFeatureModel {
    public geometry : PlacesCoordinatesModel;
    public properties : PlacesPropertiesModel;
}
export class PlacesCoordinatesModel {
    public coordinates : number[];
}
export class PlacesPropertiesModel {
    public name : string;
    public state : string;
    public country : string;
}
