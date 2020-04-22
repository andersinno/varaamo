import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Map, TileLayer, ZoomControl } from 'react-leaflet';

import UnitMarker from '../../../common/map/UnitMarker';

class SearchMapResults extends React.Component {
  static propTypes = {
    unit: PropTypes.object,
    resource: PropTypes.object,
  };

  render() {
    const {
      unit,
      resource,
    } = this.props;

    // eslint-disable-next-line max-len
    const tileLayerUrl = 'https://api.mapbox.com/styles/v1/tampere/cjcvqn5gs0pxh2roieick30gf/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidGFtcGVyZSIsImEiOiJjamN2bHF0MWcwOTd2MzNxbzB4dDRhaGxsIn0.uJQvUx891JK-VwWuKocQgg';
    const coordinates = get(unit, 'location.coordinates');

    return (
      <div className="app-ResourceMap">
        <Map
          boundsOptions={{ padding: [50, 50] }}
          center={[coordinates[1], coordinates[0]]}
          className="app-ResourceMap__map"
          scrollWheelZoom={false}
          zoom={15}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={tileLayerUrl}
          />
          <ZoomControl position="bottomright" />
          <UnitMarker
            key={`unitMarker-${unit.id}`}
            resources={[resource]}
            unit={unit}
          />
        </Map>

      </div>
    );
  }
}

export default SearchMapResults;
