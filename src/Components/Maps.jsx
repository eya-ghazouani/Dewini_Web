import React, { useState } from 'react';
import { Map, Marker, GeoJson, ZoomControl     } from "pigeon-maps";

const Maps = () => {
    const [hue, setHue] = useState(0);
    const color = `hsl(${hue % 360}deg 39% 70%)`;
    return (
        <Map 
            height={'100%'} 
            defaultCenter={[37.23497657429308, 9.885471223966846]} 
            defaultZoom={13}
            onClick={({ event, latLng, pixel }) => {
                console.log('map was clicked');
                // console.log(event);
                console.log(latLng);
                // console.log(pixel);
            }}
        >
            <ZoomControl />
            <Marker 
                width={50}
                anchor={[37.23497657429308, 9.885471223966846]} 
                color={color} 
                onClick={() => setHue(hue + 50)} 
            />
        </Map>
    )
}

export default Maps