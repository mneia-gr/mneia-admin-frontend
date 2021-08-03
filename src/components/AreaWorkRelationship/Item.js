import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Returns a Area-Work Relationship as a list item or as a table row.
 * @param {object} areaWorkRelationship
 * @param {string} scope - either 'area' or 'work'
 * @param {string} as - either 'li' or 'tr'
 * @returns 
 */
const AreaWorkRelationshipItem = ({ areaWorkRelationship, scope, as }) => {
  const [area, setArea] = useState();
  const [work, setWork] = useState();
  const [type, setType] = useState();

  useEffect(
    () => {
      if (scope === "area") {
        axios
          .get(`http://backend.mneia.gr/api/areas/${areaWorkRelationship.area}/`)
          .then((response) => {
            setArea(response.data)
          })
      }
    },
    [areaWorkRelationship, scope]
  )

  useEffect(
    () => {
      if (scope === "work") {
        axios
          .get(`http://backend.mneia.gr/api/works/${areaWorkRelationship.work}/`)
          .then((response) => {
            setWork(response.data)
          })
      }
    },
    [areaWorkRelationship, scope]
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

  if (scope === "area" && as === "li") {
    return (
      <li>
        <Link to={`/areas/${areaWorkRelationship.area}`}>{area && area.name}</Link>
        {' '}
        {type && `(${type.name})`}
        {areaWorkRelationship.note && <><br /><span className="text-muted">{areaWorkRelationship.note}</span></>}
      </li>
    );
  } else if (scope === "work" && as === "tr") {
    return (
      <tr>
        <td>
          <Link to={`/works/${areaWorkRelationship.work}`}>{work && work.name}</Link>
        </td>
        <td>{type && type.name}</td>
        <td>{areaWorkRelationship.note}</td>
      </tr>
    )
  }
}

export default AreaWorkRelationshipItem;