import {
  Fill as FillStyle,
  Icon as IconStyle,
  Stroke as StrokeStyle,
  Style,
  Text as TextStyle,
} from 'ol/style';

export default function createMapboxStreetsV6Style() {
  const fill = new FillStyle({ color: '' });
  const stroke = new StrokeStyle({ color: '', width: 1 });
  const polygon = new Style({ fill });
  const strokedPolygon = new Style({ fill, stroke });
  const line = new Style({ stroke });
  const text = new Style({
    text: new TextStyle({
      text: '',
      fill,
      stroke,
    }),
  });
  const iconCache = {};

  function getIcon(iconName) {
    let icon = iconCache[iconName];

    if (!icon) {
      icon = new Style({
        image: new IconStyle({
          src: `https://unpkg.com/@mapbox/maki@4.0.0/icons/${iconName}-15.svg`,
          imgSize: [15, 15],
          crossOrigin: 'anonymous',
        }),
      });
      iconCache[iconName] = icon;
    }

    return icon;
  }
  const styles = [];

  return function setStyles(feature, resolution) {
    let length = 0;
    const layer = feature.get('layer');
    const cls = feature.get('class');
    const type = feature.get('type');
    const scalerank = feature.get('scalerank');
    const labelrank = feature.get('labelrank');
    const adminLevel = feature.get('admin_level');
    const maritime = feature.get('maritime');
    const disputed = feature.get('disputed');
    const maki = feature.get('maki');
    const geom = feature.getGeometry().getType();

    if (layer === 'landuse' && cls === 'park') {
      fill.setColor('#d8e8c8');
      styles[length] = polygon;
      length += 1;
    } else if (layer === 'landuse' && cls === 'cemetery') {
      fill.setColor('#e0e4dd');
      styles[length] = polygon;
      length += 1;
    } else if (layer === 'landuse' && cls === 'hospital') {
      fill.setColor('#fde');
      styles[length] = polygon;
      length += 1;
    } else if (layer === 'landuse' && cls === 'school') {
      fill.setColor('#f0e8f8');
      styles[length] = polygon;
      length += 1;
    } else if (layer === 'landuse' && cls === 'wood') {
      fill.setColor('rgb(233,238,223)');
      styles[length] = polygon;
      length += 1;
    } else if (
      layer === 'waterway' &&
      cls !== 'river' &&
      cls !== 'stream' &&
      cls !== 'canal'
    ) {
      stroke.setColor('#a0c8f0');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'waterway' && cls === 'river') {
      stroke.setColor('#a0c8f0');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'waterway' && (cls === 'stream' || cls === 'canal')) {
      stroke.setColor('#a0c8f0');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'water') {
      fill.setColor('#a0c8f0');
      styles[length] = polygon;
      length += 1;
    } else if (layer === 'aeroway' && geom === 'Polygon') {
      fill.setColor('rgb(242,239,235)');
      styles[length] = polygon;
      length += 1;
    } else if (
      layer === 'aeroway' &&
      geom === 'LineString' &&
      resolution <= 76.43702828517625
    ) {
      stroke.setColor('#f0ede9');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'building') {
      fill.setColor('#f2eae2');
      stroke.setColor('#dfdbd7');
      stroke.setWidth(1);
      styles[length] = strokedPolygon;
      length += 1;
    } else if (layer === 'tunnel' && cls === 'motorway_link') {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'tunnel' && cls === 'service') {
      stroke.setColor('#cfcdca');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (
      layer === 'tunnel' &&
      (cls === 'street' || cls === 'street_limited')
    ) {
      stroke.setColor('#cfcdca');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (
      layer === 'tunnel' &&
      cls === 'main' &&
      resolution <= 1222.99245256282
    ) {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'tunnel' && cls === 'motorway') {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'tunnel' && cls === 'path') {
      stroke.setColor('#cba');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'tunnel' && cls === 'major_rail') {
      stroke.setColor('#bbb');
      stroke.setWidth(2);
      styles[length] = line;
      length += 1;
    } else if (layer === 'road' && cls === 'motorway_link') {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (
      layer === 'road' &&
      (cls === 'street' || cls === 'street_limited') &&
      geom === 'LineString'
    ) {
      stroke.setColor('#cfcdca');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (
      layer === 'road' &&
      cls === 'main' &&
      resolution <= 1222.99245256282
    ) {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (
      layer === 'road' &&
      cls === 'motorway' &&
      resolution <= 4891.96981025128
    ) {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'road' && cls === 'path') {
      stroke.setColor('#cba');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'road' && cls === 'major_rail') {
      stroke.setColor('#bbb');
      stroke.setWidth(2);
      styles[length] = line;
      length += 1;
    } else if (layer === 'bridge' && cls === 'motorway_link') {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'bridge' && cls === 'motorway') {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'bridge' && cls === 'service') {
      stroke.setColor('#cfcdca');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (
      layer === 'bridge' &&
      (cls === 'street' || cls === 'street_limited')
    ) {
      stroke.setColor('#cfcdca');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (
      layer === 'bridge' &&
      cls === 'main' &&
      resolution <= 1222.99245256282
    ) {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'bridge' && cls === 'path') {
      stroke.setColor('#cba');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'bridge' && cls === 'major_rail') {
      stroke.setColor('#bbb');
      stroke.setWidth(2);
      styles[length] = line;
      length += 1;
    } else if (layer === 'admin' && adminLevel >= 3 && maritime === 0) {
      stroke.setColor('#9e9cab');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (
      layer === 'admin' &&
      adminLevel === 2 &&
      disputed === 0 &&
      maritime === 0
    ) {
      stroke.setColor('#9e9cab');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (
      layer === 'admin' &&
      adminLevel === 2 &&
      disputed === 1 &&
      maritime === 0
    ) {
      stroke.setColor('#9e9cab');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'admin' && adminLevel >= 3 && maritime === 1) {
      stroke.setColor('#a0c8f0');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'admin' && adminLevel === 2 && maritime === 1) {
      stroke.setColor('#a0c8f0');
      stroke.setWidth(1);
      styles[length] = line;
      length += 1;
    } else if (layer === 'country_label' && scalerank === 1) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('bold 11px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#334');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(2);
      styles[length] = text;
      length += 1;
    } else if (
      layer === 'country_label' &&
      scalerank === 2 &&
      resolution <= 19567.87924100512
    ) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('bold 10px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#334');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(2);
      styles[length] = text;
      length += 1;
    } else if (
      layer === 'country_label' &&
      scalerank === 3 &&
      resolution <= 9783.93962050256
    ) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('bold 9px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#334');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(2);
      styles[length] = text;
      length += 1;
    } else if (
      layer === 'country_label' &&
      scalerank === 4 &&
      resolution <= 4891.96981025128
    ) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('bold 8px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#334');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(2);
      styles[length] = text;
      length += 1;
    } else if (
      layer === 'marine_label' &&
      labelrank === 1 &&
      geom === 'Point'
    ) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('italic 11px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#74aee9');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length] = text;
      length += 1;
    } else if (
      layer === 'marine_label' &&
      labelrank === 2 &&
      geom === 'Point'
    ) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('italic 11px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#74aee9');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length] = text;
      length += 1;
    } else if (
      layer === 'marine_label' &&
      labelrank === 3 &&
      geom === 'Point'
    ) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('italic 10px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#74aee9');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length] = text;
      length += 1;
    } else if (
      layer === 'marine_label' &&
      labelrank === 4 &&
      geom === 'Point'
    ) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('italic 9px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#74aee9');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length] = text;
      length += 1;
    } else if (
      layer === 'place_label' &&
      type === 'city' &&
      resolution <= 1222.99245256282
    ) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('11px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#333');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length] = text;
      length += 1;
    } else if (
      layer === 'place_label' &&
      type === 'town' &&
      resolution <= 305.748113140705
    ) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('9px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#333');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length] = text;
      length += 1;
    } else if (
      layer === 'place_label' &&
      type === 'village' &&
      resolution <= 38.21851414258813
    ) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('8px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#333');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length] = text;
      length += 1;
    } else if (
      layer === 'place_label' &&
      resolution <= 19.109257071294063 &&
      (type === 'hamlet' || type === 'suburb' || type === 'neighbourhood')
    ) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('bold 9px "Arial Narrow"');
      fill.setColor('#633');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length] = text;
      length += 1;
    } else if (
      layer === 'poi_label' &&
      resolution <= 19.109257071294063 &&
      scalerank === 1 &&
      maki !== 'marker'
    ) {
      styles[length] = getIcon(maki);
      length += 1;
    } else if (
      layer === 'poi_label' &&
      resolution <= 9.554628535647032 &&
      scalerank === 2 &&
      maki !== 'marker'
    ) {
      styles[length] = getIcon(maki);
      length += 1;
    } else if (
      layer === 'poi_label' &&
      resolution <= 4.777314267823516 &&
      scalerank === 3 &&
      maki !== 'marker'
    ) {
      styles[length] = getIcon(maki);
      length += 1;
    } else if (
      layer === 'poi_label' &&
      resolution <= 2.388657133911758 &&
      scalerank === 4 &&
      maki !== 'marker'
    ) {
      styles[length] = getIcon(maki);
      length += 1;
    } else if (
      layer === 'poi_label' &&
      resolution <= 1.194328566955879 &&
      scalerank >= 5 &&
      maki !== 'marker'
    ) {
      styles[length] = getIcon(maki);
      length += 1;
    }
    styles.length = length;

    return styles;
  };
}
