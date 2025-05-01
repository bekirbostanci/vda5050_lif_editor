export interface RosGeoJson {
  crs: {
    properties: { name: string };
    type: string;
  };
  type: "FeatureCollection";
  name: string;
  features: Array<any>;
}