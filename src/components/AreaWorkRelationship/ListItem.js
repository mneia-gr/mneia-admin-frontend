import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AreaWorkRelationshipListItem = ({ areaWorkRelationship }) => {
  const [area, setArea] = useState();
  const [type, setType] = useState();

  useEffect(
    () => {
      axios
        .get(`http://backend.mneia.gr/api/areas/${areaWorkRelationship.area}/`)
        .then((response) => {
          setArea(response.data)
        })
    },
    [areaWorkRelationship]
  )

  useEffect(
    () => {
      axios
        .get(`http://backend.mneia.gr/api/area-work-relationship-types/${areaWorkRelationship.type}/`)
        .then((response) => {
          setType(response.data)
        })
    },
    [areaWorkRelationship]
  )

  return (
    <li>
      <Link to={`/areas/${areaWorkRelationship.area}`}>{area && area.name}</Link>
      {' '}
      {type && `(${type.name})`}
      {areaWorkRelationship.note && <><br /><span className="text-muted">{areaWorkRelationship.note}</span></>}
    </li>
  );
}
 
export default AreaWorkRelationshipListItem;