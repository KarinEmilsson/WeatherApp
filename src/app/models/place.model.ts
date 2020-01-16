export class PlaceModel {
    public address : AddressModel;
}

export class AddressModel {
    public village : string;
    public country : string;
}


export class PlaceCoordinatesModel {
    public lat : string;
    public lon : string;
    public display_name : string;
}